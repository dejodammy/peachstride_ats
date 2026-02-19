// pages/api/applicants/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { prisma } from "../../lib/prisma";

export const config = { api: { bodyParser: false } };

type ResponseData =
  | { ok: true; applicantId: string }
  | { ok: false; error: string };

function parseForm(
  req: NextApiRequest,
  form: InstanceType<typeof formidable.Formidable>
): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

  try {
    const { fields, files } = await parseForm(req, form);

    const firstName = (fields.firstName as string | string[] | undefined) ?? "";
    const lastName = (fields.lastName as string | string[] | undefined) ?? "";
    const phone = (fields.phone as string | string[] | undefined) ?? "";
    const email = (fields.email as string | string[] | undefined) ?? "";
    const gender = (fields.gender as string | string[] | undefined) ?? null;
    const address = (fields.address as string | string[] | undefined) ?? null;
    const state = (fields.state as string | string[] | undefined) ?? null;
    const age = fields.age
      ? parseInt(Array.isArray(fields.age) ? fields.age[0] : (fields.age as string), 10)
      : null;

    // --- handle files ---
    let cvUrl: string | null = null;
    let nyscUrl: string | null = null;

    if (files.cv) {
      const f = Array.isArray(files.cv) ? files.cv[0] : files.cv;
      const ext = path.extname(f.originalFilename || "cv");
      const safeName = `cv_${Date.now()}${ext}`;
      const newPath = path.join(uploadDir, safeName);
      const tempPath = f.filepath || f.path;
      await fs.promises.rename(tempPath, newPath);
      cvUrl = `/uploads/${safeName}`;
    }

    if (files.nysc) {
      const f = Array.isArray(files.nysc) ? files.nysc[0] : files.nysc;
      const ext = path.extname(f.originalFilename || "nysc");
      const safeName = `nysc_${Date.now()}${ext}`;
      const newPath = path.join(uploadDir, safeName);
      const tempPath = f.filepath || f.path;
      await fs.promises.rename(tempPath, newPath);
      nyscUrl = `/uploads/${safeName}`;
    }

    // --- create applicant with file URLs ---
    const applicant = await prisma.applicant.create({
      data: {
        firstName: Array.isArray(firstName) ? firstName[0] : firstName,
        lastName: Array.isArray(lastName) ? lastName[0] : lastName,
        phone: Array.isArray(phone) ? phone[0] : phone,
        email: Array.isArray(email) ? email[0] : email,
        gender: Array.isArray(gender) ? gender[0] : gender,
        address: Array.isArray(address) ? address[0] : address,
        state: Array.isArray(state) ? state[0] : state,
        age,
        cv: cvUrl,
        nysc: nyscUrl,
      },
    });

    return res.status(201).json({ ok: true, applicantId: applicant.id });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ ok: false, error: "Server error saving applicant" });
  }
}

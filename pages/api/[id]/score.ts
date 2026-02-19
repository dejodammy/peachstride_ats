// pages/api/[id]/score.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid applicant ID" });
  }

  // ✅ Handle GET requests (fetch applicant)
  if (req.method === "GET") {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id: Number(id) },
      });

      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      return res.status(200).json(applicant);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch applicant" });
    }
  }

  // ✅ Handle PUT requests (update score)
  if (req.method === "PUT") {
    const { score, passed } = req.body;

    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id: Number(id) },
      });

      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      if (applicant.score !== null) {
        // ❌ Prevent retake
        return res.status(400).json({ error: "Applicant has already taken the test." });
      }

      const updated = await prisma.applicant.update({
        where: { id: Number(id) },
        data: { score, passed },
      });

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update applicant" });
    }
  }

  // ❌ Any other method
  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

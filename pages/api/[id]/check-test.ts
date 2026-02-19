// pages/api/[id]/check-test.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ taken: false });
  }

  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: Number(id) },
      select: { score: true },
    });

    const taken = applicant?.score !== null;
    return res.status(200).json({ taken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ taken: false });
  }
}

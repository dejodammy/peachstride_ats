// pages/api/applicants/[id]/score.ts
import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // ✅ get id from query string

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid applicant ID" });
  }

  if (req.method === "PUT") {
    const { score, passed } = req.body;

    try {
      const updated = await prisma.applicant.update({
        where: { id: Number(id) }, // convert id to number
        data: { score, passed },
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update applicant" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

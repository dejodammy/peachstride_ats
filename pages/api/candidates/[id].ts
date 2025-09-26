import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const candidate = await prisma.applicant.findUnique({
        where: { id: Number(id) },
      });

      if (!candidate) {
        return res.status(404).json({ message: "Not found" });
      }

      res.status(200).json(candidate);
    } catch (err) {
      res.status(500).json({ message: "Internal server error", error: err });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

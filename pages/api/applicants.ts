import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { firstName, lastName, phone, email, gender, address, state, age, cv, nysc , jobId} = req.body;

      const applicant = await prisma.applicant.create({
        data: {
          firstName,
          lastName,
          phone,
          email,
          gender,
          address,
          state,
          age: age ? Number(age) : null,
          cv,
          nysc,
          job: jobId ? { connect: { id: jobId } } : undefined,
        }
      });

      res.status(201).json(applicant);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    const applicants = await prisma.applicant.findMany();
    res.status(200).json(applicants);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

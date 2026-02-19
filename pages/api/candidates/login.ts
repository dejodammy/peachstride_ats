// pages/api/candidates/login.ts
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

type Data =
  | { id: number; name: string }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("=== LOGIN API CALLED ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);

  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log("Searching for applicant with email:", email);

    // Ensure DB connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return res.status(500).json({ message: "Database connection error" });
    }

    const candidate = await prisma.applicant.findFirst({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true, // could be string | null
      },
    });

    if (!candidate) {
      return res.status(401).json({ message: "No candidate found with this email" });
    }

    if (!candidate.password) {
      return res.status(400).json({ message: "This account has no password set" });
    }

    const passwordMatch = await bcrypt.compare(password, candidate.password || "");
    if (!passwordMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Incorrect password" });
    }

    console.log("Login successful for candidate ID:", candidate.id);

    return res.status(200).json({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
    });
  } catch (err) {
    console.error("Login API error:", err);
    return res.status(500).json({
      message:
        process.env.NODE_ENV === "development"
          ? `Server error: ${err}`
          : "Internal server error",
    });
  }
}

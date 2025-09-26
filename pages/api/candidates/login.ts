// pages/api/candidates/login.ts
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

// Create a global instance to avoid multiple connections in development
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
  console.log('=== LOGIN API CALLED ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  // Always ensure we return JSON
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: "Email and phone are required" });
    }

    console.log('Searching for applicant with email:', email);

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return res.status(500).json({ message: "Database connection error" });
    }

    const candidate = await prisma.applicant.findFirst({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true
      }
    });

    console.log('Database query result:', candidate ? 'Found' : 'Not found');

    if (!candidate) {
      return res.status(401).json({ message: "No candidate found with this email" });
    }

    if (candidate.phone !== phone) {
      console.log('Phone mismatch - provided:', phone, 'stored:', candidate.phone);
      return res.status(401).json({ message: "Phone number does not match" });
    }

    console.log('Login successful for candidate ID:', candidate.id);

    return res.status(200).json({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
    });

  } catch (err) {
    console.error("Login API error:", err);
    
    // Return a safe error message
    return res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server error: ${err}` 
        : "Internal server error"
    });
  }
}
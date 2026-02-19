import {prisma} from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedApplicant = await prisma.applicant.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating password",
    });
  }
}

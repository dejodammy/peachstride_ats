import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { applicantId, password } = req.body;
  if (!applicantId || !password)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.applicant.update({
      where: { id: parseInt(applicantId) },
      data: { password: hashed },
    });
    res.status(200).json({ message: "Password created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

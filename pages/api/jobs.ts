import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

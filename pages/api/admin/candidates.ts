// pages/api/admin/candidates.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

/**
 * Use a global prisma instance to prevent creating too many clients during hot reloads (dev).
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const candidates = await prisma.applicant.findMany({ orderBy: { createdAt: "desc" } });
      return res.status(200).json(candidates);
    }

    if (req.method === "PUT") {
      const { id, data } = req.body;
      if (!id || !data) return res.status(400).json({ error: "Missing id or data" });

      // convert any *date fields from client (they come as ISO strings) to Date
      const updates: Record<string, any> = {};
      for (const key of Object.keys(data)) {
        const value = data[key];
        if (value === "" || value === null) {
          updates[key] = null;
        } else if (key.toLowerCase().endsWith("date")) {
          // try to parse date
          const d = new Date(value);
          if (isNaN(d.getTime())) {
            return res.status(400).json({ error: `Invalid date for ${key}` });
          }
          updates[key] = d;
        } else {
          updates[key] = value;
        }
      }

      const updated = await prisma.applicant.update({
        where: { id: Number(id) },
        data: updates,
      });
      return res.status(200).json(updated);
    }

    // bulk actions
    if (req.method === "POST") {
      const { action } = req.body;
      if (action === "bulkUpdate") {
        const { ids, data } = req.body;
        if (!Array.isArray(ids) || !data) return res.status(400).json({ error: "Missing ids or data" });

        // convert date fields in data
        const updates: Record<string, any> = {};
        for (const key of Object.keys(data)) {
          const value = data[key];
          if (value === "" || value === null) updates[key] = null;
          else if (key.toLowerCase().endsWith("date")) {
            const d = new Date(value);
            if (isNaN(d.getTime())) return res.status(400).json({ error: `Invalid date for ${key}` });
            updates[key] = d;
          } else updates[key] = value;
        }

        // perform updates (transaction)
        const ops = ids.map((id: number) =>
          prisma.applicant.update({ where: { id: Number(id) }, data: updates })
        );
        const updated = await prisma.$transaction(ops);
        return res.status(200).json(updated);
      }

      return res.status(400).json({ error: "Unknown action" });
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "Missing id query param" });
      const deleted = await prisma.applicant.delete({ where: { id: Number(id) } });
      return res.status(200).json(deleted);
    }

    res.setHeader("Allow", ["GET", "PUT", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

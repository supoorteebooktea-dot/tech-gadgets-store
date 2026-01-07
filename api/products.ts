import { VercelRequest, VercelResponse } from '@vercel/node';

import { drizzle } from 'drizzle-orm/mysql2';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { featured, id } = req.query;

  try {
    if (id) {
      const product = await db.select().from(products).where(eq(products.id, Number(id))).limit(1);
      return res.status(200).json({ success: true, data: product[0] });
    }

    let query = db.select().from(products);
    
    if (featured === 'true') {
      const result = await db.select().from(products).where(eq(products.featured, true));
      return res.status(200).json({ success: true, data: result });
    }

    const result = await db.select().from(products);
    res.status(200).json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
}

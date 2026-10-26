import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.execute(sql`
  SELECT id, title, 
    SUBSTRING(content, 1, 3000) as content_preview
  FROM blogs WHERE id = 60003
`);

console.log(result[0][0].content_preview);
await connection.end();

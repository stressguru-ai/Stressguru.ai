import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.execute(sql`
  SELECT id, title, 
    CASE WHEN content LIKE '%callout-box%' THEN 'YES' ELSE 'NO' END as has_callout,
    CASE WHEN content LIKE '%<h3%Key Takeaway%' THEN 'YES' ELSE 'NO' END as has_key_takeaway
  FROM blogs ORDER BY id DESC
`);

console.log(JSON.stringify(result[0], null, 2));
await connection.end();

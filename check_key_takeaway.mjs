import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.execute(sql`
  SELECT id, title, 
    SUBSTRING(content, LOCATE('Key Takeaway', content) - 100, 500) as key_takeaway_section
  FROM blogs WHERE id = 60003
`);

console.log(result[0][0].key_takeaway_section);
await connection.end();

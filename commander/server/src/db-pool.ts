import mysql from "mysql2/promise";
import { getConnection } from "./config.js";

const pools = new Map<string, mysql.Pool>();

export function getPool(connectionName: string): mysql.Pool {
  const existing = pools.get(connectionName);
  if (existing) return existing;

  const conn = getConnection(connectionName);
  const pool = mysql.createPool({
    host: conn.host,
    port: conn.port ?? 3306,
    user: conn.user,
    password: conn.password,
    database: conn.database,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0,
  });

  pools.set(connectionName, pool);
  return pool;
}

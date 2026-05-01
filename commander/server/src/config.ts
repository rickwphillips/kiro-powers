import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface ConnectionConfig {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
}

export interface ServerConfig {
  connections: Record<string, ConnectionConfig>;
}

const DEFAULT_PATH = join(homedir(), ".config", "kiro-powers", "commander", "config.json");

let cached: ServerConfig | null = null;

export function loadConfig(): ServerConfig {
  if (cached) return cached;

  const configPath = process.env.KIRO_COMMANDER_CONFIG ?? DEFAULT_PATH;

  if (!existsSync(configPath)) {
    cached = { connections: {} };
    return cached;
  }

  const raw = readFileSync(configPath, "utf8");
  const parsed = JSON.parse(raw) as ServerConfig;

  if (!parsed.connections || typeof parsed.connections !== "object") {
    throw new Error(`Invalid config at ${configPath}: missing "connections" object`);
  }
  for (const [name, conn] of Object.entries(parsed.connections)) {
    for (const required of ["host", "user", "password", "database"] as const) {
      if (!conn[required]) {
        throw new Error(`Invalid config at ${configPath}: connection "${name}" missing "${required}"`);
      }
    }
  }

  cached = parsed;
  return cached;
}

export function getConnection(name: string): ConnectionConfig {
  const config = loadConfig();
  const conn = config.connections[name];
  if (!conn) {
    const available = Object.keys(config.connections).join(", ") || "(none configured)";
    const configPath = process.env.KIRO_COMMANDER_CONFIG ?? DEFAULT_PATH;
    throw new Error(`Unknown connection "${name}". Available: ${available}. Configure at ${configPath}.`);
  }
  return conn;
}

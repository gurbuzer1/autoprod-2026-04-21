import fs from 'fs';
import path from 'path';
import os from 'os';

export interface ContextVaultConfig {
  apiUrl: string;
  token: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.contextvault');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: ContextVaultConfig = {
  apiUrl: 'http://localhost:4000',
  token: '',
};

export function loadConfig(): ContextVaultConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    return DEFAULT_CONFIG;
  }

  const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
  const parsed = JSON.parse(raw) as Partial<ContextVaultConfig>;

  return {
    apiUrl: parsed.apiUrl ?? DEFAULT_CONFIG.apiUrl,
    token: parsed.token ?? DEFAULT_CONFIG.token,
  };
}

export function saveConfig(config: Partial<ContextVaultConfig>): void {
  const current = loadConfig();
  const updated = { ...current, ...config };

  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}

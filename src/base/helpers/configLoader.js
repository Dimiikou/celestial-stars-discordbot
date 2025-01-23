import { readFile } from 'fs/promises';
import path from 'path';

async function loadConfig(filename) {
    try {
        const configPath = path.resolve(process.cwd(), filename);
        const configContent = await readFile(configPath, 'utf8');
        return JSON.parse(configContent);
    } catch (error) {
        console.error(`Fehler beim Laden von ${filename}:`, error);
        return null;
    }
}

export async function initConfigs() {
    const config = await loadConfig('../configs/config.json');
    const webhookConfig = await loadConfig('../configs/webhookConfig.json');

    return {
        config,
        webhookConfig
    };
}
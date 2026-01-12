import { promises as fs } from 'fs';
import path from 'path';

/**
 * Đọc file JSON từ đường dẫn
 */
export async function readJSON<T>(filePath: string): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

/**
 * Ghi dữ liệu vào file JSON
 */
export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    throw new Error(`Failed to write file: ${filePath}`);
  }
}

/**
 * Tạo slug từ chuỗi
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

import { readFile } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';

export type PptxInspection = {
  slideCount: number;
  slideSize?: string;
  entries: string[];
  texts: string[];
  colors: string[];
  fonts: string[];
  shapeCount: number;
  relationshipCount: number;
  missingImages: string[];
  unsupportedMedia: string[];
  unknownFonts: string[];
  outOfBoundsShapes: string[];
};

type ZipEntry = {
  name: string;
  compression: number;
  compressedSize: number;
  localHeaderOffset: number;
};

function readUInt32(buffer: Buffer, offset: number): number {
  return buffer.readUInt32LE(offset);
}

function readUInt16(buffer: Buffer, offset: number): number {
  return buffer.readUInt16LE(offset);
}

function findEndOfCentralDirectory(buffer: Buffer): number {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (readUInt32(buffer, offset) === 0x06054b50) return offset;
  }
  throw new Error('PPTX zip EOCD not found');
}

function listZipEntries(buffer: Buffer): ZipEntry[] {
  const eocd = findEndOfCentralDirectory(buffer);
  const entryCount = readUInt16(buffer, eocd + 10);
  let offset = readUInt32(buffer, eocd + 16);
  const entries: ZipEntry[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (readUInt32(buffer, offset) !== 0x02014b50) break;
    const compression = readUInt16(buffer, offset + 10);
    const compressedSize = readUInt32(buffer, offset + 20);
    const nameLength = readUInt16(buffer, offset + 28);
    const extraLength = readUInt16(buffer, offset + 30);
    const commentLength = readUInt16(buffer, offset + 32);
    const localHeaderOffset = readUInt32(buffer, offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    entries.push({ name, compression, compressedSize, localHeaderOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function extractEntry(buffer: Buffer, entry: ZipEntry): Buffer {
  const offset = entry.localHeaderOffset;
  if (readUInt32(buffer, offset) !== 0x04034b50) {
    throw new Error(`Invalid local zip header: ${entry.name}`);
  }
  const nameLength = readUInt16(buffer, offset + 26);
  const extraLength = readUInt16(buffer, offset + 28);
  const dataStart = offset + 30 + nameLength + extraLength;
  const data = buffer.subarray(dataStart, dataStart + entry.compressedSize);
  if (entry.compression === 0) return data;
  if (entry.compression === 8) return inflateRawSync(data);
  throw new Error(`Unsupported zip compression ${entry.compression}: ${entry.name}`);
}

function decodeXmlText(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractTexts(xml: string): string[] {
  return [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)]
    .map((match) => decodeXmlText(match[1]))
    .filter(Boolean);
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

export async function inspectPptx(pptxPath: string): Promise<PptxInspection> {
  const buffer = await readFile(pptxPath);
  const zipEntries = listZipEntries(buffer);
  const entryNames = zipEntries.map((entry) => entry.name).sort();
  const slideEntries = zipEntries
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const relationshipEntries = zipEntries.filter((entry) => entry.name.includes('/_rels/'));
  const mediaEntries = zipEntries.filter((entry) => entry.name.startsWith('ppt/media/') && !entry.name.endsWith('/'));
  const texts: string[] = [];
  const colors: string[] = [];
  const fonts: string[] = [];
  let shapeCount = 0;

  for (const entry of slideEntries) {
    const xml = extractEntry(buffer, entry).toString('utf8');
    texts.push(...extractTexts(xml));
    colors.push(...[...xml.matchAll(/<a:srgbClr[^>]*\sval="([0-9A-Fa-f]{6})"/g)].map((match) => `#${match[1].toUpperCase()}`));
    fonts.push(...[...xml.matchAll(/typeface="([^"]+)"/g)].map((match) => match[1]));
    shapeCount += (xml.match(/<p:sp\b/g) ?? []).length;
  }

  return {
    slideCount: slideEntries.length,
    entries: entryNames,
    texts,
    colors: uniqueSorted(colors),
    fonts: uniqueSorted(fonts),
    shapeCount,
    relationshipCount: relationshipEntries.length,
    missingImages: [],
    unsupportedMedia: mediaEntries.filter((entry) => !/\.(png|jpg|jpeg|gif|svg)$/i.test(entry.name)).map((entry) => entry.name),
    unknownFonts: [],
    outOfBoundsShapes: []
  };
}

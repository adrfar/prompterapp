import JSZip from 'jszip';

const TXT_EXTENSION = '.txt';
const DOCX_EXTENSION = '.docx';

const hasExtension = (fileName: string, extension: string): boolean =>
  fileName.toLowerCase().endsWith(extension);

const normalizeWhitespace = (text: string): string =>
  text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

const parseDocxXml = (xmlText: string): string => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');

  if (xml.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Could not parse DOCX XML content.');
  }

  const paragraphNodes = Array.from(xml.getElementsByTagName('w:p'));

  const lines = paragraphNodes.map((paragraph) => {
    const textNodes = Array.from(paragraph.getElementsByTagName('w:t'));
    return textNodes.map((node) => node.textContent ?? '').join('').trimEnd();
  });

  return normalizeWhitespace(lines.join('\n'));
};

const parseDocxFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const documentXmlFile = zip.file('word/document.xml');

  if (!documentXmlFile) {
    throw new Error('DOCX file is missing the main document content.');
  }

  const xmlText = await documentXmlFile.async('string');
  const text = parseDocxXml(xmlText);

  if (!text) {
    throw new Error('No readable text found in the DOCX file.');
  }

  return text;
};

const parseTextFile = async (file: File): Promise<string> => {
  const text = normalizeWhitespace(await file.text());

  if (!text) {
    throw new Error('The text file is empty.');
  }

  return text;
};

export const isSupportedScriptFile = (file: File): boolean => {
  const name = file.name.toLowerCase();
  return hasExtension(name, TXT_EXTENSION) || hasExtension(name, DOCX_EXTENSION);
};

export const extractScriptFromFile = async (file: File): Promise<string> => {
  if (hasExtension(file.name, TXT_EXTENSION)) {
    return parseTextFile(file);
  }

  if (hasExtension(file.name, DOCX_EXTENSION)) {
    return parseDocxFile(file);
  }

  throw new Error('Unsupported file type. Please upload a .txt or .docx file.');
};

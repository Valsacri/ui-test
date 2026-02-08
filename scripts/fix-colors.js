import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const REPLACEMENTS = [
  // Primary color
  ["bg-[#003C66]", "bg-primary"],
  ["hover:bg-[#002A4A]", "hover:bg-primary/90"],
  ["text-[#003C66]", "text-primary"],
  ["border-[#003C66]", "border-primary"],
  ["from-[#003C66]", "from-primary"],
  ["to-[#005A99]", "to-primary/70"],
  ["ring-[#003C66]", "ring-primary"],
  
  // Secondary color
  ["bg-[#FC8936]", "bg-secondary"],
  ["hover:bg-[#E67A2F]", "hover:bg-secondary/90"],
  ["text-[#FC8936]", "text-secondary"],
  ["border-[#FC8936]", "border-secondary"],
  ["fill-[#FC8936]", "fill-secondary"],
  
  // Gray scale -> design tokens
  ["bg-gray-50", "bg-muted"],
  ["bg-gray-100", "bg-accent"],
  ["bg-gray-200", "bg-border"],
  ["border-gray-200", "border-border"],
  ["border-gray-300", "border-border"],
  ["text-gray-400", "text-muted-foreground"],
  ["text-gray-500", "text-muted-foreground"],
  ["text-gray-600", "text-muted-foreground"],
  ["text-gray-700", "text-foreground"],
  ["text-gray-800", "text-foreground"],
  ["text-gray-900", "text-foreground"],
  
  // White bg -> card
  ["bg-white", "bg-card"],
];

async function getAllFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'ui') continue;
      files.push(...await getAllFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      if (fullPath.includes('/components/ui/')) continue;
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const srcDir = '/vercel/share/v0-project/src';
  const files = await getAllFiles(srcDir);
  
  let totalReplacements = 0;
  let filesModified = 0;

  for (const filePath of files) {
    let content = await readFile(filePath, 'utf-8');
    let modified = false;
    
    for (const [search, replace] of REPLACEMENTS) {
      if (content.includes(search)) {
        const count = content.split(search).length - 1;
        content = content.replaceAll(search, replace);
        totalReplacements += count;
        modified = true;
      }
    }
    
    if (modified) {
      await writeFile(filePath, content, 'utf-8');
      filesModified++;
      console.log(`Updated: ${filePath.replace(srcDir, '')}`);
    }
  }
  
  console.log(`\nDone! Modified ${filesModified} files with ${totalReplacements} replacements.`);
}

main().catch(console.error);

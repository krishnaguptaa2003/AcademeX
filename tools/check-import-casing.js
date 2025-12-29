// tools/check-import-casing.js
// Usage: node tools/check-import-casing.js
// It finds ES import paths that reference files under pages/* and checks exact case on disk.

const fs = require('fs');
const path = require('path');

function getAllSourceFiles(dir, exts = ['.js', '.jsx', '.ts', '.tsx']) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(getAllSourceFiles(full, exts));
    } else {
      if (exts.includes(path.extname(entry.name))) out.push(full);
    }
  }
  return out;
}

function checkCaseSensitiveExists(refPath) {
  // refPath is repo-relative like src/pages/faculty/Department.jsx OR without extension
  const parts = refPath.split(path.sep);
  let current = process.cwd();
  for (const part of parts) {
    if (!fs.existsSync(current)) return false;
    const entries = fs.readdirSync(current);
    const found = entries.find(e => e === part);
    if (!found) return false;
    current = path.join(current, found);
  }
  return true;
}

function tryExtensions(base) {
  const exts = ['.jsx', '.js', '.tsx', '.ts', '/index.jsx', '/index.js'];
  for (const e of exts) {
    if (checkCaseSensitiveExists(base + e)) return base + e;
    if (checkCaseSensitiveExists(base + e.replace(/^\//, path.sep))) return base + e;
  }
  return null;
}

function normalizeImportPath(fromFile, imported) {
  if (!imported.startsWith('.')) return null; // skip packages
  const resolved = path.normalize(path.join(path.dirname(fromFile), imported));
  // strip any query or hash
  return resolved.split(/[?#]/)[0];
}

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, 'src');

const files = getAllSourceFiles(srcRoot);
const problems = [];

const importRegex = /import\s+(?:[\s\S]+?)\s+from\s+['"]([^'"]+)['"]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1];
    if (imp.includes('/pages/') || imp.startsWith('./pages') || imp.includes('/pages')) {
      const norm = normalizeImportPath(file, imp);
      if (!norm) continue;
      // Try direct file
      const relativeToRepo = path.relative(repoRoot, norm);
      // If there is an extension in import, check exact
      if (path.extname(relativeToRepo)) {
        if (!checkCaseSensitiveExists(relativeToRepo)) {
          problems.push({ file, importPath: imp, resolved: relativeToRepo });
        }
      } else {
        const found = tryExtensions(relativeToRepo);
        if (!found) {
          problems.push({ file, importPath: imp, resolved: relativeToRepo });
        }
      }
    }
  }
}

if (problems.length === 0) {
  console.log('No case-sensitive import mismatches found for pages/* imports.');
  process.exit(0);
}

console.log('Found possible mismatches:');
for (const p of problems) {
  console.log(`- In ${p.file} -> import '${p.importPath}' resolves to '${p.resolved}' (not found with exact case)`);
}
process.exit(1);
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUNDLE_SIZE_LIMIT_KB = 14;
const distDir = path.join(__dirname, '..', 'dist', 'assets');

function getGzippedSizeKB(filePath) {
  const content = fs.readFileSync(filePath);
  const compressed = zlib.gzipSync(content);
  return compressed.length / 1024;
}

function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / 1024;
}

function checkBundleSize() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ Build directory not found. Run npm run build first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  let totalSize = 0;
  let totalGzippedSize = 0;
  
  [...jsFiles, ...cssFiles].forEach(file => {
    const filePath = path.join(distDir, file);
    const size = getFileSizeKB(filePath);
    const gzippedSize = getGzippedSizeKB(filePath);
    totalSize += size;
    totalGzippedSize += gzippedSize;
    console.log(`  ${file}: ${size.toFixed(1)} KB (gzip: ${gzippedSize.toFixed(1)} KB)`);
  });

  console.log(`\nTotal bundle size: ${totalSize.toFixed(1)} KB (gzip: ${totalGzippedSize.toFixed(1)} KB)`);
  console.log(`Bundle size limit: ${BUNDLE_SIZE_LIMIT_KB} KB (applies to gzipped content delivered to users)`);

  if (totalGzippedSize > BUNDLE_SIZE_LIMIT_KB) {
    console.error(`❌ Gzipped bundle size exceeds limit by ${(totalGzippedSize - BUNDLE_SIZE_LIMIT_KB).toFixed(1)} KB`);
    process.exit(1);
  } else {
    console.log(`✅ Gzipped bundle size is within limit (${(BUNDLE_SIZE_LIMIT_KB - totalGzippedSize).toFixed(1)} KB remaining)`);
  }
}

checkBundleSize();
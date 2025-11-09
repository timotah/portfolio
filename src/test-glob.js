// Test file to debug import.meta.glob patterns
console.log("=== Testing import.meta.glob patterns ===");

// Test pattern 1: Absolute path from root
console.log("Pattern 1 - /pages/**/*.html?raw:");
const pattern1 = import.meta.glob('/pages/**/*.html?raw', { eager: true });
console.log("Keys:", Object.keys(pattern1));
console.log("Result:", pattern1);

// Test pattern 2: Relative path
console.log("\nPattern 2 - ./pages/**/*.html?raw:");
const pattern2 = import.meta.glob('./pages/**/*.html?raw', { eager: true });
console.log("Keys:", Object.keys(pattern2));
console.log("Result:", pattern2);

// Test without ?raw to see if that's the issue
console.log("\nPattern 3 - /pages/**/*.html (no ?raw):");
const pattern3 = import.meta.glob('/pages/**/*.html', { eager: true });
console.log("Keys:", Object.keys(pattern3));
console.log("Result:", pattern3);

// Test with CSS files
console.log("\nPattern 4 - /pages/**/*.css?raw:");
const pattern4 = import.meta.glob('/pages/**/*.css?raw', { eager: true });
console.log("Keys:", Object.keys(pattern4));
console.log("Result:", pattern4);
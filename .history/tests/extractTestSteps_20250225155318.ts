import * as fs from 'fs';
import * as path from 'path';

// Define file paths
const testFilePath = path.join(__dirname, 'authentication.spec.ts'); // Adjust if needed
const outputFilePath = path.join(__dirname, 'testSteps.txt');

// Check if the test file exists
if (!fs.existsSync(testFilePath)) {
    console.error(`❌ Error: Test file not found at ${testFilePath}`);
    process.exit(1);
}

// Read the test script
const testScript = fs.readFileSync(testFilePath, 'utf8');

// Define regex patterns for extracting test steps
const actionPatterns: Record<string, RegExp> = {
    'Go to page': /await page\.goto\(['"`](.*?)['"`]/,
    'Fill input': /await page\.locator\(['"`](.*?)['"`]\)\.fill\(['"`](.*?)['"`]\)/,
    'Click button': /await page\.locator\(['"`](.*?)['"`]\)\.click\(\)/,
    'Wait for selector': /await page\.waitForSelector\(['"`](.*?)['"`]\)/,
    'Expect URL': /await expect\(page\)\.toHaveURL\(['"`](.*?)['"`]\)/,
    'Expect text': /await expect\(page\.locator\(['"`](.*?)['"`]\)\)\.toContainText\(['"`](.*?)['"`]\)/,
};

// Extract readable test steps
let extractedSteps: string[] = [];

for (const [action, pattern] of Object.entries(actionPatterns)) {
    const matches = testScript.matchAll(pattern);
    for (const match of matches) {
        extractedSteps.push(`${action}: "${match[1]}"` + (match[2] ? ` → "${match[2]}"` : ''));
    }
}

// Debug: Log extracted steps before saving
console.log('Extracted Steps:', extractedSteps);

// Save extracted steps to a text file
try {
    fs.writeFileSync(outputFilePath, extractedSteps.join('\n'), 'utf8');
    console.log(`✅ Test steps successfully saved to: ${outputFilePath}`);
} catch (error) {
    console.error('❌ Error writing file:', error);
}

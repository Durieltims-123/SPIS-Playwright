import * as fs from 'fs';

// Read the test script
const testScript = fs.readFileSync('./authentication.spec.ts', 'utf8');

// Define regex patterns for common Playwright actions
const actionPatterns: Record<string, RegExp> = {
    'Go to page': /await page\.goto\(['"`](.*?)['"`]/,
    'Fill input': /await page\.locator\(['"`](.*?)['"`]\)\.fill\(['"`](.*?)['"`]\)/,
    'Click button': /await page\.locator\(['"`](.*?)['"`]\)\.click\(\)/,
    'Wait for selector': /await page\.waitForSelector\(['"`](.*?)['"`]\)/,
    'Expect URL': /await expect\(page\)\.toHaveURL\(['"`](.*?)['"`]\)/,
    'Expect text': /await expect\(page\.locator\(['"`](.*?)['"`]\)\)\.toContainText\(['"`](.*?)['"`]\)/
};

// Extract readable test steps
let extractedSteps: string[] = [];
for (const [action, pattern] of Object.entries(actionPatterns)) {
    const matches = testScript.matchAll(pattern);
    for (const match of matches) {
        extractedSteps.push(`${action}: "${match[1]}"` + (match[2] ? ` → "${match[2]}"` : ''));
    }
}

// Save extracted steps to a text file
const output = extractedSteps.join('\n');
fs.writeFileSync('C:/Users/datimatim/Desktop/spis-playwright/tests/testSteps.txt', output);


console.log('✅ Test steps extracted successfully! Check testSteps.txt');

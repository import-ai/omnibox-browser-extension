#!/usr/bin/env tsx

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LaunchOptions {
  headless?: boolean;
  url?: string;
  devtools?: boolean;
}

async function launchChromeWithExtension(options: LaunchOptions = {}) {
  const { headless = false, url = 'https://google.com', devtools = false } = options;

  // Path to the built extension
  const extensionPath = path.join(__dirname, '..', 'dist');

  console.log(`🚀 Launching Chrome with extension from: ${extensionPath}`);

  try {
    // Launch Chrome with the extension loaded
    const browser = await chromium.launchPersistentContext('', {
      headless,
      args: [
        `--load-extension=${extensionPath}`,
        '--disable-extensions-except=' + extensionPath,
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
      ],
      devtools,
      viewport: { width: 1280, height: 720 },
    });

    console.log('✅ Chrome launched with extension loaded');

    // Navigate to the specified URL
    const page = browser.pages()[0] || (await browser.newPage());
    await page.goto(url);

    console.log(`🌐 Navigated to: ${url}`);
    console.log('📝 Extension should be loaded and ready for testing');
    console.log('Press Ctrl+C to close the browser');

    // Keep the script running until manually terminated
    return new Promise<void>(resolve => {
      process.on('SIGINT', async () => {
        console.log('\n🔥 Closing browser...');
        await browser.close();
        console.log('✅ Browser closed');
        resolve();
      });
    });
  } catch (error) {
    console.error('❌ Failed to launch Chrome with extension:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: LaunchOptions = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--headless') {
    options.headless = true;
  } else if (arg === '--no-devtools') {
    options.devtools = false;
  } else if (arg === '--url' && args[i + 1]) {
    options.url = args[i + 1];
    i++; // Skip the next argument as it's the URL value
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
🎭 Chrome Extension Testing Helper

Usage: pnpm test:browser [options]

Options:
  --headless      Launch browser in headless mode (default: false)
  --no-devtools   Disable devtools (default: enabled)
  --url <url>     Navigate to specific URL (default: https://google.com)
  --help, -h      Show this help message

Examples:
  pnpm test:browser
  pnpm test:browser --url https://example.com
  pnpm test:browser --headless --no-devtools
`);
    process.exit(0);
  }
}

// Run the script
void launchChromeWithExtension(options);

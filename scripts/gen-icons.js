const { execSync } = require('child_process');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

fs.mkdirSync('public/icons', { recursive: true });

for (const size of sizes) {
  const out = `public/icons/icon-${size}x${size}.png`;
  try {
    execSync(
      `npx sharp-cli --input public/icons/icon.svg --output ${out} resize ${size} ${size}`,
      { stdio: 'pipe' }
    );
    console.log(`✓ ${out}`);
  } catch (e) {
    console.warn(`  Failed ${size}px:`, e.stderr?.toString() ?? e.message);
  }
}

// Create placeholder screenshots (simple PNG placeholders)
// Screenshot files can be replaced with real screenshots later
const screenshotSizes = [
  { name: 'desktop', w: 1280, h: 720 },
  { name: 'mobile', w: 390, h: 844 },
];

for (const s of screenshotSizes) {
  const out = `public/screenshots/${s.name}.png`;
  try {
    execSync(
      `npx sharp-cli --input public/icons/icon.svg --output ${out} resize ${s.w} ${s.h} --withoutEnlargement`,
      { stdio: 'pipe' }
    );
    console.log(`✓ ${out}`);
  } catch (e) {
    console.warn(`  Failed ${s.name}:`, e.message);
  }
}

console.log('\nIcon generation complete!');

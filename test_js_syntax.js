
const fs = require('fs');

try {
  const jsCode = fs.readFileSync('dist/public/assets/index-CVYJ0YvX.js', 'utf8');
  console.log('JS Code length:', jsCode.length);
  // Syntax check
  new Function(jsCode);
  console.log('Syntax check passed cleanly!');
} catch (e) {
  console.error('SYNTAX/PARSE ERROR:', e);
}

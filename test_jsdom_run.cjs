
const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = `<!DOCTYPE html>
<html>
<head>
  <script>${fs.readFileSync('dist/public/assets/index-CVYJ0YvX.js', 'utf8')}</script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

console.log('Running JSDOM execution...');

try {
  const dom = new JSDOM(html, {
    url: 'http://totag.network/',
    runScripts: 'dangerously',
    virtualConsole: (new (require('jsdom').VirtualConsole)()).sendTo(console)
  });
  console.log('JSDOM execution finished without crash.');
} catch (e) {
  console.error('CATCH RUNTIME EXCEPTION:', e.stack || e);
}

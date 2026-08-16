import subprocess
import os

res = subprocess.run(
    ["node", "-e", """
const fs = require('fs');
const js = fs.readFileSync('dist/public/assets/index-Bjm5qS89-1786917028806.js', 'utf8');
console.log('JS file read successfully, length:', js.length);
"""],
    capture_output=True,
    text=True,
    cwd=r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP"
)
print("NODE RUN TEST STDOUT:", res.stdout)
print("NODE RUN TEST STDERR:", res.stderr)

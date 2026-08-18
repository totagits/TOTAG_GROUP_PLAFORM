import os

catering_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering.tsx"

with open(catering_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix closing tags around line 1276
old_end = '''          </motion.div>
        </TabsContent>
      </main>'''

new_end = '''          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  </main>
  <Footer />'''

content = content.replace(old_end, new_end)

# Remove extra Footer if added at bottom
if content.count('<Footer />') > 1:
    # replace second Footer with nothing
    parts = content.split('<Footer />')
    content = parts[0] + '<Footer />' + parts[1].replace('<Footer />', '') + ''.join(parts[2:])

with open(catering_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed JSX tags in catering.tsx!")

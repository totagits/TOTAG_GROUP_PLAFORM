import os
import glob
import re

client_src = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src"

unsplash_pattern = re.compile(r'https://images\.unsplash\.com/[^\s"\'\>]+')

replaced_count = 0

for root, dirs, files in os.walk(client_src):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fpath = os.path.join(root, f)
            with open(fpath, 'r', encoding='utf-8') as file:
                content = file.read()
            if 'images.unsplash.com' in content:
                matches = unsplash_pattern.findall(content)
                print(f"File {f}: found {len(matches)} unsplash URLs")
                
                # Context-aware replacement
                if 'farm' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/farm-rice-harvest.jpg', content)
                elif 'cargo' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/solar-rooftop-team.jpg', content)
                elif 'catering' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/farm-cocoa-harvest.jpg', content)
                elif 'construction' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/solar-rooftop-team.jpg', content)
                elif 'merchandise' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/farm-rice-harvest.jpg', content)
                elif 'it' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/farm-surveyor-field.jpg', content)
                elif 'petroleum' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/pylontech-us5000-battery.png', content)
                elif 'stationery' in f.lower():
                    new_content = unsplash_pattern.sub('/images/hero/farm-surveyor-field.jpg', content)
                else:
                    new_content = unsplash_pattern.sub('/images/hero/solar-rooftop-team.jpg', content)

                with open(fpath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                replaced_count += len(matches)

print(f"Purged {replaced_count} unsplash URLs cleanly!")

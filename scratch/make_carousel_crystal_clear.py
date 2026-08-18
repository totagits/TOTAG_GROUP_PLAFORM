import os

carousel_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\components\subsidiary-hero-carousel.tsx"

with open(carousel_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace heavy 95% dark blur overlay with crystal clear gradient overlay
old_overlay = '<div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60 backdrop-blur-[2px]" />'
new_overlay = '<div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />'

content = content.replace(old_overlay, new_overlay)

with open(carousel_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated subsidiary-hero-carousel.tsx overlay to crystal clear!")

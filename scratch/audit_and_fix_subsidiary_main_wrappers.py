import os

base_dir = r'c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages'
subs = ['solar.tsx', 'farm/home.tsx', 'cargo.tsx', 'petroleum.tsx', 'construction.tsx', 'general-merchandise.tsx', 'it-services.tsx', 'catering.tsx', 'stationery.tsx']

for s in subs:
    path = os.path.join(base_dir, s)
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # If <main className="pt-28 pb-20"> or <main className="pt-24 pb-20"> exists, change it to <main className="pb-20"> because SubsidiaryHeroCarousel already has pt-24 sm:pt-28
    new_code = code.replace('<main className="pt-28 pb-20">', '<main className="pb-20">')
    new_code = new_code.replace('<main className="pt-24 pb-20">', '<main className="pb-20">')
    
    # Check farm/home.tsx header
    if s == 'farm/home.tsx':
        if 'Header' not in new_code:
            new_code = 'import Header from "@/components/header";\n' + new_code
        new_code = new_code.replace('<FarmNavbar />', '<Header />')
    
    if new_code != code:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_code)
        print(f"Updated {s} successfully!")
    else:
        print(f"{s} already clean.")

import os

stationery_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\stationery.tsx"

with open(stationery_path, "r", encoding="utf-8") as f:
    content = f.read()

old_items = '''const STATIONERY_ITEMS = [
  { id: "ST-01", name: "Premium A4 Copy Paper (Box of 5 Reams)", category: "Paper", price: 28, unit: "Box" },
  { id: "ST-02", name: "Heavy Duty Lever Arch Binders (Box of 10)", category: "Filing", price: 35, unit: "Box" },
  { id: "ST-03", name: "Custom Corporate Letterheads (1,000 Sheets)", category: "Printing", price: 45, unit: "Pack" },
  { id: "ST-04", name: "Executive Ballpoint Pens (Box of 50)", category: "Writing", price: 18, unit: "Box" },
  { id: "ST-05", name: "HP Heavy Duty Toner Cartridge 85A", category: "Printer Supplies", price: 65, unit: "Unit" },
  { id: "ST-06", name: "Institutional Student Exercise Books (Pack of 100)", category: "School Supplies", price: 40, unit: "Pack" }
];'''

new_items = '''const STATIONERY_ITEMS = [
  { id: "ST-01", name: "Premium A4 Copy Paper (Box of 5 Reams)", category: "Paper", price: 28, unit: "Box", image: "/images/stationery/stationery_double_a_box.png" },
  { id: "ST-02", name: "Heavy Duty Lever Arch Binders (Box of 10)", category: "Filing", price: 35, unit: "Box", image: "/images/stationery/stationery_lever_arch_binders.png" },
  { id: "ST-03", name: "Custom Corporate Letterheads (1,000 Sheets)", category: "Printing", price: 45, unit: "Pack", image: "/images/stationery/stationery_office_supplies_set.png" },
  { id: "ST-04", name: "Executive Ballpoint Pens (Box of 50)", category: "Writing", price: 18, unit: "Box", image: "/images/stationery/stationery_desktop_organizer.png" },
  { id: "ST-05", name: "HP Heavy Duty Toner Cartridge 85A", category: "Printer Supplies", price: 65, unit: "Unit", image: "/images/stationery/stationery_paper_cartons.png" },
  { id: "ST-06", name: "Institutional Student Exercise Books (Pack of 100)", category: "School Supplies", price: 40, unit: "Pack", image: "/images/stationery/stationery_office_supplies_set.png" }
];'''

old_card_jsx = '''                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{item.name}</h4>
                          <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400 block mt-1">
                            ${item.price} <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                          </span>
                        </div>'''

new_card_jsx = '''                        <div className="flex items-start space-x-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0 bg-slate-950/20 shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 inline-block">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-snug line-clamp-2">{item.name}</h4>
                            <span className="text-base font-extrabold text-sky-600 dark:text-sky-400 block mt-1">
                              ${item.price} <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                            </span>
                          </div>
                        </div>'''

if old_items in content and old_card_jsx in content:
    content = content.replace(old_items, new_items)
    content = content.replace(old_card_jsx, new_card_jsx)
    with open(stationery_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated stationery items with thumbnail images successfully!")
else:
    print("Warning: patterns not found in stationery.tsx!")

/** TOTAG Kitchen single source of truth for public prices (USD cents). */
export type KitchenProduct = {
  id: string;
  name: string;
  category: "meal" | "tray" | "juice";
  description: string;
  variants: { id: string; label: string; priceCents: number | null }[];
  emoji: string;
  sidesEligible?: boolean;
};
export const KITCHEN_CATALOG: KitchenProduct[] = [
  { id: "snail", name: "Snail", category: "meal", description: "TOTAG-style seasoned snail", emoji: "🐚", sidesEligible: true, variants: [{ id:"regular",label:"Regular",priceCents:1500 }] },
  { id: "spare-ribs", name: "Spare Ribs", category: "meal", description: "Slow-cooked, richly glazed ribs", emoji: "🍖", sidesEligible: true, variants: [{id:"regular",label:"Regular",priceCents:1000}] },
  { id: "grill-chicken", name: "Grill Chicken", category: "meal", description: "Flame-grilled chicken", emoji: "🍗", sidesEligible: true, variants: [{id:"regular",label:"Regular",priceCents:1000}] },
  { id: "grill-fish", name: "Grill Fish", category: "meal", description: "Fresh grilled fish, two sizes", emoji: "🐟", sidesEligible: true, variants: [{id:"regular",label:"Regular",priceCents:1500},{id:"large",label:"Large",priceCents:2500}] },
  { id: "gizzard", name: "Gizzard", category: "meal", description: "Savory seasoned gizzards", emoji: "🥘", sidesEligible: true, variants: [{id:"regular",label:"Regular",priceCents:500}] },
  { id: "meal-platter", name: "Any Meal Platter", category: "meal", description: "Select snail, spare ribs, grill chicken, grill fish, or gizzard at the same platter price", emoji: "🍽️", sidesEligible: true, variants: ["Snail","Spare Ribs","Grill Chicken","Grill Fish","Gizzard"].map((name)=>({id:name.toLowerCase().replace(/ /g,"-"),label:name,priceCents:2500})) },
  { id: "fried-rice-tray", name: "Fried Rice Tray", category:"tray",description:"Fried rice for gatherings",emoji:"🍚",variants:[{id:"small",label:"Small tray",priceCents:3500},{id:"large",label:"Large tray",priceCents:7000}] },
  { id: "jolly-rice-tray", name: "Jolly Rice Tray", category:"tray",description:"Flavorful party rice tray",emoji:"🍚",variants:[{id:"small",label:"Small tray",priceCents:3500},{id:"large",label:"Large tray",priceCents:7000}] },
  { id: "vegetable-rice-tray", name: "Vegetable Rice Tray",category:"tray",description:"Colorful vegetable rice",emoji:"🥦",variants:[{id:"small",label:"Small tray",priceCents:3500},{id:"large",label:"Large tray",priceCents:7000}] },
  { id: "meatball-tray",name:"Meat Ball Tray",category:"tray",description:"Seasoned meatballs for sharing",emoji:"🥘",variants:[{id:"tray",label:"Tray",priceCents:4000}] },
  { id: "fishball-tray",name:"Fish Ball Tray",category:"tray",description:"Savory fish balls for sharing",emoji:"🐟",variants:[{id:"tray",label:"Tray",priceCents:4500}] },
  { id: "smoked-chicken-ribs-tray",name:"Smoked Chicken/Ribs Tray",category:"tray",description:"20 pieces; select chicken or ribs",emoji:"🍗",variants:[{id:"chicken",label:"Smoked Chicken (20 pieces)",priceCents:3000},{id:"ribs",label:"Smoked Ribs (20 pieces)",priceCents:3000}] },
  { id: "dry-rice-fried-fish",name:"Regular Dry Rice with Fried Fish",category:"meal",description:"Liberian dry rice served with fried fish",emoji:"🍚",variants:[{id:"regular",label:"Regular",priceCents:1200}] },
  { id: "spaghetti-meatball",name:"Spaghetti with Meat Ball",category:"meal",description:"Spaghetti topped with savory meatballs",emoji:"🍝",variants:[{id:"regular",label:"Regular",priceCents:700}] },
  ...[
    ["watermelon","Watermelon","🍉"], ["pineapple","Pineapple","🍍"],["orange","Orange","🍊"],
    ["mix-any-two","Mix Any Two","🍹"],["tropical-fusion","Tropical Fusion","🥭"]
  ].map(([id,name,emoji])=>({
    id: `juice-${id}`,name: `${name} Juice`,category:"juice" as const,
    description:"Fresh natural juice — request current pricing before paying",emoji,
    variants:[{id:"500ml",label:"500ml bottle",priceCents:null},{id:"1l",label:"1 litre bottle",priceCents:null},{id:"gallon",label:"Gallon",priceCents:null}],
  }))
];
export const KITCHEN_SIDES = ["Plantain","Fries","Cuscus","Ajika","Vegetable Salad"] as const;
export const kitchenMoney = (cents:number)=>`$${(cents/100).toFixed(2)}`;

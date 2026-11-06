import { test } from "node:test";
import assert from "node:assert/strict";
import { KITCHEN_CATALOG, KITCHEN_SIDES, kitchenMoney } from "../shared/kitchenCatalog";

function variant(id: string, size: string) {
  const product = KITCHEN_CATALOG.find(p => p.id === id);
  assert.ok(product, "Missing kitchen product " + id);
  const choice = product.variants.find(v => v.id === size);
  assert.ok(choice, "Missing variant " + id + "/" + size);
  return choice.priceCents;
}

test("all advertised regular dish prices are exact USD cents", () => {
  assert.equal(variant("snail","regular"),1500);
  assert.equal(variant("spare-ribs","regular"),1000);
  assert.equal(variant("grill-chicken","regular"),1000);
  assert.equal(variant("grill-fish","regular"),1500);
  assert.equal(variant("grill-fish","large"),2500);
  assert.equal(variant("gizzard","regular"),500);
  assert.equal(variant("dry-rice-fried-fish","regular"),1200);
  assert.equal(variant("spaghetti-meatball","regular"),700);
});
test("any meal platter has the same $25 price",()=>{
  const p=KITCHEN_CATALOG.find(p=>p.id==="meal-platter");
  assert.ok(p);
  assert.equal(p.variants.length,5);
  assert.ok(p.variants.every(v=>v.priceCents===2500));
});
test("rice trays have exactly small and large published prices",()=>{
  for(const id of ["fried-rice-tray","jolly-rice-tray","vegetable-rice-tray"]){
    assert.equal(variant(id,"small"),3500);
    assert.equal(variant(id,"large"),7000);
  }
});
test("special trays follow the advertised menu",()=>{
  assert.equal(variant("meatball-tray","tray"),4000);
  assert.equal(variant("fishball-tray","tray"),4500);
  assert.equal(variant("smoked-chicken-ribs-tray","chicken"),3000);
  assert.equal(variant("smoked-chicken-ribs-tray","ribs"),3000);
});
test("all five juices use management-approved 500ml, 1 litre, and gallon prices",()=>{
  const juices=KITCHEN_CATALOG.filter(p=>p.category==="juice");
  assert.equal(juices.length,5);
  for(const juice of juices){
    assert.deepEqual(juice.variants.map(v=>v.id),["500ml","1l","gallon"]);
    assert.deepEqual(juice.variants.map(v=>v.priceCents),[500,1000,3500]);
  }
});
test("side groups and monetary formatting",()=>{
  assert.deepEqual([...KITCHEN_SIDES],["Plantain","Fries","Cuscus","Ajika","Vegetable Salad"]);
  assert.equal(kitchenMoney(3500),"$35.00");
});

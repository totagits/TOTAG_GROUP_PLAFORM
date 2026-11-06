# TOTAG Kitchen menu imagery

This development branch includes the product-card UI for a single WebP sprite.

## File to upload
`client/public/images/kitchen/totag-kitchen-menu-sprite.webp`

The companion archive `TOTAG_Kitchen_Menu_Photo_Assets.zip` contains:
- `totag-kitchen-menu-sprite.webp` (marketing imagery and labelled TOTAG juice mockups)
- `image-map.json` (5 columns × 4 rows of product-to-image positions)
- `menu-preview.jpg` (visual reference)

The image is **illustrative marketing artwork**, not a statement that the displayed photo represents a particular customer's serving. The website automatically retains the current emoji fallback until the sprite is present.

Do not change prices, checkout calculations, the CBL selling-rate feed, or payment integrations when publishing images. Do not deploy this branch to production until ordering, invoice, and payment testing has passed.

For a staging deploy: add the WebP file at the exact path above on the `feat/totag-kitchen-ordering-operations` branch, and let Coolify deploy that branch to `totag-kitchen-staging`. The photo cards will then load without further source-code changes.

# TOTAG Kitchen website photography

## Committed website asset

The optimized image file **`client/public/images/kitchen/totag-kitchen-menu-sprite.webp`**
is already committed on the TOTAG Kitchen development branch.

The site uses it through `/images/kitchen/totag-kitchen-menu-sprite.webp` in
`client/src/pages/catering/kitchen.tsx`.

The optimized 5-column × 4-row image sheet is mapped to matching food and
branded juice presentations. The customer page includes:

- A professional, responsive hero with selected menu photographs.
- A three-size Fresh Natural Juices collection: 500ml US$5, 1L US$10,
  gallon US$35.
- A menu grid using the matching sprite tiles, with a clear fallback for
  products whose accurate image has not yet been added.
- A responsive ordering checkout and quick cart shortcut.

The photography is illustrative menu/promotional imagery rather than proof
of a specific serving or batch. Product prices, order operations, and the
CBL official **selling** rate are controlled by application code; never
extract transactional prices from text within marketing images.

## Deployment verification

Deploy to an isolated staging application through Coolify using branch
`feat/totag-kitchen-ordering-operations`. Check the menu-photo asset URL
returns HTTP 200 with `image/webp`, visually inspect phone and desktop
layouts, and run the catalog, CBL, PostgreSQL and build CI checks before
any production merge.

No Hostinger DNS or production deployment is implied by this image commit.

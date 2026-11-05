# TOTAG Kitchen integration — staging, payment activation, deployment checklist

**Repository:** `totagits/TOTAG_GROUP_PLAFORM`  
**Development branch:** `feat/totag-kitchen-ordering-operations`  
**Parent business:** TOTAG Catering & Event Planning  
**Production domain:** `https://totaggroup.com`  
**Existing Coolify project:** `https://coolify.totaggroup.com/project/snzazi6rpmmtk3geaj0fqiwo`  
**Domain DNS administration:** `https://hpanel.hostinger.com/domain/totaggroup.com/dns?tab=dns_records`

## Workspaces

| Audience | Route | Description |
| --- | --- | --- |
| Customers | `/catering/kitchen` | Menu, variant selection, sides, cart, pickup/delivery requests |
| Customers | `/catering/kitchen/track` | Private order link, quotation, payment, fulfillment milestones |
| Catering staff | `/catering/ops/login` | Existing individual staff credentials |
| Staff | `/catering/kitchen/ops` | Quotes, kitchen queue, verified payments, dispatch, assignment, sales snapshot |
| Corporate site | `/catering` | New TOTAG Kitchen entry section under existing Catering & Event Planning |

All order records persist in PostgreSQL. Staff access requires a valid live catering staff account.
The repository’s previous demonstration login bypass has been removed in this branch.

## Menu and quoting

The catalog in `shared/kitchenCatalog.ts` holds the authoritative food prices (USD cents).
Juice (Watermelon, Pineapple, Orange, Mix Any Two, Tropical Fusion), available in
500ml, 1L and gallon sizes, is priced at **US$5 (500ml), US$10 (1L), and US$35 (1 gallon)** across all approved flavors.

Delivery fee is always determined by the manager before payment. Checkout does not
open until all quoted prices and delivery fees are finalized. Users can select one
side from Plantain/Fries, one from Cuscus/Ajika, and Vegetable Salad for eligible meals.
The any-meal platter is USD 25.00.

### Operational sequence

1. Customer submits an order and receives a private tracking token.
2. If a delivery fee is missing, status is `awaiting_quote`.
3. A Catering Account Manager or Operations Supervisor sets any missing delivery fee.
4. Customer reviews final amount and starts a **verified** payment.
5. Only a signed Stripe webhook or a direct confirmed MTN status inquiry marks the order `paid`.
6. Staff process `accepted → preparing → ready → dispatched → delivered` with role checks.
7. Delivery staff name/phone and milestones are visible to the customer holding the token.

**Delivery tracking is milestone-based. Live GPS map tracking is not yet implemented.**
Refunds, cancellation operations, automated notifications, delivery pricing zones,
customer account registration, and full reconciliation require additional implementation
before a fully general commercial launch.

## Hostinger/Coolify setup

Do **not** replace the existing production app while verification is incomplete.

1. Take a verified database backup and document the current application version.
2. In the existing Coolify instance, create a separate staging application from this
   development branch, with its own isolated **staging PostgreSQL database**.
3. Configure a private or access-controlled staging hostname, HTTPS and port mapping. Do not change production DNS until staging is reviewed. If DNS must be added, create only a new isolated staging A/CNAME record in Hostinger hPanel.
   The Express server listens on `PORT` (default 5000); align Coolify target port.
4. Set `NODE_ENV=production` and a strong `DATABASE_URL` in the server's environment.
   Do not commit credentials or production connection strings.
5. Set a long, random `JWT_SECRET` (at least 32 characters) on staging and production.
   Rotate the old secret before launch because demonstration authentication previously
   existed in this repository.
6. Set `ENABLE_DEMO_SEEDS=false`. Never use example staff accounts in production.
7. Build Docker image from the branch and check startup, PostgreSQL table creation,
   and the `/api/kitchen/catalog` endpoint. Note: current Dockerfile uses Node 18;
   review upgrading the platform to maintained Node LTS.
8. Verify staff login, access controls and row-level order authorization.
9. Submit test pickup and delivery orders with **non-real** customer information and
   confirm they persist after application restart.
10. Verify quote approval and item totals, ensure the customer tracking token is
    needed to view an order, and test all state transitions.
11. Confirm CBL official rates are reachable from the Hostinger VPS and `/api/kitchen/fx` returns a current dated record. Configure and test actual merchant provider sandbox accounts. Never use real customer money for prelaunch testing.
12. Only after security review, checkout verification and backup validation should
    the branch be merged and deployed to the existing production site.
13. Perform a live smoke test of the public menu, quote, checkout, dispatch and receipt,
    then monitor logs and payment reconciliation.

## Payment integration requirements

### MTN Liberia

MTN Liberia settlement uses **LRD**, while the menu is advertised in **USD**.
Production collection target environment is `mtnliberia` and currency is `LRD`.
MTN's October 2026 API upgrade also requires updated credentials, token request
headers and a new base URL.

Required **server-side** environment variables:

```text
KITCHEN_MTN_BASE_URL=https://momoapi.momo.africa
KITCHEN_MTN_ENVIRONMENT=mtnliberia
KITCHEN_MTN_CURRENCY=LRD
KITCHEN_MTN_API_USER=<new partner portal user ID>
KITCHEN_MTN_API_KEY=<new credential token>
KITCHEN_MTN_SUBSCRIPTION_KEY=<collections subscription key>
```

The application keeps all menu prices and initial order totals in USD. It fetches
the **CBL-published daily market buying and selling rates** directly from
`https://www.cbl.org.lr/research/buying-selling-rates?page=0`.
The chosen pricing basis is the **official published selling rate** (four decimals).
Customers may switch the menu display between USD and LRD. At checkout:
- Debit/credit card offers USD where an approved provider is configured.
- MTN Liberia Mobile Money offers LRD only after CBL rates are verified.
- The system displays the rate and its publication date, and records the
  frozen CBL rate/date/source and provider-request amount with the order.
- The server recomputes the LRD amount using its own fetched CBL rates
  and rejects checkout if the quote and current rate differ.
- If the official page is inaccessible, unparsable or the newest publication
  is older than four calendar days, LRD checkout is **disabled**; there is
  no hardcoded/manually-entered exchange-rate fallback.
- MTN settlement is verified against the frozen LRD amount rather than a
  later exchange rate.

**Note:** CBL reports market reference rates; the payment provider's
actual bank/merchant settlement and any charges require confirmation
with the provider. A successful software build does not constitute
live settlement verification.

Sources:
- [MTN API October 2026 upgrade](https://momodevelopercommunity.mtn.com/product-updates)
- [MTN Liberia collections](https://momoapi.mtn.com/Liberia_Collection_productDetails)

### Card checkout

The implementation uses hosted Stripe Checkout, **only if TOTAG has a legitimate
supported merchant account**. Liberia is not currently in Stripe's supported
merchant onboarding list. Do not register under an unsupported business location.

```text
KITCHEN_STRIPE_SECRET_KEY=<supported merchant's secret key>
KITCHEN_STRIPE_WEBHOOK_SECRET=<signed endpoint secret>
KITCHEN_PUBLIC_ORIGIN=https://<staging or production domain>
```

Webhook endpoint: `POST /api/kitchen/payments/stripe/webhook`

Before launch, choose and onboard a card payment provider that is **licensed,
available, and able to settle to TOTAG's Liberian business account**; replace
Stripe with the contracted provider if required. Merchant KYC, settlement account,
refund procedures and webhook signatures must be confirmed.

See [Stripe global availability](https://stripe.com/global).

### Orange Money

Not enabled. An authenticated verified Orange Liberia merchant collection
provider, settlement currency, webhook and sandbox account are required.

## Security and quality gates

- No sample/demonstration staff logins or hardcoded passwords.
- No raw card details enter the TOTAG database (hosted provider checkout).
- No successful payment state is set from a frontend callback alone.
- Do not log full API response bodies containing tracking tokens or personal data.
- Ensure TLS/HTTPS, rate limits, encrypted backups and monitoring.
- Tests: `npx tsx --test tests/kitchen-catalog.test.ts tests/kitchen-cbl.test.ts`
- PostgreSQL workflow test: `npx tsx --test tests/kitchen-orders.integration.test.ts` (disposable test DB only)
- Production build: `npm run build`
- Type checking: `npm run check`; the older repository currently has unrelated
  TypeScript failures, which must remain documented and be resolved before release.
- Do not interpret a green build as proof that payments, database migrations, or
  delivery tracking work end-to-end.

## Deployment status

This branch contains code only until independently verified and deployed.
A GitHub commit does **not** update Hostinger automatically unless the
existing Coolify application is deliberately configured to deploy that branch.
Keep production on `main` until all launch checks pass. The supplied Hostinger DNS and Coolify project links are **administrator URLs**, not API credentials or proof that ChatGPT can control those accounts. Deployment requires authenticated Coolify/Hostinger browser interaction, ideally through ChatGPT Work mode with user authorization. Do not share passwords, private API keys or PostgreSQL URLs in chat.

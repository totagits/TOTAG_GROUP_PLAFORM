# Managed school product: corporate request integration

8 November 2026 — implementation and fictional local verification; not deployed.

The IT Services and SaaS landing pages now have a separate **TOTAG for education** section and **Request a school solution** form. Existing FIMS/HRMIS pricing, modules and sign-up remain unchanged. No school subscription price, free trial, provider acceptance or instant provisioning is promised.

## Request flow

The form collects the institution's name/location, customer contact details, approximate size, required workspaces, program/TVET notes, optional primary colour and permission to contact the customer. It warns against passwords, student records and employee information. No private files are uploaded. A cryptographic request identifier is reused for retries; the form retains details on failure and shows success only with a confirmed persisted reference.

The isolated `schoolPlatformRequests` router validates the versioned contract, exact corporate Origin, rate and size. It signs a server-to-server POST to the separate TOTAG management console using HMAC SHA256 over timestamp and exact body. Redirects are rejected, with a ten-second timeout. The key never enters browser code, local storage, responses or request logs. The bridge does not use the legacy contact inquiry queue or FIMS account/authentication tables.

The separate management console stores the request, handles identical retries idempotently and returns `SCH-<year>-<reference>`. Only approved TOTAG portfolio managers can see the private intake queue. They record review notes, request more information, decline or prepare a reviewed institution configuration. The requested name/colour can prefill configuration; customer contact details do not automatically become public office details. Saving the new configuration links the request atomically. Deployment, accounts, billing, domain ownership and launch are separate approvals/operations.

The corporate server has no GET endpoint exposing customer requests. When the bridge is not configured or unavailable, online submission is unavailable and the customer sees the existing public `tis@totaggroup.com` contact option. No simulated success is used in this new flow. The separate legacy Quick Contact form still has its existing simulated submission and is not used by this integration.

## Server configuration

Set only on the corporate backend:

- `TOTAG_SCHOOL_CONSOLE_URL`: approved clean HTTPS root address of the separate console.
- `TOTAG_SCHOOL_INTAKE_SECRET`: strong generated secret of at least 43 characters, identical on the console; keep outside source and frontend environment values.

Set the same secret, separate restricted registry connection and workforce OIDC settings on the console. Its repository contains `docs/totag-management-console.md`, dedicated migrations 001–003, deployment instructions and `Dockerfile.totag-console`. No school database migration is needed for this corporate integration.

Allowed public origins are exact HTTPS totaggroup.com, www.totaggroup.com, totag.network and www.totag.network. Update that allowlist only through reviewed configuration. Current in-process throttling allows five attempts per network address per fifteen minutes. Shared durable rate limiting, verified proxy/client addressing, monitoring and contact retention policy are required before public multi-instance acceptance. No automatic request emails or notifications are implemented.

Do not run the full corporate server merely to test this bridge: its existing startup can initialize Stripe and seed accounts. The isolated test and preview do neither.

## Verification

`node --import tsx --test server/schoolPlatformRequests.test.ts` passed. It verifies exact origin denial, field rejection before forwarding, server signature, fixed destination, confirmed receipts, unconfigured bridge and failure behavior. The complete corporate frontend/backend build passed. A focused strict TypeScript check of the new bridge passed. The whole existing repository's type check has unrelated errors; see the local verification log. No new school integration file errors remained after correcting the bridge's Map iteration for this repository's TypeScript settings.

The unchanged locked dependencies reported 45 audit findings (10 low, 12 moderate, 22 high, one critical in proxy-addr) on 8 November. These are release review work, not fixed or waived by adding the school product. The existing broad CORS/auth/contact implementations were not reused for private operator access. This integration is not a complete audit of the corporate platform.

The school/console repository additionally passed signed intake, private queue access, duplicate/replay handling and atomic request/configuration rollback tests. Browser testing in Edge submitted fictional **TEST Browser Technical Academy**, received `SCH-2026-0162292846C0`, reviewed it in the local private console, prepared branding plus an Electrical Technology TVET program, saved configuration version 1 and confirmed the request reached **Configuration prepared** with its history retained. No real customer was contacted and no live school site was created.

For a repeatable fictional local preview, first start the school repository's console demo on 127.0.0.1:4105. In this corporate repository:

```powershell
$env:VITE_API_BASE_URL='http://127.0.0.1:4106'
npm run build
node --import tsx server/schoolRequestDemo.ts
```

Open `http://127.0.0.1:4106/it-services#/it-services`. This optional script binds loopback, serves built static assets, imports only the request bridge, and uses a clearly fictional local key. It never loads `.env`, mail, Stripe, account seeds or a corporate database. Stop the demos to discard their in-memory school requests. Do not use its local settings in a release build. Normal deployment builds must use the intended production API configuration.

Redeemer staging remains pinned to its school-authority review release; production remains paused. This corporate branch and the console branch are prepared separately for review.

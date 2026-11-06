# TOTAG Kitchen — Role-Based PWA Workflows

Status: staging development specification, **not production approval**.

## Common security principles
- Each Kitchen role uses an individual Catering staff account or a separate verified customer / courier identity.
- Role authorization is enforced on server APIs. Hiding navigation is not an authorization mechanism.
- Customers and riders must only see orders they are authorized to view; available delivery jobs must not reveal names, addresses or telephone numbers to unassigned riders.
- Payment is never marked successful without the merchant provider's verified confirmation.
- Sensitive customer orders, tracking links, staff records and chat messages are network-only and must not enter a public offline PWA cache.
- Changes to stock, staff roles, timecards, courier assignments and conversations require an auditable actor, timestamp and reason.

## Workspaces and responsibilities

| Workspace | Responsible roles | Main workflows |
| --- | --- | --- |
| Customer | Registered customer / token-bound guest | Menu → cart → quotation → payment → order tracking → delivery handover |
| Kitchen operations | Head chef, managers | Paid order → accepted → preparation → ready → kitchen handover |
| Kitchen inventory | Inventory manager, food-safety supervisor, chef, managers | Stock SKU → supplier receipt into quarantine → independent QA approval → FEFO issue to kitchen → waste/count → reorder alert |
| Kitchen staff | Managers, kitchen staff | Existing employee account → draft roster → publish → assigned employee clocks in/out → independent attendance approval |
| Procurement | Purchasing / designated managers (planned) | Requisition → budget check → approval → request quotation → purchase order → goods received → invoice match |
| Dispatch / rider | Dispatcher, verified rider (planned) | Approved courier profile → opt in to eligible job → assignment → ready pickup → dispatch → delivery confirmation |
| Conversation monitoring | Customer, assigned courier, authorized manager (planned) | Order-bound chat → consent + audit → report/flag → escalation and retention |
| Finance | Authorized finance / managers (planned) | Provider verification → receipts → cashbook / reconciliation → approved vendor and courier payments |

## Implemented in Kitchen staging branch
- Existing Catering staff identity and Kitchen order, payment and preparation controls.
- Inventory master records, receiving/quarantine, separate quality approval, issuance/waste deductions, low-stock dashboard, history.
- Kitchen inventory manager role and independent approval restrictions.
- Duty roster draft/publish, individual clock-in/clock-out, managerial timecard approval and duty audit.
- Dedicated inventory and staff pages, and role-directed sign-in.
- Kitchen-specific PWA manifest and service worker configuration that avoids caching private Kitchen pages.
- Security and inventory lifecycle tests. Application build and full typecheck must be reviewed in CI separately.

## Pending before a full release
1. Recipe / bill-of-material quantities by menu size, substitutions, and expected yield; automated reservation at paid order and actual issue at production.
2. Supplier directory, requisitions, approvals, purchase orders, goods-received notes, three-way invoice matching.
3. Stock count with dual approval, expiry / temperature protocols, returns, batch recall, recipe costing and food waste reporting.
4. Employee photo/addresses, employment documents, qualifications, certifications, leave, shift changes and payroll export rules.
5. Verified delivery courier onboarding, consent, approved documents, delivery assignment/acceptance, service-area controls, customer-rider chat and management moderation.
6. Independent validation of payment provider integration, customer checkout, quote approval, transaction reconciliation and exception states.
7. Kitchen PWA installation on Android/iOS, accessible notification behavior, secure private data handling and install icon dimensions.
8. Dedicated automated staff-shift workflow integration testing, operational acceptance tests and resolving release-blocking TypeScript errors.

## Acceptance gates
- Run tests using an isolated PostgreSQL staging database and designated test identities.
- Never preload production employee profiles or real customer addresses as demonstration records.
- Verify a receiver cannot authorize their own inventory batch; an unverified payment cannot reserve ingredients or release a courier.
- Verify all food safety approvals and stock deductions use append-only audit entries.
- Verify a person without the relevant role cannot view other employees' shifts, customer PII or private message threads.
- Confirm successful build, route health, payment sandbox transaction and role-permission matrix before enabling production.

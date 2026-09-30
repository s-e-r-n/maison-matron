# scaffold-nextjs-meta

A Next.js 16 scaffold with four server modules, Meta Conversions API, GoHighLevel, Nodemailer and WhatsApp Cloud API, for a conversion page. This README is the manual of the agent that builds and maintains a project from it: a consultant never sees this repository, only the agent does. One form submission leaves the server four times: hashed to Meta (Conversions API), in clear to GoHighLevel (a contact, then an opportunity), by mail (a confirmation to the lead, a copy of the whole form to the domain's inbox), and by WhatsApp (one template message per configured number, every field in its variables). One module per service, one public function each, one kill switch each. No pixel, no client code in the modules.

## 1. Start

```sh
gh repo create <name> --template s-e-r-n/scaffold-nextjs-meta --private --clone
cd <name> && npm pkg set name=<name> && npm run bootstrap
```

`bootstrap` installs the dependencies and Chromium, creates `.env` from the example when absent, then runs `verify`: types, lint, no comments, unit tests, end-to-end tests, build. Green means the tree works.

## 2. Configure

```sh
cp .env.example .env
```

`.env*` is ignored by git, production reads the host environment. Each module has a switch: `false` makes it inert, absent means on. Keep the four at `false` while you build, flip one to `true` to test against the real service. `next dev` reloads `.env` without a restart.

| Module | Switch              | Variables                                                                                                                                                         |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta   | `META_CAPI_ENABLED` | `META_CAPI_DATASET_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_GRAPH_VERSION` (`v25.0`), `META_CAPI_PHONE_COUNTRY` (optional, ISO 3166-1 alpha-2 of the site)       |
| GHL    | `GHL_ENABLED`       | `GHL_API_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID` (optional), `GHL_FREETEXT_FIELD_ID` (optional, the custom field for the free text) |
| Mail   | `MAIL_ENABLED`      | `SMTP_HOST`, `SMTP_PORT` (`465`, or `587` for STARTTLS), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `MAIL_INBOX` (the domain mailbox, receives the copy)          |
| WhatsApp | `WHATSAPP_ENABLED` | `WHATSAPP_BUSINESS_TOKEN`, `WHATSAPP_MODEL` (the template name), `WHATSAPP_DISPATCH_NUMBER_1`, `WHATSAPP_DISPATCH_NUMBER_2` (optional), each number sent as written, `41766359652` |
| Limit  | `NODE_ENV`          | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: 20 submissions per IP per 24 hours, counted in Upstash Redis in production only; `RATE_LIMIT_ALLOWED_IPS`, exact IPs never counted, comma-separated; missing or failing, the submission goes through |
| e2e    | -                   | `E2E_LEAD_EMAIL`, the address the real submission test mails                                                                                                      |

GHL and mail have no `misconfigured` code: a missing value is refused by the service and logged. Meta and WhatsApp log `misconfigured` on every submission. Configure and test a module before production.

## 3. Build the form

A field is `<Field name="…" label="…" />`. Its `name` is a key of the dictionary, the only names the modules read. The key sets the input, the keyboard and the autofill, the page sets the rest. The label stands before the control, `className` lands on the `div` around both.

| `name`           | Renders  | Meta | GHL           | Mail copy   |
| ---------------- | -------- | ---- | ------------- | ----------- |
| `given-name`     | text     | `fn` | `firstName`   | Prénom      |
| `family-name`    | text     | `ln` | `lastName`    | Nom         |
| `email`          | email    | `em` | `email`       | E-mail      |
| `tel`            | tel      | `ph` | `phone`       | Téléphone   |
| `organization`   | text     | -    | `companyName` | Entreprise  |
| `postal-code`    | text     | `zp` | `postalCode`  | Code postal |
| `address-level2` | text     | `ct` | `city`        | Localité    |
| `freetext`       | text     | -    | custom field  | Message     |

Several inputs may share `freetext`, their values arrive joined by a blank line. An input with any other `name` reaches no module but WhatsApp. A new key is one line in `src/lib/form_contract/dictionary.ts` and one row in the table of each module that wants it.

WhatsApp reads no table: every named input fills the next variable of the template, in the order of the page, and `form_id` fills the last one. The client's template is written in that order, with one variable per input plus one for the id, from 1 to 46 variables. A form and a template that disagree are refused by Meta with code `132000` and logged.

The fields go inside the page's `LeadForm`, the one client component: it calls the page's action, and renders `failure` when the submission fails. On submit it checks the lead against the page's `_lib/lead.ts`, the one Zod schema of its six fields, all required and `email` a valid email: a wrong lead never leaves, and each `Field` shows its error under its input. `form_id` is required: it names the form, lands on the `id` of the `<form>` and is bound to the page's `submit_lead` as its first argument, so the WhatsApp message says which page the lead came from, `luxe` for `/` and `refection` for `/refection`.

```tsx
import { Field } from "./_components/field";
import { LeadForm } from "./_components/lead_form";

<LeadForm
  form_id="contact"
  className="flex flex-col gap-3"
  failure={<p role="alert">L'envoi a échoué, réessayez dans un instant.</p>}
>
  <Field name="given-name" label="Prénom" className="flex flex-col gap-1" />
  <Field name="email" label="E-mail" className="flex flex-col gap-1" />
  <Field name="freetext" label="Message" className="flex flex-col gap-1" />
  <button type="submit">Envoyer</button>
</LeadForm>;
```

Each page carries its own form, `src/app/(home)/page.tsx` for `/` and `src/app/refection/page.tsx` for `/refection`, and its own confirmation page, `src/app/(home)/confirmation/page.tsx` and `src/app/refection/confirmation/page.tsx`, where a success lands. A confirmation route is named `/confirmation` under the page's own path: `/confirmation` and `/refection/confirmation`.

## 4. Plug the services

Each page's `actions.ts`, `src/app/(home)/actions.ts` for `/` and `src/app/refection/actions.ts` for `/refection`, is the only place its form meets a module: one call per service. The copy of `/refection` redirects to `/refection/confirmation`.

```ts
"use server";

import { redirect } from "next/navigation";
import { deliver_to_ghl } from "@/lib/ghl/deliver";
import { send_confirmation } from "@/lib/mail/send";
import { capture } from "@/lib/meta_capi/capture";
import { lead_submission_allowed } from "@/lib/rate_limit/submission_limit";
import { dispatch_to_whatsapp } from "@/lib/whatsapp_dispatch/dispatch";
import { valid_lead } from "./_lib/lead";

export const submit_lead = async (
  form_id: string,
  form_data: FormData,
): Promise<{ status: "failed" }> => {
  if (!valid_lead(form_data)) return { status: "failed" };
  if (!(await lead_submission_allowed())) return { status: "failed" };
  const dispatch = dispatch_to_whatsapp(form_data, form_id);
  await capture("Lead", form_data);
  deliver_to_ghl(form_data);
  const confirmation = await send_confirmation(form_data);
  await dispatch;
  if (!confirmation.ok) return { status: "failed" };
  redirect("/confirmation");
};
```

| Service  | Call                                                                    | Before the response                                                      | After the response, in `after()`                | Returns                                           |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------- |
| Limit    | `await lead_submission_allowed()` first                                 | counts the IP in Upstash, in production only                             | nothing                                         | `false` above 20 per 24 hours, the submission fails |
| WhatsApp | `dispatch_to_whatsapp(form_data, form_id)` next, `await dispatch` last  | posts one template message per number at once, awaited before both exits | nothing                                         | `{ ok: true, sends }`, one per number, never read |
| Meta     | `await capture("Lead", form_data)`                                      | writes the `meta_identity` cookie                                        | sends the event, three attempts                 | `{ ok: true }` when scheduled                     |
| GHL      | `deliver_to_ghl(form_data)`                                             | nothing                                                                  | upserts the contact, then opens the opportunity | `{ ok: true }` when scheduled                     |
| Mail     | `await send_confirmation(form_data)`                                    | sends the confirmation to the lead, waits                                | mails the whole form to `MAIL_INBOX`            | the confirmation's own result                     |

Only the confirmation mail decides the visitor's fate: sent means `/confirmation`, anything else means `{ status: "failed" }` and the form stays. WhatsApp never changes it: its sends leave right after the rate limit, run beside Meta and the mail, and are awaited so that no send depends on `after()` or on the host keeping the function alive; the visitor waits at most the 10 s timeout beyond the mail. A switched-off mail module is a failure like any other. The copy to the inbox is the safety net: what GHL missed is entered by hand from it.

Unplug a service: delete its call. Remove it: delete its call, its folder under `src/lib/`, its variables. Nothing else knows it exists. The Meta events are `Lead`, `CompleteRegistration`, `Schedule`, `PageView`, in `src/lib/meta_capi/event_dictionary.ts`; a site with a single conversion sends `Lead`. `PageView`, in `src/components/page_view.tsx`, is mounted by neither root layout today, `src/app/(home)/layout.tsx` nor `src/app/refection/layout.tsx`; mounted, it sends one per full page load.

## 5. Read a result

Every public function returns a result and never throws.

| Result                  | Meaning                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `{ ok: true, ... }`     | scheduled, or sent for the confirmation mail (`message_id`)                                    |
| `code: "refused"`       | the service said no, retrying is pointless: bad token, rejected recipient, invalid field       |
| `code: "unreachable"`   | no usable answer: timeout (10 s per GHL, SMTP or WhatsApp step, 5 s per Meta attempt), network, 5xx, 429 |
| `code: "disabled"`      | the switch is `false`                                                                          |
| `code: "misconfigured"` | Meta and WhatsApp, a variable is missing                                                       |
| `code: "blocked"`       | WhatsApp only, outside production, the guard kept the message from leaving                     |

A failure of the deferred work is logged with `console.warn`, prefixed by the module: `meta_capi:`, `ghl:`, `mail:`, `whatsapp:`. Outside production, a Meta conversion without any matching identifier beyond the IP and the user agent throws, so a broken proxy matcher or a misnamed input surfaces at once.

## 6. Test

| Command          | What it does                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `npm test`       | Vitest, `.env` loaded, one test per decision, network mocked                                   |
| `npm run e2e`    | Playwright, boots the dev server, checks the cookies, the rendered form and the failure notice |
| `npm run verify` | typecheck, lint, comments, test, e2e, build, in order                                          |

The real submission, once, with a human: `E2E_LEAD_EMAIL` and the switches at `true` in `.env`, the `freetext` custom field created in GHL, then `npm run e2e` fills every field and lands on `/confirmation`. Check the contact and the opportunity in GHL, the two mails in the inbox. With `META_CAPI_ENABLED=true`, `npm test` also posts one `PageView` to the dataset.

Outside production, the guard in `src/lib/whatsapp_dispatch/cloud_api.ts` lets a message leave only with `WHATSAPP_LIVE_TEST=1` and `41766359652` as recipient, the only number a test may ever reach: `verify`, `e2e` and `next dev` on a client's `.env` send nothing. The one live test, a paid send, runs on the command line, with `WHATSAPP_BUSINESS_TOKEN` in `.env`, and sends the template `maisonmatron` once:

```sh
WHATSAPP_LIVE_TEST=1 npx vitest run src/lib/whatsapp_dispatch/tests/cloud_api.live.test.ts
```

## 7. Where things are

```
src/lib/form_contract/   the dictionary and the loop every module reads the form with
src/lib/meta_capi/       capture.ts is the entry, user_data_keys.ts holds its table
src/lib/ghl/             deliver.ts is the entry, form_table.ts holds its table, payloads.ts the two bodies
src/lib/mail/            send.ts is the entry, form_table.ts holds its table, messages.ts the two mails
src/lib/whatsapp_dispatch/ dispatch.ts is the entry, cloud_api.ts the call, the body and the guard outside production
src/components/          logo_rows.tsx, page_view.tsx, shared by both pages with src/lib/utils.ts
src/app/global-not-found.tsx   the 404 of the site, with its own stylesheet
src/app/(home)/          the page served at /: layout.tsx, globals.css, page.tsx, actions.ts, confirmation/page.tsx, _components/ with field.tsx, lead_form.tsx and its sections
src/app/refection/       the page served at /refection: the same files, its own copies
public/home/             the visuals, the video, the brand files, the fabric logos and the textures of /
public/refection/        the same, the own copies of /refection
src/proxy.ts             mints the Meta identity cookies on every request
tests/                   Playwright
```

In each module: `kill_switch.ts` reads the switch, `config.ts` the variables, every file imports `server-only`, the tests sit in `tests/`. The mail texts live in `src/lib/mail/messages.ts`, in French, to adjust per site.

## 8. Meta in one table

Four cookies, `HttpOnly`, `SameSite=Lax`, `Path=/`, 90 days, `Secure` in production.

| Cookie          | Content                                 | Written by                                       |
| --------------- | --------------------------------------- | ------------------------------------------------ |
| `_fbp`          | `fb.1.<ms>.<random>`                    | the proxy, once, when absent                     |
| `_fbc`          | `fb.1.<ms>.<fbclid>`                    | the proxy, when the URL carries a newer `fbclid` |
| `external_id`   | a UUID, sent in clear                   | the proxy, once, when absent                     |
| `meta_identity` | every hashed `user_data` key met so far | `capture`, from a server action, when it changes |

Form values are normalised then hashed with SHA-256 (`em`, `ph`, `fn`, `ln`, `ct`, `zp`, `country`); `external_id`, IP, user agent, `fbc`, `fbp` travel in clear. The `event_id` is computed once per call and reused on every attempt, so Meta deduplicates a retry. The access token travels in the JSON body, never in the URL.

## 9. Stack

Next 16 App Router, React Compiler, Tailwind 4 with `cn()` from `@/lib/utils`, Biome with the house rules as errors, Cache Components, typed routes, Vitest, Playwright, Nodemailer 10, zod. `src/instrumentation.ts` reports every server error with its route. Framework docs of the installed version: `node_modules/next/dist/docs/`, see `AGENTS.md`.

| Command                  | What it does                                            |
| ------------------------ | ------------------------------------------------------- |
| `npm run dev`            | dev server on port 3000                                 |
| `npm run typecheck`      | `next typegen && tsc --noEmit`, the only judge of types |
| `npm run lint`           | Biome check                                             |
| `npm run format`         | Biome write: formatting, safe fixes, import sorting     |
| `npm run check:comments` | fails on any comment in `src/`                          |
| `npm run build`          | where Cache Components enforces its rules               |

## 10. Decisions and versions

`project-level-past-decisions-log.md` holds every problem that forced a decision. Read it before changing a rule of a module. `ghl_mail_design_doc.md` is the design the GHL and mail modules were built from.

A release is a tag and a GitHub release, the `template` field of `package.json` names the version a project was created from:

```sh
npm pkg set template=scaffold-nextjs-meta@1.1.0 && git commit -am "Release 1.1.0" && git tag v1.1.0 && git push --follow-tags && gh release create v1.1.0 --generate-notes
```

# scaffold-nextjs-meta

A Next.js 16 scaffold with three server modules, Meta Conversions API, GoHighLevel and Nodemailer, for a conversion page. This README is the manual of the agent that builds and maintains a project from it: a consultant never sees this repository, only the agent does. One form submission leaves the server three times: hashed to Meta (Conversions API), in clear to GoHighLevel (a contact, then an opportunity), and by mail (a confirmation to the lead, a copy of the whole form to the domain's inbox). One module per service, one public function each, one kill switch each. No pixel, no client code in the modules.

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

`.env*` is ignored by git, production reads the host environment. Each module has a switch: `false` makes it inert, absent means on. Keep the three at `false` while you build, flip one to `true` to test against the real service. `next dev` reloads `.env` without a restart.

| Module | Switch              | Variables                                                                                                                                                         |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta   | `META_CAPI_ENABLED` | `META_CAPI_DATASET_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_GRAPH_VERSION` (`v25.0`), `META_CAPI_PHONE_COUNTRY` (optional, ISO 3166-1 alpha-2 of the site)       |
| GHL    | `GHL_ENABLED`       | `GHL_API_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID` (optional), `GHL_FREETEXT_FIELD_ID` (optional, the custom field for the free text) |
| Mail   | `MAIL_ENABLED`      | `SMTP_HOST`, `SMTP_PORT` (`465`, or `587` for STARTTLS), `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `MAIL_INBOX` (the domain mailbox, receives the copy)          |
| e2e    | -                   | `E2E_LEAD_EMAIL`, the address the real submission test mails                                                                                                      |

GHL and mail have no `misconfigured` code: a missing value is refused by the service and logged. Configure and test a module before production.

## 3. Build the form

A field is `<Field name="…" label="…" />`. Its `name` is a key of the dictionary, the only names the modules read. The key sets the input, the keyboard and the autofill, the page sets the rest. The `label` wraps the control, `className` lands on the label.

| `name`           | Renders  | Meta | GHL           | Mail copy   |
| ---------------- | -------- | ---- | ------------- | ----------- |
| `given-name`     | text     | `fn` | `firstName`   | Prénom      |
| `family-name`    | text     | `ln` | `lastName`    | Nom         |
| `email`          | email    | `em` | `email`       | E-mail      |
| `tel`            | tel      | `ph` | `phone`       | Téléphone   |
| `organization`   | text     | -    | `companyName` | Entreprise  |
| `postal-code`    | text     | `zp` | `postalCode`  | Code postal |
| `address-level2` | text     | `ct` | `city`        | Localité    |
| `freetext`       | textarea | -    | custom field  | Message     |

Several inputs may share `freetext`, their values arrive joined by a blank line. An input with any other `name` reaches no module. A new key is one line in `src/lib/form_contract/dictionary.ts` and one row in the table of each module that wants it.

The fields go inside `LeadForm`, the one client component: it calls the action, disables the fields while it runs and shows `failure` when the confirmation mail could not leave.

```tsx
import { Field } from "@/components/field";
import { LeadForm } from "@/components/lead_form";

<LeadForm
  className="flex flex-col gap-3"
  failure={<p role="alert">L'envoi a échoué, réessayez.</p>}
>
  <Field
    name="given-name"
    label="Prénom"
    required
    className="flex flex-col gap-1"
  />
  <Field name="email" label="E-mail" required className="flex flex-col gap-1" />
  <Field name="freetext" label="Message" className="flex flex-col gap-1" />
  <button type="submit">Envoyer</button>
</LeadForm>;
```

`src/app/page.tsx` carries a form with every key, `src/app/confirmation/page.tsx` is where a success lands. A confirmation route is always named `/confirmation`.

## 4. Plug the services

`src/app/actions.ts` is the only place a form meets a module: one call per service.

```ts
"use server";

import { redirect } from "next/navigation";
import { deliver_to_ghl } from "@/lib/ghl/deliver";
import { send_confirmation } from "@/lib/mail/send";
import { capture } from "@/lib/meta_capi/capture";

export const submit_lead = async (
  form_data: FormData,
): Promise<{ status: "failed" }> => {
  await capture("Lead", form_data);
  deliver_to_ghl(form_data);
  const confirmation = await send_confirmation(form_data);
  if (!confirmation.ok) return { status: "failed" };
  redirect("/confirmation");
};
```

| Service | Call                                 | Before the response                       | After the response, in `after()`                | Returns                       |
| ------- | ------------------------------------ | ----------------------------------------- | ----------------------------------------------- | ----------------------------- |
| Meta    | `await capture("Lead", form_data)`   | writes the `meta_identity` cookie         | sends the event, three attempts                 | `{ ok: true }` when scheduled |
| GHL     | `deliver_to_ghl(form_data)`          | nothing                                   | upserts the contact, then opens the opportunity | `{ ok: true }` when scheduled |
| Mail    | `await send_confirmation(form_data)` | sends the confirmation to the lead, waits | mails the whole form to `MAIL_INBOX`            | the confirmation's own result |

Only the confirmation mail decides the visitor's fate: sent means `/confirmation`, anything else means `{ status: "failed" }` and the form stays. A switched-off mail module is a failure like any other. The copy to the inbox is the safety net: what GHL missed is entered by hand from it.

Unplug a service: delete its call. Remove it: delete its call, its folder under `src/lib/`, its variables. Nothing else knows it exists. The Meta events are `Lead`, `CompleteRegistration`, `Schedule`, `PageView`, in `src/lib/meta_capi/event_dictionary.ts`; a site with a single conversion sends `Lead`. `PageView` is already wired in `src/app/layout.tsx`, one per full page load.

## 5. Read a result

Every public function returns a result and never throws.

| Result                  | Meaning                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `{ ok: true, ... }`     | scheduled, or sent for the confirmation mail (`message_id`)                                    |
| `code: "refused"`       | the service said no, retrying is pointless: bad token, rejected recipient, invalid field       |
| `code: "unreachable"`   | no usable answer: timeout (10 s per GHL or SMTP step, 5 s per Meta attempt), network, 5xx, 429 |
| `code: "disabled"`      | the switch is `false`                                                                          |
| `code: "misconfigured"` | Meta only, a variable is missing                                                               |

A failure of the deferred work is logged with `console.warn`, prefixed by the module: `meta_capi:`, `ghl:`, `mail:`. Outside production, a Meta conversion without any matching identifier beyond the IP and the user agent throws, so a broken proxy matcher or a misnamed input surfaces at once.

## 6. Test

| Command          | What it does                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `npm test`       | Vitest, `.env` loaded, one test per decision, network mocked                                   |
| `npm run e2e`    | Playwright, boots the dev server, checks the cookies, the rendered form and the failure notice |
| `npm run verify` | typecheck, lint, comments, test, e2e, build, in order                                          |

The real submission, once, with a human: `E2E_LEAD_EMAIL` and the switches at `true` in `.env`, the `freetext` custom field created in GHL, then `npm run e2e` fills every field and lands on `/confirmation`. Check the contact and the opportunity in GHL, the two mails in the inbox. With `META_CAPI_ENABLED=true`, `npm test` also posts one `PageView` to the dataset.

## 7. Where things are

```
src/lib/form_contract/   the dictionary and the loop every module reads the form with
src/lib/meta_capi/       capture.ts is the entry, user_data_keys.ts holds its table
src/lib/ghl/             deliver.ts is the entry, form_table.ts holds its table, payloads.ts the two bodies
src/lib/mail/            send.ts is the entry, form_table.ts holds its table, messages.ts the two mails
src/components/          field.tsx, lead_form.tsx, page_view.tsx
src/app/                 page.tsx, actions.ts, confirmation/page.tsx, layout.tsx
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

# SSOP ghl-mail

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| form submission | `FormData` posted by the browser, one entry per input, the input `name` is a dictionary key | each module, through its own table | `form_fields_of(form_data, table)` in `src/lib/form_contract/form_fields.ts` | `Partial<Record<K, string>>`, one entry per table key whose input carries at least one non-blank string, several values of one key joined with a blank line | a `File`, a blank value or an input outside the dictionary reaching a module |
| dictionary key | the `name` of a `Field`, a literal in the page | `Field`, every table | type checker, `dictionary_key_schema.options` | union of the eight dictionary keys | a `Field` whose `name` no table can read |
| `META_CAPI_*` | `process.env` | `send_event`, `build_user_data` | `parse_config` in `src/lib/meta_capi/config.ts`, unchanged | unchanged | unchanged |
| `GHL_ENABLED`, `MAIL_ENABLED` | `process.env` | `parse_config` of the module | `module_enabled(env)` in `src/lib/ghl/kill_switch.ts` and `src/lib/mail/kill_switch.ts`, `z.enum(["true", "false"])`, absent or blank is `true` | `boolean` | `"yes"` switching a module on, it stays off with a warn |
| `GHL_*` | `process.env` | `upsert_contact`, `create_opportunity`, `contact_payload`, `opportunity_payload` | `parse_config` in `src/lib/ghl/config.ts`, blank optional is absent | `{ api_token: string, location_id: string, pipeline_id: string, pipeline_stage_id?: string, freetext_field_id?: string }` | a blank `pipelineStageId` or a custom field without id sent to GHL |
| `SMTP_*`, `MAIL_INBOX` | `process.env` | `send_message`, `confirmation_message`, `copy_message` | `parse_config` in `src/lib/mail/config.ts`, `z.coerce.number().int().positive()` on the port, 465 when it fails | `{ host: string, port: number, secure: boolean, user: string, password: string, from: string, inbox: string }` | a non-numeric port handed to the socket, a port 465 without implicit TLS |
| GHL contact fields | `form_fields_of(form_data, contact_table)` | `contact_payload` | by construction | `Partial<Record<"firstName" \| "lastName" \| "email" \| "phone" \| "companyName" \| "postalCode" \| "city" \| "freetext", string>>` | a blank string sent as a contact field |
| GHL upsert body | `contact_payload(fields, config)` | `POST /contacts/upsert` | by construction | `{ locationId, firstName?, lastName?, email?, phone?, companyName?, postalCode?, city?, customFields?: [{ id, fieldValue }] }` | `customFields` without a field id, a key GHL does not know |
| GHL opportunity body | `opportunity_payload(fields, config, contact_id)` | `POST /opportunities/` | by construction | `{ pipelineId, locationId, name, status: "open", contactId, pipelineStageId? }` | an opportunity without contact, a blank name |
| GHL 200 upsert body | `fetch` response | `create_opportunity` | `upsert_response_schema` in `src/lib/ghl/ghl_api.ts`, `z.object({ contact: z.object({ id: z.string().min(1) }) })` | `string`, the contact id | an opportunity created with an undefined `contactId` |
| GHL 201 opportunity body | `fetch` response | `delivery_outcome` | `opportunity_response_schema` in `src/lib/ghl/ghl_api.ts`, `z.object({ opportunity: z.object({ id: z.string().min(1) }) })` | `string`, the opportunity id | an unknown body reported as created |
| GHL error body | `fetch` response, 4xx | the failure message | `error_schema` in `src/lib/ghl/ghl_api.ts`, `{ message: z.string() \| z.array(z.string()), statusCode?, error? }` | `string` | the token or the whole body quoted in a log line |
| GHL outcome | `upsert_contact`, `create_opportunity`, network | the log line inside `after()` | by construction | `{ ok: true, contact_id, opportunity_id } \| { ok: false, code: "refused" \| "unreachable" \| "disabled", message }` | `ok: true` without ids, `ok: false` with an id |
| GHL delivery result | `deliver_to_ghl` | the server action | by construction | `{ ok: true } \| { ok: false, code: "disabled", message }` | a `refused` before any request left |
| mail fields | `form_fields_of(form_data, mail_table)` | `confirmation_message`, `copy_message` | by construction | `Partial<Record<"given_name" \| "family_name" \| "email" \| "tel" \| "organization" \| "postal_code" \| "locality" \| "message", string>>` | a dictionary key absent from the copy |
| mail message | `confirmation_message`, `copy_message` | `send_message` | by construction | `{ from: string, to: string, replyTo: string, subject: string, text: string }` | a message without recipient handed to SMTP |
| Nodemailer resolution | `transporter.sendMail` | `mail_result` | `sent_schema` in `src/lib/mail/smtp.ts`, `z.object({ messageId: z.string() })` | `{ ok: true, message_id }` | a resolution without message id reported as sent |
| Nodemailer rejection | `transporter.sendMail`, `unknown` | `mail_result` | `failure_of(error)` in `src/lib/mail/smtp.ts`, `z.object({ message: z.string(), code: z.string().optional(), responseCode: z.number().optional() })` | `{ ok: false, code: "refused" \| "unreachable", message }` | a non-Error rejection reported as a refusal, the password quoted |
| mail result | `send_message`, `read_config` | the server action | by construction | `{ ok: true, message_id } \| { ok: false, code: "refused" \| "unreachable" \| "disabled", message }` | `ok: true` with a code |
| Meta capture result | `capture` | the server action, `PageView` | by construction | `{ ok: true } \| { ok: false, code: "refused" \| "unreachable" \| "misconfigured" \| "disabled", message }` | `events_received` promised before the event left |
| Meta send result | `send_event` | the log line inside `after()`, the live test | `success_schema \| error_schema` in `src/lib/meta_capi/graph_api.ts`, unchanged | `{ ok: true, events_received, fbtrace_id } \| { ok: false, code, message }` | unchanged |
| submission state | `submit_lead` | `LeadForm` | by construction | `{ status: "idle" } \| { status: "failed" }` | a failure and a redirect at once |
| e2e environment | `.env`, `E2E_LEAD_EMAIL`, `MAIL_ENABLED` | `tests/lead_submission.spec.ts` | `loadEnvConfig`, `string \| undefined` | the test runs only with an address and the mail module on | a real submission from a run that configured nothing |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `dictionary_key_schema`, `dictionary_key` | - | - | `z.enum`, type | `src/lib/form_contract/dictionary.ts` |
| `form_fields`, `form_fields_of` | `dictionary_key`, `dictionary_key_schema` | `form_fields_of(form_data: FormData, table: Record<K, dictionary_key>)` | `Partial<Record<K, string>>` | `src/lib/form_contract/form_fields.ts` |
| `capture_failure`, `capture_result`, `send_result` | - | - | types | `src/lib/meta_capi/capture_result.ts` |
| `form_table` | `form_key`, `dictionary_key` | - | `Record<form_key, dictionary_key>` | `src/lib/meta_capi/user_data_keys.ts` |
| `send_event` | `server_event`, `capture_config`, `send_result` | `(event, config, overrides?)` | `Promise<send_result>` | `src/lib/meta_capi/graph_api.ts` |
| `build_user_data` | `form_fields`, `normalize_user_data_value`, `sha256_hex` | `build_user_data({ form_fields, ...request_identity, phone_country? })` | `{ user_data, identity }` | `src/lib/meta_capi/user_data.ts` |
| `capture`, `capture_in_context` | `read_config`, `read_request_context`, `form_fields_of`, `form_table`, `build_user_data`, `build_server_event`, `send_event`, `after` | `capture(event, form_data?)` | `Promise<capture_result>` | `src/lib/meta_capi/capture.ts` |
| `module_enabled` | - | `(env?)` | `boolean` | `src/lib/ghl/kill_switch.ts` |
| `delivery_failure`, `delivery_result`, `delivery_outcome` | - | - | types | `src/lib/ghl/delivery_result.ts` |
| `ghl_config`, `parse_config`, `read_config` | `module_enabled` | `parse_config(env)` | `{ ok: true, config: ghl_config } \| disabled` | `src/lib/ghl/config.ts` |
| `contact_table`, `contact_field`, `opportunity_name_of` | `dictionary_key` | `opportunity_name_of(fields)` | `Record<contact_field, dictionary_key>`, `string` | `src/lib/ghl/form_table.ts` |
| `contact_payload`, `opportunity_payload` | `contact_field`, `ghl_config`, `opportunity_name_of` | `contact_payload(fields, config)`, `opportunity_payload(fields, config, contact_id)` | the two GHL bodies | `src/lib/ghl/payloads.ts` |
| `upsert_contact`, `create_opportunity` | `ghl_config`, `delivery_failure`, the two bodies | `(payload, config, overrides?)` | `Promise<{ ok: true, contact_id } \| delivery_failure>`, `Promise<{ ok: true, opportunity_id } \| delivery_failure>` | `src/lib/ghl/ghl_api.ts` |
| `deliver_to_ghl`, `deliver_lead` | `read_config`, `form_fields_of`, `contact_table`, `contact_payload`, `opportunity_payload`, `upsert_contact`, `create_opportunity`, `after` | `deliver_to_ghl(form_data)` | `delivery_result` | `src/lib/ghl/deliver.ts` |
| `module_enabled` | - | `(env?)` | `boolean` | `src/lib/mail/kill_switch.ts` |
| `mail_failure`, `mail_result` | - | - | types | `src/lib/mail/mail_result.ts` |
| `mail_config`, `parse_config`, `read_config` | `module_enabled` | `parse_config(env)` | `{ ok: true, config: mail_config } \| disabled` | `src/lib/mail/config.ts` |
| `mail_table`, `mail_field`, `copy_labels` | `dictionary_key` | - | `Record<mail_field, dictionary_key>`, `Record<mail_field, string>` | `src/lib/mail/form_table.ts` |
| `mail_message`, `confirmation_message`, `copy_message` | `mail_field`, `copy_labels`, `mail_config` | `(fields, config)` | `mail_message` | `src/lib/mail/messages.ts` |
| `send_message` | `mail_message`, `mail_config`, `mail_result`, `nodemailer` | `(message, config, overrides?)` | `Promise<mail_result>` | `src/lib/mail/smtp.ts` |
| `send_confirmation` | `read_config`, `form_fields_of`, `mail_table`, `confirmation_message`, `copy_message`, `send_message`, `after` | `send_confirmation(form_data)` | `Promise<mail_result>` | `src/lib/mail/send.ts` |
| `Field` | `dictionary_key` | `{ name, label, placeholder?, required?, className? }` | JSX | `src/components/field.tsx` |
| `submit_lead` | `capture`, `deliver_to_ghl`, `send_confirmation`, `redirect` | `(form_data: FormData)` | `Promise<{ status: "failed" }>` or a redirect | `src/app/actions.ts` |
| `LeadForm` | `submit_lead` | `{ children, failure, className? }` | JSX | `src/components/lead_form.tsx` |
| `Home` | `LeadForm`, `Field` | `PageProps<"/">` | JSX | `src/app/page.tsx` |
| `Confirmation` | - | `PageProps<"/confirmation">` | JSX | `src/app/confirmation/page.tsx` |
| after isolation test | Next `AfterContext` | - | - | `src/lib/tests/after_isolation.test.ts` |
| lead submission e2e | dev server, `.env` | - | - | `tests/lead_submission.spec.ts` |

Edges

| Needed | Produced by |
| ------ | ----------- |
| `dictionary_key`, `dictionary_key_schema` | `form_contract/dictionary.ts` |
| `form_fields`, `form_fields_of` | `form_contract/form_fields.ts` |
| `capture_result`, `send_result` | `meta_capi/capture_result.ts` |
| `form_table`, `form_key` | `meta_capi/user_data_keys.ts` |
| `send_event` | `meta_capi/graph_api.ts` |
| `build_user_data` | `meta_capi/user_data.ts` |
| `capture` | `meta_capi/capture.ts` |
| `module_enabled` | `ghl/kill_switch.ts`, `mail/kill_switch.ts`, each for its own module |
| `delivery_failure`, `delivery_result`, `delivery_outcome` | `ghl/delivery_result.ts` |
| `ghl_config`, `read_config` | `ghl/config.ts` |
| `contact_table`, `contact_field`, `opportunity_name_of` | `ghl/form_table.ts` |
| `contact_payload`, `opportunity_payload` | `ghl/payloads.ts` |
| `upsert_contact`, `create_opportunity` | `ghl/ghl_api.ts` |
| `deliver_to_ghl` | `ghl/deliver.ts` |
| `mail_failure`, `mail_result` | `mail/mail_result.ts` |
| `mail_config`, `read_config` | `mail/config.ts` |
| `mail_table`, `mail_field`, `copy_labels` | `mail/form_table.ts` |
| `confirmation_message`, `copy_message` | `mail/messages.ts` |
| `send_message` | `mail/smtp.ts` |
| `send_confirmation` | `mail/send.ts` |
| `Field` | `components/field.tsx` |
| `submit_lead` | `app/actions.ts` |
| `LeadForm` | `components/lead_form.tsx` |
| `after`, `redirect`, `nodemailer`, `AfterContext` | outside, `next/server`, `next/navigation`, `nodemailer`, `next/dist/server/after/after-context` |

Sort

1. `form_contract/dictionary.ts`, `form_contract/form_fields.ts`, `meta_capi/capture_result.ts`, `ghl/kill_switch.ts`, `ghl/delivery_result.ts`, `mail/kill_switch.ts`, `mail/mail_result.ts`, `vitest.config.mts` alias of `server-only`, `src/lib/tests/after_isolation.test.ts`
2. `meta_capi/user_data_keys.ts`, `meta_capi/graph_api.ts`, `ghl/config.ts`, `ghl/form_table.ts`, `mail/config.ts`, `mail/form_table.ts`
3. `meta_capi/user_data.ts`, `ghl/payloads.ts`, `ghl/ghl_api.ts`, `mail/messages.ts`, `mail/smtp.ts`
4. `meta_capi/capture.ts`, `ghl/deliver.ts`, `mail/send.ts`, `components/field.tsx`
5. `app/actions.ts`, `components/lead_form.tsx`
6. `app/page.tsx`, `app/confirmation/page.tsx`, `tests/lead_submission.spec.ts`, `.env.example`, `.env`

Red first, seen failing before the module exists : `src/lib/mail/tests/form_table.test.ts` before `mail/form_table.ts`, `src/lib/form_contract/tests/form_fields.test.ts` before `form_contract/form_fields.ts`, `src/lib/ghl/tests/deliver.test.ts` before `ghl/deliver.ts`, `src/lib/mail/tests/send.test.ts` before `mail/send.ts`.

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `form_contract` | what a form input is called and how a module reads it | the eight keys, `form_fields_of(form_data, table)` gives one trimmed string per table key that carries one, nothing else |
| `meta_capi` | what Meta expects, unchanged, plus which dictionary key feeds each Meta key | `capture(event, form_data?)` from the server, writes `meta_identity` before returning, the send leaves after the response, the result says only whether it was scheduled |
| `ghl` | what GHL expects, contact then opportunity, and which dictionary key feeds each GHL field | `deliver_to_ghl(form_data)` from a server action, synchronous, everything leaves after the response, `disabled` is the only failure it can report itself |
| `mail` | how a mail leaves and what the two mails say | `await send_confirmation(form_data)` from a server action, the result is the transactional mail's, the copy leaves after the response, a submission without email is refused |
| `ghl/kill_switch`, `mail/kill_switch` | the name and the reading of one flag | nothing, read by the module's `parse_config` only |
| `ghl/ghl_api` | headers, base URL, timeout and failure classification of a GHL call | two calls, each takes a body and the config and answers a typed result, never throws |
| `mail/smtp` | Nodemailer, the SMTP settings, the timeouts and the failure classification | `send_message(message, config)` answers a typed result, never throws |
| `LeadForm` | how the page learns that the mail failed | wrap the fields, pass the failure node, the submit button is a child |
| `Field` | which input the browser renders for a dictionary key | `name` is a dictionary key, `label` is required |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| configuration of each module | host environment, `.env` locally | `read_config` of that module, on every call | the host, never the code |
| the submission | the request, as `FormData` | each module through its table, once, into its own fields | the browser |
| `meta_identity` | browser cookie jar | `request_context_from` | `capture`, before returning, unchanged |
| the work deferred past the response | Next, the `after()` context of the request | Next, when the response closes | each module, once per call |
| the contact id | one `deliver_lead` call | `opportunity_payload` | `upsert_contact`, once |
| the result of the transactional mail | one `send_confirmation` call | `submit_lead` | `send_message`, once |
| submission status shown to the visitor | `LeadForm`, through `useActionState` | `LeadForm` | `submit_lead`, through its return value |
| the pending submit | `LeadForm`, through `useActionState` | the `fieldset` around the children | React, while the action runs |

## Amendments

- `capture_result_schema` replaced by the plain types `capture_failure`, `capture_result`, `send_result`, nothing parsed a result from JSON any more
- `form_fields_of` left `meta_capi/user_data.ts` for the contract, the Meta module keeps its `form_fields` type and `form_key_schema` for the type only
- payload builders are `contact_payload_of` and `opportunity_payload_of`, the types keep `contact_payload` and `opportunity_payload`; `ghl_api.ts` exports `contact_result` and `opportunity_result`
- `deliver_to_ghl` is synchronous, nothing before `after()` awaits, so the server action calls it without a floating promise
- `mail_field` comes from `mail_field_schema`, a `z.enum`, so the copy iterates `options` in table order; `sender_name_of` added next to the table for the copy subject; `confirmation_message` takes `lead_fields`, `mail_fields` with a required `email`
- `send_confirmation` schedules the copy before anything else, then refuses a submission without email before any SMTP call
- `send_message` takes `overrides: Partial<{ mailer_of }>`, the default builds one Nodemailer transport per send with the four 10 s timeouts, `nodemailer` 10 ships its types so `@types/nodemailer` is absent
- `Field` links label and control with `useId` and `htmlFor`, Biome's `noLabelWithoutControl` cannot see a control behind a conditional
- `LeadForm` wraps `submit_lead(form_data)` in a `submit(state, form_data)` closure for `useActionState`, the design doc signature holds; a `fieldset` disables the children while pending
- `src/lib/tests/after_isolation.test.ts` drives the public `after` of `next/server` inside `workAsyncStorage` and `workUnitAsyncStorage` with stores built by `createWorkStore` and `createRequestStore`, closed through `AfterRunner`; it was green on its first run, Next already isolates the tasks, nothing of ours could make it red
- `tests/lead_submission.spec.ts` carries two always-on tests, the render of every field and the failure notice with the mail module off, beside the HITL submission gated on `MAIL_ENABLED` and `E2E_LEAD_EMAIL`
- `opportunity_name_of` falls back to the email, the phone, then `Lead`; `sender_name_of` to the email, then `un visiteur`
- variable names decided: `MAIL_INBOX`, `GHL_FREETEXT_FIELD_ID`, `E2E_LEAD_EMAIL`

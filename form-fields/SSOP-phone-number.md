# SSOP - phone number

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Phone number typed in the form | The accept and reject lists of `dry-run.mjs`, later the `tel` field of the lead form | `phone_number.safeParse` | `phone_number` in `form-fields/phone-number.mjs` | Trimmed non-empty string whose dialable form, separators `\s . - / ( )` removed and a leading `00` read as `+`, is `0[1-9]` then 8 digits, or `+[1-9]` then 6 to 14 digits | A phone number holding a letter, a `+` past the first character, fewer than 7 or more than 15 digits after `+`, a country code starting with 0, a national number other than ten digits |
| Verdict | `phone_number.safeParse` | Standard output | `dry-run.mjs` | One line per input: `<input> \| accepted` or `<input> \| rejected \| <first issue message>` | A rejection printed without its French message |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `phone_number` | `zod` | None, it is a schema | A zod schema: a string in, the trimmed string out, one French message per failure | `form-fields/phone-number.mjs` |
| Dry run output | `phone_number`, accept list, reject list | None, no argument on the command line | One line per input on standard output | `form-fields/dry-run.mjs` |

Edges: `dry-run.mjs` needs `phone_number`, produced by `phone-number.mjs`. `zod` and the two lists are boundary data.

Sort:

1. `form-fields/phone-number.mjs`
2. `form-fields/dry-run.mjs`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `phone-number.mjs` | What counts as a phone number for a Maison Matron lead: the characters allowed, the Swiss national shape, the international bounds, the two French messages | `phone_number` is a zod schema of the same shape as `filled`: parse a string, read the first issue message on failure, the output is the trimmed input unchanged |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| None, every verdict is computed from its input | - | - | - |

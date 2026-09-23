# SSOP - conversion page, front end only

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| A form submission | The visitor's inputs, sheet form and subscription form | Nowhere, phase one | `hold_submission` in `src/lib/submission.ts`, where the submit event is stopped | `FormEvent<HTMLFormElement>`, read for nothing but `preventDefault` | A submission leaving the browser for GHL, Meta CAPI, the mail or the page's own URL |
| A field name | The page, at each `Field` | The input's `name` and its autofill attributes | The type checker, at the `Field` call | `dictionary_key` of `src/lib/form_contract/dictionary.ts` | A field the phase-two modules could never read |
| A call to action target | The page, at each `CallToAction` | The anchor's `href` | The type checker, at the `CallToAction` call | `` `#${string}` `` | A call to action that navigates away from the one page |
| A brand SVG | `public/brand/*.svg`, static import | `next/image` `src` | The bundler, at the import | The static image object Next.js builds | An SVG rewritten into the markup |
| The paper texture | `public/textures/paper-faint-fibre.jpg` | The sheet background | The bundler, at the `url()` of the CSS module | A hashed asset URL | A texture path that breaks silently |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| theme tokens | - | - | colours, fonts | `src/app/globals.css` |
| shell | theme tokens | `children` | `html`, `body`, EB Garamond normal and italic | `src/app/layout.tsx` |
| hold_submission | - | `event` | nothing | `src/lib/submission.ts` |
| SectionTitle, SectionSubtitle | theme tokens | `children` | `h2`, `p` at their type level | `src/components/typography.tsx` |
| CallToAction | theme tokens | `children`, `href?` | an in-page anchor, or a submit button without `href` | `src/components/call_to_action.tsx` |
| Field | theme tokens, dictionary_key | `name`, `label`, `className?` | a labelled input | `src/components/field.tsx` |
| LeadForm | hold_submission | `children`, `className?` | a form whose submission is held | `src/components/lead_form.tsx` |
| Hero | CallToAction as `children`, theme tokens | `lead`, `title`, `quote`, `signature`, `children` | the hero section | `src/components/hero.tsx` |
| CenteredSection | theme tokens | `children`, `action?` | a centred text section, no visual | `src/components/centered_section.tsx` |
| WideVisualSection | theme tokens | `children`, `action?` | a centred text section above a 3:2 placeholder | `src/components/wide_visual_section.tsx` |
| SideVisualSection | theme tokens | `children`, `action?` | a 4:5 placeholder left, text right from `lg` | `src/components/side_visual_section.tsx` |
| LeadSheet | LeadForm | `id`, `title`, `send`, `children` | the paper sheet form | `src/components/lead_sheet.tsx`, `lead_sheet.module.css` |
| Watermarked | theme tokens | `children` | the content beside the watermark gutter from `lg` | `src/components/watermarked.tsx` |
| page | every component above | - | sections 1 to 9 in redaction order | `src/app/page.tsx` |
| conversion page e2e | page | - | order of the sections, no request on submit | `tests/conversion_page.spec.ts` |

Edges: theme tokens -> shell, typography, CallToAction, Field, sections, Watermarked. hold_submission -> LeadForm. LeadForm -> LeadSheet. Every component -> page. page -> e2e.

Sort:

1. theme tokens, hold_submission
2. shell, SectionTitle and SectionSubtitle, CallToAction, Field, LeadForm
3. Hero, CenteredSection, WideVisualSection, SideVisualSection, LeadSheet, Watermarked
4. page
5. conversion page e2e

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `submission.ts` | What sending a form does in phase one, replaced by the server action in phase two | Pass it as the form's `onSubmit` |
| `typography.tsx` | The size, face and leading of a section title and of the subtitle level | Which of the two levels the text is |
| `call_to_action.tsx` | The face of the principal button | Its label, and `href` for a link, none for a submit |
| `field.tsx` | How a field looks and which input, keyboard and autofill a dictionary key gets | The dictionary key and the label |
| `lead_form.tsx` | Where a submission goes | It holds every submission, fields go in `children` |
| `hero.tsx` | The hero layout, frame, logotype, text over the frame from `lg` | The title in two parts, the quote, the signature, the action |
| `centered_section.tsx` | The centred model without visual | Text in `children`, the action apart |
| `wide_visual_section.tsx` | The 3:2 model, content above | Text in `children`, the action apart |
| `side_visual_section.tsx` | The 4:5 model, visual left, content right | Text in `children`, the action apart |
| `lead_sheet.tsx` | The paper sheet, its panel, its grid and its send button | Its anchor id, its hidden title, the send label, the fields; a field spanning both columns carries `md:col-span-2` |
| `watermarked.tsx` | The gutter reserved for the watermark and its sticky column | It wraps everything after the hero |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| The values typed in a form | Each uncontrolled input, in the DOM | Nobody, phase one | The visitor |

## Amendments
- `CenteredSection` takes no `action`: sections 2 and 8, its only callers, have none.
- The inset of a text block and the width of a page are two Tailwind utilities, `copy-inset` and `page-width`, in `src/app/globals.css`, shared by every model.
- A field spanning both columns of the sheet carries `col-span-full`, not `md:col-span-2`.
- The face of `CallToAction` wraps its label when the label cannot fit, instead of `whitespace-nowrap`.
- `tests/lead_submission.spec.ts` is removed with the scaffold form it tested; `tests/conversion_page.spec.ts` checks the order of the sections and the target of the calls to action, and no submission.
- `Hero` takes only `children`, its action: its copy moved into its own markup, and its 16:9 frame became the full frame video of `SSOP-hero-video.md`.
- `SideVisualSection` takes an optional `visual`, rendered with `object-fit: cover` in its 4:5 frame; section 3 carries the archival photo `public/visuals/archival-photo-man-leading-horse.jpg` through `next/image`, the other two keep their placeholder.
- `WideVisualSection` takes an optional `visual` too, rendered with `object-fit: cover` in its 3:2 frame; section 4 carries `chaises-pin-japonais.png`, section 5 `yellow-chair-white-bg.png`, both through `next/image`, centred.
- `LeadSheet` takes its `title` as markup, rendered visible and centred above the sheet at the section title level; section 9 reads « L'atelier vient à vous, c'est offert. » in place of the hidden « Formulaire ».
- The form section opens on the dashed rule `.couture` of `material/design.html`, an `hr` 1px high, 6px dashes every 10px in `rgb(0 0 0 / 0.5)`, in Tailwind, before its title.
- `CenteredSection` takes an optional `className`; section 8 is at least half the viewport high, its content centred in it.
- Sections 6 and 7 reuse the photos of sections 4 and 5, until their own visuals exist; no section keeps a placeholder.
- `CenteredSection` itself is at least half the viewport high, its content centred in it, for sections 2 and 8 alike; the `className` it briefly took is gone.

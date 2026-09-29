# SSOP - page text, catching up with the human's working copy

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The copy of the page | The human's directives, 005 | The JSX of `src/app/page.tsx`, inline | The type checker, at each component call | Text, `SectionTitle`, `SectionSubtitle` and `CallToAction` children | A text held in a variable or a prop, apart from where it renders |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| CenteredSection | theme tokens | `children`, `action?` | a centred text section, no visual, at least one viewport high, its action under its text | `src/components/centered_section.tsx` |
| page | CenteredSection, SectionSubtitle, CallToAction | - | the sections of the page with the copy of 005 | `src/app/page.tsx` |
| page e2e | page | - | titles in order, every call to action in its text block | `tests/conversion_page.spec.ts` |

Edges: CenteredSection -> page -> page e2e.

Sort:

1. CenteredSection
2. page
3. page e2e

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `centered_section.tsx` | The centred model without visual: its height, its centring, the place of its action | Text in `children`, the action apart |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| None | - | - | - |

## Amendments

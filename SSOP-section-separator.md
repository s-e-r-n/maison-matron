# SSOP - section separator

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The brand icons | `public/brand/secondary-icon.svg`, `terciary-icon.svg`, as delivered | `next/image` in `SectionSeparator` | The static import, typed `StaticImageData` | Two imports, the turn done in CSS | An inlined or edited SVG |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| SectionSeparator | the two brand icons | - | one centred row of five icons, 52px and 16px apart at 30% opacity, scaled together below the width of 324px they need | `src/components/section_separator.tsx` |
| page | SectionSeparator | - | a separator between every two consecutive sections, from the hero to the form, none after it | `src/app/page.tsx` |

Edges: SectionSeparator -> page.

Sort:

1. SectionSeparator
2. page

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `section_separator.tsx` | The separator's motif, sizes, spacing, opacity and how it shrinks | It stands between two sections; the page's flex gap gives it its breathing room |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| None | - | - | - |

## Amendments
- The terciary icons turned 45° reach about 10.8px beyond their 52px box, so the separator carries `py-3` and keeps at least one block gap clear of its icons above and below, the first one included under the hero.

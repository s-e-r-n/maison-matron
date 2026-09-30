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
- The form's section drops its dashed rule, the `hr` drawn with a `repeating-linear-gradient` in `lead_sheet.tsx`: the separator above it already marks the change of subject; every other element of the form stays as it is.
- The page drops its first two separators, the one under the hero and the one between « Vous cherchez la pièce à votre image, or… » and « Maison Matron, artisan depuis 4 générations »; the eight others stay as they are, from « Maison Matron, artisan depuis 4 générations » to the form.
- The space above and below a separator is halved, from 108px to 54px below `lg` and from 140px to 70px from `lg`: the separator keeps its `py-3` and takes `-my-13.5 lg:-my-17.5`, giving back half of the page's gap plus its own padding on each side; the page's gap between two sections that no separator divides, the `min-h-svh` of the sections and the icons stay as they are. The separator now counts on the page's `gap-24 lg:gap-32`.

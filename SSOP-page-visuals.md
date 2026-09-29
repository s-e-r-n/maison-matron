# SSOP - page visuals placed, atelier footer

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| A photo's native ratio | The pixel size of the file in `public/visuals/`, copied byte for byte from the primary checkout | The frame of its section, the pair, or the footer | The bundler, at the static import, which writes `width` and `height` on the `img` | The intrinsic ratio the browser reserves before the file loads | A photo cropped, letterboxed or held in a box of another ratio |
| The pair under « 4 saisons, 4 privilèges » | `chaises-pin-japonais.jpg` and `buffet.jpg`, both 3000x2000 | Two equal columns from `md`, stacked below | The static imports, whose equal ratio makes equal widths equal heights | Two images at their own 3:2 ratio | Two photos side by side at different heights |
| The atelier address | `REFERENCE-PARTENAIRE.md`, Drive folder `Tapissier-Matron-Claude` | The footer markup | Read by hand, written once in the JSX | « Route de Gilly 15, 1183 Bursins » | An address the partner reference does not state |
| The footer background | `atelier.jpg`, static import | The footer, full bleed | The bundler, at the import | The footer box is the photo's own 3:2 box, the mask and the copy lie over it | A footer cropping or stretching its background |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| visuals | - | - | the served files the page imports | `public/visuals/` |
| Footer | visuals, logotype, theme tokens | - | the atelier photo at its own ratio, a flat 50 % ink mask over it, the hero's logotype placed as on the hero, the address | `src/components/footer.tsx` |
| page | visuals, Footer | - | sections 1 to 9 with their new visuals, the pair under section 7, the footer after `main` | `src/app/page.tsx` |
| page e2e | page | - | each section shows its photo, the pair sits side by side at one height from `md` and stacks full width below | `tests/conversion_page.spec.ts` |
| responsive e2e | page | - | at nine widths every photo and the footer keep their native ratio | `tests/responsive.spec.ts` |

Edges: visuals -> Footer, page. Footer -> page. page -> page e2e, responsive e2e.

Sort:

1. visuals
2. Footer
3. page
4. page e2e, responsive e2e

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `footer.tsx` | The footer: its background photo, its mask, the logotype and the address | Nothing, it takes no props |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| The size a photo renders at | The browser, from the `img` intrinsic ratio and the width of its column | Nobody | The layout |

## Amendments
- Round 2: the footer drops `atelier.jpg` and its mask, and becomes a small footer on the page's paper holding the logotype and the address; it lives inside `Watermarked`, after the sections, so it shares their column and its centre from `md`.
- `WideVisualSection` orders text, visual, action: the visual sits close under its text, the action follows the visual; its frame is a one column grid, so it holds one image or a pair's own grid.
- « 4 saisons, 4 privilèges » and « Vous travaillez avec un décorateur d'intérieur ? » become `WideVisualSection`s whose visual is a pair; the first loses its email form and takes the booking call to action.
- A pair of different ratios stands at one height through columns proportional to each photo's width over height, `md:grid-cols-[0.8fr_0.7483fr]` for `chaise-bleue.jpg` 2400x3000 and `chaise-miel.png` 1760x2352; a pair of equal ratios uses `md:grid-cols-2`.
- The page e2e reaches the footer by the `footer` element, which is no longer the `contentinfo` landmark inside `main`.

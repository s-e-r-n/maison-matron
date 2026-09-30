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
- Round 3 reverses the order of round 2: `WideVisualSection` is back to the structure of main, its action inside the text block under the text, one gap of 48px then 64px from `lg` before the visual; only its frame changes, a one column grid, so it holds one image or a pair's own grid.
- `WideVisualSection` and `SideVisualSection` are at least one viewport high, their content centred in it as one unit: the slack goes around the text and its visual, never between them. `SideVisualSection` centres its row from `lg` through `flex-wrap` and `content-center`, its text still aligned on the top of its visual.
- `CenteredSection` keeps its half viewport, section 2 having no visual.
- « Vous travaillez avec un décorateur d'intérieur ? » becomes a `SideVisualSection` holding `chaise-bleue.jpg` alone; `chaise-miel.png` leaves the page and the repository, and the pair of different ratios with it.
- « L'atelier vient à vous, et c'est offert » holds `outil.jpg`, a 3:2 landscape visual, so it moves to `WideVisualSection`: a landscape visual takes the stacked model, a portrait one the side model.
- From `lg`, no line of `WideVisualSection`'s text block wraps (`lg:whitespace-nowrap`), since it no longer shares the width with a visual; below `lg` lines wrap as usual.
- Every call to action sits one step closer to its text block, 32px then 48px from `lg` (`mt-8 lg:mt-12`, and `mb-8 lg:mb-12` above the hero's), the human overriding rule 1 of the design directives on this gap; the gap between a text block and its visual stays 48px then 64px.
- The no-wrap rule of `WideVisualSection`'s text block moves from `lg` to `xl` (`xl:whitespace-nowrap`), since « Depuis 1908, chaque chaise est assemblée à l'ancienne… » overflowed its block between 1024 and about 1160px; below `xl` lines wrap as usual.
- Below `md` every call to action is centred horizontally in its section, the hero's included: the link of `CallToAction` turns `block`, `w-fit` and `mx-auto` below `md` only (`max-md:`), everything else staying flush left and nothing changing from `md`; the submit button keeps its place.
- « Vous travaillez avec un décorateur d'intérieur ? » leaves `SideVisualSection` and takes the model of « 4 saisons, 4 privilèges »: a `WideVisualSection` whose visual is a pair of equal ratios in `md:grid-cols-2`, `chaise-bleue.jpg` 2400x3000 then `armoire.jpg` 2160x2700, both 4:5; a pair of portrait visuals takes the stacked model like a landscape one.

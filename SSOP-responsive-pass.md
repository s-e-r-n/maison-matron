# SSOP - responsive pass, 320px to 1920px

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| A photo's native ratio | The pixel size of the file in `public/visuals/` | The frame of its section | The bundler, at the static import, which writes `width` and `height` on the `img` | The intrinsic ratio the browser reserves before the file loads | A frame of one ratio holding a photo of another, cropped or letterboxed |
| A viewport width | The device | The layout | The media queries `md` and `lg` | A width from 320px to 1920px | A width at which any box passes the right edge of the viewport |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| SideVisualSection | theme tokens | `children`, `action?`, `visual?` | text and a visual side by side from `lg`, the visual framed at its own ratio | `src/components/side_visual_section.tsx` |
| WideVisualSection | theme tokens | `children`, `action?`, `visual?` | text above a full width visual framed at its own ratio | `src/components/wide_visual_section.tsx` |
| LeadSheet | LeadForm | `id`, `title`, `send`, `children` | the paper sheet, full width below `lg` | `src/components/lead_sheet.tsx` |
| responsive e2e | page | - | at nine widths, no horizontal overflow, no box past the viewport, every photo at its native ratio with no frame around it | `tests/responsive.spec.ts` |

Edges: SideVisualSection, WideVisualSection, LeadSheet -> page. page -> responsive e2e.

Sort:

1. SideVisualSection, WideVisualSection, LeadSheet
2. responsive e2e

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `side_visual_section.tsx` | The side model: text beside the visual from `lg`, the visual at its own ratio | Text in `children`, the action apart, the visual an image carrying its own size |
| `wide_visual_section.tsx` | The wide model: text above a full width visual at its own ratio | Text in `children`, the action apart, the visual an image carrying its own size |
| `lead_sheet.tsx` | The paper sheet, its panel, its grid and its send button | Its anchor id, its title, the send label, the fields |
| `tests/responsive.spec.ts` | What responsive means for this page | The nine widths and the native ratio of each photo |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| The size a photo renders at | The browser, from the `img` intrinsic ratio and the width of its column | Nobody | The layout |

## Amendments
- The frames of `SideVisualSection` and `WideVisualSection` carry no aspect ratio and no black while they hold a visual; the 4:5 and 3:2 black placeholder survives only on an empty frame, through `empty:`.
- Below `md` every visual is full bleed, its side margin of 16px starts at `md`.
- Below `md` every text is flush left, titles included; `CenteredSection`, `WideVisualSection` and the title of `LeadSheet` centre from `md` only.
- `tests/conversion_page.spec.ts` no longer asserts `object-fit: cover` nor the 3:2 and 4:5 frames, `tests/responsive.spec.ts` owns the ratio of every photo.
- `tests/responsive.spec.ts` also runs on WebKit, as a second Playwright project, and `bootstrap` installs WebKit.

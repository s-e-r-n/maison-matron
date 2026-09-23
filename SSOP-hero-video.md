# SSOP - hero, full frame video

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The hero video | `maison-matron-hero.mp4`, copied byte for byte to `public/video/` | The `src` of the hero's `<video>` | The static serving of `public/`, checked by `tests/hero.spec.ts` requesting the `src` | The root-relative path `/video/maison-matron-hero.mp4`, H.264 1920x1080 as delivered | A hero pointing at a file `public/` does not serve, or at a rendition other than the delivered one |
| The two chair visuals | `chaises-pin-japonais.png`, `yellow-chair-white-bg.png`, copied byte for byte to `public/visuals/` | Nowhere, until Gray places them | `cmp` against the source at copy time | Two PNG files | A visual diverging from its source |
| The logotype | `public/brand/maison-matron-logo-complete.svg`, static import | `next/image` `src` | The bundler, at the import | The static image object Next.js builds | An SVG rewritten into the markup |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| hero video file | - | - | the served file | `public/video/maison-matron-hero.mp4` |
| Hero | hero video file, theme tokens, CallToAction as `children` | `children` | the full frame hero section, its copy in its own markup | `src/components/hero.tsx` |
| page | Hero | - | sections 1 to 9 in redaction order | `src/app/page.tsx` |
| hero e2e | page | - | the hero covers the viewport at 375, 768 and 1440px, the video covers the hero and plays muted, looped, inline, without controls | `tests/hero.spec.ts` |

Edges: hero video file -> Hero. Hero -> page. page -> hero e2e.

Sort:

1. hero video file
2. Hero
3. page
4. hero e2e

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `hero.tsx` | The hero: the video filling the viewport behind it, the logotype, the copy and its place over the video | Its action goes in `children` |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| Whether the video plays | The `<video>` element, in the DOM | Nobody | The browser, from the attributes `autoplay muted loop playsinline` |

## Amendments

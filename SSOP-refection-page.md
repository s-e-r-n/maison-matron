# SSOP - refection page

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The path of a request | The visitor's browser | One page file under `src/app/` | The file tree, read by the Next.js router | `(home)/page.tsx` serves `/`, `(home)/confirmation/page.tsx` serves `/confirmation`, `refection/page.tsx` serves `/refection`, `refection/confirmation/page.tsx` serves `/refection/confirmation`; two root layouts, `(home)/layout.tsx` and `refection/layout.tsx`; `global-not-found.tsx` answers every other path with 404 | One path served by two files, which the router refuses at build |
| The visitor's form entries | The sheet of one page | Held in the browser by that page's `hold_submission`, nothing plugged | `Field`'s `name`, typed `field_name`, the page's own union of keys | `FormData` keyed by the page's field names, each of them a key of the dictionary | A field named outside the page's own table |
| The photos, logos, icons, video and texture | `public/home/` for `/`, `public/refection/` for `/refection` | `next/image`, the `video` element and the CSS of that page | The static import, typed `StaticImageData`, and the video URL under the page's folder | One folder per page, its own copies | A page reaching a file of the other page's folder |
| The classes of a page's stylesheet | The files of the page's folder and `src/components/` | The page's `globals.css` | `@import "tailwindcss" source(none)` and two `@source` | One stylesheet per page, built from its own classes | A class of one page landing in the stylesheet of the other |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| logo rows | - | `children` | the placed rows of logos | `src/components/logo_rows.tsx`, common |
| page view | the Meta module | - | nothing shown, mounted by neither layout | `src/components/page_view.tsx`, common |
| cn | - | class lists | one merged class list | `src/lib/utils.ts`, common |
| global not found | - | - | the 404 of the site, `html lang="fr"`, the font, the title | `src/app/global-not-found.tsx`, `global-not-found.css`, common |
| home shell | - | `children` | the `html` and `body` of `/`, its font, its metadata, its theme, its stylesheet from its own classes | `src/app/(home)/layout.tsx`, `src/app/(home)/globals.css` |
| home submission | - | the submit event | the event held | `src/app/(home)/_lib/submission.ts` |
| home components | cn, home submission | each its own `children` and slots | the hero, footer, separator, watermark, typography, calls to action, fields, form and sheet, and the four section models of `/` | `src/app/(home)/_components/*` |
| home page | logo rows, home components | - | the page served at `/` | `src/app/(home)/page.tsx` |
| home action | the three modules | `FormData` | `/confirmation`, or `{ status: "failed" }` | `src/app/(home)/actions.ts` |
| home confirmation | - | - | the page served at `/confirmation` | `src/app/(home)/confirmation/page.tsx` |
| refection shell | - | `children` | the same, for `/refection` | `src/app/refection/layout.tsx`, `src/app/refection/globals.css` |
| refection submission | - | the submit event | the event held | `src/app/refection/_lib/submission.ts` |
| refection components | cn, refection submission | each its own `children` and slots | the same pieces, for `/refection` | `src/app/refection/_components/*` |
| refection page | logo rows, refection components | - | the page served at `/refection` | `src/app/refection/page.tsx` |
| refection action | the three modules | `FormData` | `/refection/confirmation`, or `{ status: "failed" }` | `src/app/refection/actions.ts` |
| refection confirmation | - | - | the page served at `/refection/confirmation` | `src/app/refection/confirmation/page.tsx` |

Edges: cn -> home components, home submission -> home components, home components -> home page, logo rows -> home page, cn -> refection components, refection submission -> refection components, refection components -> refection page, logo rows -> refection page.

Sort:

1. logo rows, page view, cn, global not found, home shell, home submission, home action, home confirmation, refection shell, refection submission, refection action, refection confirmation
2. home components, refection components
3. home page, refection page

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| logo rows | How a row of logos is placed and sized, for both pages, by Gray's decision | Its children are the logos |
| page view | The front piece of the Meta module | Mounting it sends one PageView per full load |
| cn | How class lists merge | Later classes win |
| global not found | What the site answers on a path no page serves | Nothing: Next.js serves it |
| home shell, refection shell | The font, the metadata, the theme tokens, the utilities, the guard `overflow-x: hidden` on `html` and the wrap `overflow-wrap: anywhere` on `body` of one page, and which files feed its stylesheet | Nothing: Next.js mounts it |
| home submission, refection submission | What a submit does today on one page: it is held | One handler for the form's `onSubmit` |
| home components, refection components | What one page shows in its hero, footer, separator, watermark, type, calls to action, fields, form and section models, and how each places its slots | Their slots; the file of one page is opened for that page alone |
| home page, refection page | What one page says, shows and in which order | Nothing: Next.js serves it |
| home action, refection action | Where one page's form lands once plugged | It takes `FormData`, another brief plugs it |
| home confirmation, refection confirmation | What one page says after a submission | Nothing: Next.js serves it |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| What the visitor typed in a form | The browser, in the form's fields | The page's `hold_submission`, when it stops being held | The visitor |

## Amendments
- The folder of `/` is the route group `src/app/(home)/`, so `/` and `/confirmation` keep their addresses while every file of the page leaves the root of `src/app/`; each page's `layout.tsx` is a root layout, and `src/app/` keeps only the tab icons.
- The imports inside a page's folder are relative, `./_components/hero`, `../_lib/submission`, so the two folders differ in four lines only: the confirmation path of `actions.ts`, `LayoutProps<"/refection">` in `layout.tsx`, and the name `Refection` of the page component.
- `next dev` had left `.next/dev/types/validator.ts` pointing at the moved files; it is deleted before `npm run typecheck` and the next `next dev` writes it again.
- Round 2: the wide model drops `xl:whitespace-nowrap`, since a line that does not fit must wrap and no line of `/` changes without it; each page's `field.tsx` types its table `satisfies Partial<Record<dictionary_key, …>>` and its `name` as `keyof typeof attributes`, so a key added to the dictionary for the other page opens nothing here.
- Round 3: the four section models are owned and copied per page, `src/components/` keeps `logo_rows.tsx` and `page_view.tsx` only; the row of Shapes that forbade « a second copy of a file of `public/` » is reversed: each page owns `public/home/` or `public/refection/`, its imports and its video URL point at its own, and the illegal state is now a page reaching a file of the other; sections 3, 4 and 7 of `README.md` follow the two folders.
- Round 4: the three tables above are rewritten to the branch, the amendments stay as the record of what each round superseded; the folders differ in five lines, the confirmation path, `LayoutProps<"/refection">`, the page component's name and the page's own `public/` folder in its imports and its video URL. Each page's `field.tsx` is typed by its own union `field_name`, without the dictionary. Each page's `globals.css` is built from its own folder and `src/components/` only, carries `overflow-x: hidden` on `html` and `overflow-wrap: anywhere` on `body`; the submit face of the sheet wraps its label like the call to action's face. `src/app/global-not-found.tsx` gives the site's 404 its `lang`, font and title with two root layouts.

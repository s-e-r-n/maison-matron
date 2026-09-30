# SSOP - refection page

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| The path of a request | The visitor's browser | One page file under `src/app/` | The file tree, read by the Next.js router | `(home)/page.tsx` serves `/`, `(home)/confirmation/page.tsx` serves `/confirmation`, `refection/page.tsx` serves `/refection`, `refection/confirmation/page.tsx` serves `/refection/confirmation`; the two root layouts sit in `(home)/layout.tsx` and `refection/layout.tsx` | One path served by two files, which the router refuses at build |
| The visitor's form entries | The sheet of one page | Held in the browser by that page's `hold_submission`, nothing plugged | `Field`'s `name`, typed `dictionary_key` | `FormData` keyed by the dictionary, one form per page | A field named outside the dictionary |
| The photos, logos, icons and textures | `public/`, one copy | `next/image` and the CSS of both pages | The static import, typed `StaticImageData` | Two pages importing the same files | A second copy of a file of `public/` |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| common sections | - | `children`, and the `title`, `action`, `visual` slots | one placed section | `src/components/centered_section.tsx`, `side_visual_section.tsx`, `wide_visual_section.tsx`, `reviews_section.tsx`, `logo_rows.tsx`, unchanged |
| cn | - | class lists | one merged class list | `src/lib/utils.ts`, unchanged |
| home shell | - | `children` | the `html` and `body` of `/`, its font, its metadata, its theme | `src/app/(home)/layout.tsx`, `src/app/(home)/globals.css`, moved |
| home submission | - | the submit event | the event held | `src/app/(home)/_lib/submission.ts`, moved |
| home components | cn, home submission | each its own `children` and slots | the hero, the footer, the separator, the watermark, the typography, the calls to action, the fields, the form and its sheet of `/` | `src/app/(home)/_components/*`, moved |
| home page | common sections, home components | - | the page served at `/` | `src/app/(home)/page.tsx`, moved |
| home action | the three modules | `FormData` | `/confirmation`, or `{ status: "failed" }` | `src/app/(home)/actions.ts`, moved |
| home confirmation | - | - | the page served at `/confirmation` | `src/app/(home)/confirmation/page.tsx`, moved |
| refection shell | - | `children` | the `html` and `body` of `/refection` | `src/app/refection/layout.tsx`, `src/app/refection/globals.css`, copied |
| refection submission | - | the submit event | the event held | `src/app/refection/_lib/submission.ts`, copied |
| refection components | cn, refection submission | each its own `children` and slots | the same pieces, for `/refection` | `src/app/refection/_components/*`, copied |
| refection page | common sections, refection components | - | the page served at `/refection` | `src/app/refection/page.tsx`, copied |
| refection action | the three modules | `FormData` | `/refection/confirmation`, or `{ status: "failed" }` | `src/app/refection/actions.ts`, copied |
| refection confirmation | - | - | the page served at `/refection/confirmation` | `src/app/refection/confirmation/page.tsx`, copied |

Edges: cn -> home components, home submission -> home components, home components -> home page, common sections -> home page, cn -> refection components, refection submission -> refection components, refection components -> refection page, common sections -> refection page.

Sort:

1. common sections, cn, home shell, home submission, home action, home confirmation, refection shell, refection submission, refection action, refection confirmation
2. home components, refection components
3. home page, refection page

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| common sections | How a section places what it is given | Its slots; a section holds no text, no visual of its own and no condition on the page it serves |
| cn | How class lists merge | Later classes win |
| home shell, refection shell | The font, the metadata, the theme tokens and the utilities of one page | Nothing: Next.js mounts it |
| home submission, refection submission | What a submit does today on one page: it is held | One handler for the form's `onSubmit` |
| home components, refection components | What one page shows in its hero, footer, separator, watermark, type, calls to action, fields and form | Their slots; the file of one page is opened for that page alone |
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

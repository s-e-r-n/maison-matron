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
- Text round 2 (006): « Le dernier chaisier de Suisse » merges into « Le vrai sur-mesure » as a `SectionSubtitle` inside its text block, the separate centred section is removed, and the `action` of `CenteredSection` is left without a caller.
- Text round 4 (015): « 4 saisons, 4 privilèges » gains a greyed note, `SectionNote` in `typography.tsx`, a `p` at 13px in `text-sheet-ink`; being prose, it wraps even inside the stacked model's unwrapped text block.
- Text round 4 (016): every photo of a piece sits in a `figure` with a `Caption`, a `figcaption` in Garamond italic `text-sheet-ink`, the idiom of the form's labels, inset like the side model's text below `md`; the two visual models size every image they hold, `[&_img]`, so a figure and a pair of figures keep each photo at its ratio.

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `typography.tsx` | The size, face, colour and leading of each text level: title, subtitle, note, caption | Which level the text is; a caption goes inside a `figure` |
- Text round 5 (017): the archival photo takes the caption « Photo d'archive » in a `figure`; the privileges become a real `ul` in body text under the subtitle, its bullet `❊` through `list-style-type`, and `SectionNote` leaves `typography.tsx`, no caller left.
- Text round 6 (024): a reviews section « Ils nous ont confié leurs pièces » on `CenteredSection`, right above the form, holds ten reviews without call to action; each review is a `Quote`, the hero's quote level moved into `typography.tsx`, a `p` at 17px and 1.45, and the hero uses it too, its spacing kept on a wrapper.

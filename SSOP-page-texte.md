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
- Text round 7 (human's first directive to page-finale): the reviews section leaves `CenteredSection` for `ReadingSection`, a left aligned model at least one viewport high, its block centred in the column from `md` and held to a 600px reading measure, every child one block apart, 48px then 64px from `lg`; each review is a `figure`, its words a `Quote` in a `blockquote`, the reviewer's name a `Reviewer` `figcaption` on its own line 16px under the quote, in the quote's type.

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| ReadingSection | theme tokens | `children` | a left aligned section at a reading measure, its blocks one gap apart | `src/components/reading_section.tsx` |
| Reviewer | theme tokens | `children` | the name under a review, in the quote's type | `src/components/typography.tsx` |
| page | ReadingSection, Quote, Reviewer | - | the reviews rebuilt | `src/app/page.tsx` |
| page e2e | page | - | each review a block, its name on its own line, the section left aligned at its measure | `tests/conversion_page.spec.ts` |

Sort: 1. ReadingSection, Reviewer; 2. page; 3. page e2e.

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `reading_section.tsx` | The model of a section read line by line: its alignment, its measure, the gap between its blocks | Each block a direct child |
- Text round 8 (messages 003 and 004): every section but section 2 carries « Je veux ma visite offerte ». `ReadingSection` becomes `ReviewsSection`: the title slot on the left edge, the reviews flowing from `lg` in two equal columns, each review whole in one column, and one column below `lg`. Its block is 600px from `md` and 1100px from `lg`, and the required action sits under the reviews. The action slot of `CenteredSection` stays, because the new section « Des centaines de tissus, tous au même prix » after « Le vrai sur-mesure » is centred and calls it. Its logos are imported from `public/fabric-logos/`, laid out by `LogoRows` and `LogoRow`: rows centred with even gaps that wrap, each logo 26px high at most 150px wide at 50% opacity, the one colour marks turned `#1b1b1b` by `brightness-0 invert-[10.6%]`, and the Pierre Frey badge left in its own colours.

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| ReviewsSection | theme tokens | `title`, `children`, `action` | the reviews section, one column then two from `lg`, its action under them | `src/components/reviews_section.tsx` |
| LogoRows, LogoRow | theme tokens | `children` | logos at one height, rows centred and wrapping | `src/components/logo_rows.tsx` |
| page | ReviewsSection, LogoRows, LogoRow, CenteredSection, the logo files | - | the fabrics section and the reviews with their action | `src/app/page.tsx` |
| page e2e | page | - | section order, nine calls to action, the logo rows, the review columns | `tests/conversion_page.spec.ts` |

Sort: 1. ReviewsSection, LogoRows and LogoRow; 2. page; 3. page e2e.

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `reviews_section.tsx` | How the reviews are read: their measure, their columns, the gap between them, the place of the action | Each review a `figure` child; the title and the action in their slots |
| `logo_rows.tsx` | The size, opacity, gaps and centring of a row of brand marks | One `LogoRow` per line, logos as `img` children; the silhouette is set on each mark that needs it |
- Text round 9 (message 005): the reviews carry no call to action, so `ReviewsSection` loses its `action` slot; `LogoRows` stands one block gap from the lines around it, 48px then 64px from `lg` (`my-12 lg:my-16`), collapsing with the 16px rhythm of the centred text block.
- Text round 10 (message 006): the fabrics title opens on « Profitez de »; the logos split five then four in their order, each `LogoRow` spread edge to edge from `lg` (`lg:justify-between`) so both rows share one width and one left and right edge, centred and wrapping below `lg`; « Et tant d'autres… » is set in italic.
- Text round 11 (message 007): the fabrics section moves to `SideVisualSection` with `blue-silk-damask.jpg`, a portrait of 2160 by 2700, without caption; its text block is unchanged. `LogoRows` becomes a size container: its five logo row is 772px wide at full size (26px high, at most 150px wide, 40px apart), so logo height, maximum width and the gap between logos scale by one factor, `min(1, 100cqw / 772px)`, and five always fit on one line; both rows spread edge to edge at every width. `CenteredSection` keeps its `action` slot without a caller, pending the human's approval.

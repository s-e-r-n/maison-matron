# Design references and directives - Maison Matron

## Authority

`REDACTION-page-conversion-piece-unique-maison-matron.md` is the single source of truth for the copy of the page. Only Gray orders a change to it.

## References

- Chanel, Haute Joaillerie, Signatures Collection N°5: https://www.chanel.com/ch-fr/haute-joaillerie/signatures-collection-n5/
- Hermès, Artisan contemporain depuis 1837: https://www.hermes.com/ch/fr/content/235001-hermes-artisan-contemporain-depuis-1837/

## Direction

We do not design with animations and effects. The ordinary visitor does not like animations, only designers do. What makes the difference is schoolbook graphic design.

- A defined grid, held perfectly.
- Typefaces chosen with extreme care: Garamond, and the system font for the body text.
- Spacing kept regular throughout.
- A finished set of colours. For now plain `#fff` and `#000`, to lay the foundations.
- Visuals carry the design. This exercise places them without holding them, which is what forces the layout to be thought through.
- Kerning is never touched by reflex.
- Line height is adapted so that lines stay close to one another. It does not grow in proportion to the size of the text.

## Principles taken

| Rank | Source | Principle |
| --- | --- | --- |
| 1 | Hermès | One single gap separates every block from the next, 48px below 1024px and 64px above, applied uniformly instead of a value chosen per section. |
| 2 | Hermès | A text block is centred and pushed far away from the edges, 15px of margin plus 20px of padding on mobile, then a 12% inset above 1024px, then a fixed 150px inset above 1290px, inside a container capped at 1258px. |
| 4 | Hermès | A text block holds exactly one title, one short paragraph and one link, and never a second idea. |
| 5 | Hermès | Section titles are set in sentence case with no letter spacing, against the uppercase letter spaced default the rest of the site uses for the same heading level. |
| 6 | Hermès | Inside a text block every element but the first carries 16px below it and the last carries none, so a block of several lines has one internal rhythm and no exception. |

Row 4 is taken without its link: the block holds one title and one short paragraph, and nothing else.

From Chanel one thing only is taken: the visuals carry the immersivity. Our visuals line the space.

## Principles refused

| Rank | Why |
| --- | --- |
| 3 | Illegible. |
| 7 | Bad UX. The call to action is a special element, built apart and designed last. |
| 8 | Refused. |
| 9 | Refused. |
| 10 | Refused. |
| 11 | Refused. |

Ranks 12 to 24 are not read and are not in force.

## UX

- The site is 100 % responsive, and responsiveness is settled at every step. With Tailwind, `xs` is never targeted: it is the base style. The targets are `md` and `lg`.
- No navigation. One linear page, one single path, ruled by the marketing thread.
- No mouse effect. What does not exist on mobile does not exist on desktop.
- Nothing is added that carries no real impact, brings no gain, or does not improve the visitor's experience.

## Order of work

The form is designed last.

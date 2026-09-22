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

| Rank | Source | Section | Principle |
| --- | --- | --- | --- |
| 1 | Hermès | Every block of the page | One single gap separates every block from the next, 48px below 1024px and 64px above, applied uniformly instead of a value chosen per section. |
| 2 | Hermès | Hermès, acteur économique et social | A text block is centred and pushed far away from the edges, 15px of margin plus 20px of padding on mobile, then a 12% inset above 1024px, then a fixed 150px inset above 1290px, inside a container capped at 1258px. |
| 4 | Hermès | Une maison d'artisans aux valeurs humanistes | A text block holds exactly one title, one short paragraph and one link, and never a second idea. |
| 5 | Hermès | Hermès dans le monde | Section titles are set in sentence case with no letter spacing, against the uppercase letter spaced default the rest of the site uses for the same heading level. |
| 6 | Hermès | Six générations d'artisans | Inside a text block every element but the first carries 16px below it and the last carries none, so a block of several lines has one internal rhythm and no exception. |

Row 4 is taken without its link: the block holds one title and one short paragraph, and nothing else.

From Chanel one thing only is taken: the visuals carry the immersivity. Our visuals line the space.

## Principles refused

| Rank | Source | Section | Principle | Why |
| --- | --- | --- | --- | --- |
| 3 | Hermès | Créativité, innovation et singularité au cœur de la stratégie | The section title and the paragraph under it use the same serif family in the same italic, and only a size step from 16-20px to 30-34px plus a 40 point weight step separate them. | Illegible. |
| 7 | Hermès | Hermès, acteur économique et social | The call to action is a text link underlined by a 1px rule, set at the smallest size of the page and placed 16px below the paragraph on mobile and 24px above 1024px, never a filled button. | Bad UX. The call to action is a special element, built apart and designed last. |
| 8 | Chanel | COLLECTION N°5, LES SIGNATURES DE CHANEL | The page title runs from 25px on mobile to 40px above 961px, uppercase, with letter spacing growing from 0.09rem to 0.15rem as the size grows. | Refused. |
| 9 | Chanel | COLLECTION N°5, LES SIGNATURES DE CHANEL | The paragraph under the title is set at caption size, 11px to 12px, about a third of the title, so the hierarchy is carried by the gap between the two sizes rather than by a large body. | Refused. |
| 10 | Chanel | COLLECTION N°5, LES SIGNATURES DE CHANEL | Side gutters are a percentage of the viewport, 5.33% on mobile and about 8% above, inside a container capped at 1441px, so the margin grows with the screen instead of staying fixed. | Refused. |
| 11 | Chanel | COLLECTION N°5, LES SIGNATURES DE CHANEL | The title block is capped at 792px and aligned to the top left of its section rather than centred in it. | Refused. |

The ranking ran to 24. Ranks 12 to 24 were never read, they are not in force, and they are not carried here.

## UX

- The site is 100 % responsive, and responsiveness is settled at every step. With Tailwind, `xs` is never targeted: it is the base style. The targets are `md` and `lg`.
- No navigation. One linear page, one single path, ruled by the marketing thread.
- No mouse effect. What does not exist on mobile does not exist on desktop.
- Nothing is added that carries no real impact, brings no gain, or does not improve the visitor's experience.

## Order of work

The form is designed last.

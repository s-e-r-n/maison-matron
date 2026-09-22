# Past decisions

Append only. One row per decision. A row is never edited or deleted, a reversal is a new row.

A row exists when a problem was raised and a decision closed it. Nothing else gets a row.
Problem and decision are one line each. An error code, a trace id or a ticket number goes in Ref, never the error itself.

| Date | Problem | Decision | Ref |
| ---- | ------- | -------- | --- |
| 2026-09-22 | Four paper textures were candidates for the form, and only one can be the sheet the visitor writes on | `paper-soft-ivory-tooth.jpg` is the paper of the form, `paper-faint-fibre.jpg` is kept in reserve; the two others are deleted | - |
| 2026-09-22 | Between the two reserved papers, only one can stay as the form's production paper | `paper-faint-fibre.jpg` is the production paper of the form, replacing the earlier choice of `paper-soft-ivory-tooth.jpg` | - |
| 2026-09-23 | At 390px the watermark carried over the full height of the part takes 18,05 % of the width, above the 12 % checkpoint, and the SVG slenderness of 11,986 forbids anything narrower | The full height is kept at every width, the 18,05 % at 390px is accepted | - |

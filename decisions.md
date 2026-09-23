# Past decisions

Append only. One row per decision. A row is never edited or deleted, a reversal is a new row.

A row exists when a problem was raised and a decision closed it. Nothing else gets a row.
Problem and decision are one line each. An error code, a trace id or a ticket number goes in Ref, never the error itself.

| Date | Problem | Decision | Ref |
| ---- | ------- | -------- | --- |
| 2026-09-22 | Four paper textures were candidates for the form, and only one can be the sheet the visitor writes on | `paper-soft-ivory-tooth.jpg` is the paper of the form, `paper-faint-fibre.jpg` is kept in reserve; the two others are deleted | - |
| 2026-09-22 | Between the two reserved papers, only one can stay as the form's production paper | `paper-faint-fibre.jpg` is the production paper of the form, replacing the earlier choice of `paper-soft-ivory-tooth.jpg` | - |
| 2026-09-23 | At 390px the watermark carried over the full height of the part takes 18,05 % of the width, above the 12 % checkpoint, and the SVG slenderness of 11,986 forbids anything narrower | The full height is kept at every width, the 18,05 % at 390px is accepted | - |
| 2026-09-23 | The watermark spanning the full height took 18,05 % of the width at 390px, and the part showed a standalone page no visitor would ever meet | The watermark is rendered from 1024px only, alone in a reserved right gutter it never leaves, and the part « Le filigrane » states that rule in words instead of showing a page | - |
| 2026-09-23 | In the claude.ai artifact the page is wrapped in a host document that injects `img{max-width:100%}`, which capped the watermark at the width of its gutter, 141,83 px tall instead of the full viewport height | The watermark carries `max-width: none`, `height: auto` and `max-height: none`, so its size comes from the page alone whatever a host injects on `img` | - |
| 2026-09-23 | The layout sent a PageView to Meta CAPI on every load, while phase one connects nothing to the services | `PageView` is unplugged from `src/app/layout.tsx`, its component kept unused until phase two | - |
| 2026-09-23 | The form of `material/design.html` switches to two columns at 600px, while the page targets only `md` and `lg` | The sheet form switches to two columns at `md`, 768px | - |
| 2026-09-23 | At 320px « S'abonner aux 4 privilèges » overflowed the page by 10px on one line | The button label wraps on a second line only when it cannot fit, the button keeps 216px minimum and 58px minimum height | - |
| 2026-09-23 | The hero showed a 16:9 black placeholder frame where the design waited for footage | The hero is full frame, `maison-matron-hero.mp4` plays muted in a loop as its background, copied as delivered, its optimization deferred | - |
| 2026-09-23 | The white copy and logotype of the hero vanished over the bright shots of the video | A uniform black mask at 40 % lies over the whole video, and a progressive blur covers the bottom 8 % of the hero | - |

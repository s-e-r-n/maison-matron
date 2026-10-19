# SSOP autoplay video

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Playback refusal | rejection of `play()` | `keep_playing` | the `catch` of `play()`, `DOMException` name read | `unknown` narrowed to `NotAllowedError`, `AbortError`, anything else | a rejection swallowed: each one lands in exactly one of three branches |
| Page visibility | `document.visibilityState` | `keep_playing` | read on every attempt | `"visible"` or `"hidden"` | an attempt spent on a hidden page |
| Blocked flag | `keep_playing` | `AutoplayVideo` render | `on_blocked_change(blocked)` | `boolean` | the affordance shown after a `playing` event |
| Video props | `src/app/page.tsx` | `AutoplayVideo` | typed props, proven by the type checker | `{ src: string, poster: StaticImageData, label: string }` | a video without poster, without intrinsic size, or without label |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `keep_playing` | a mounted video, a blocked listener | `(video: HTMLVideoElement, on_blocked_change: (blocked: boolean) => void)` | `release: () => void` | `src/lib/keep_playing.ts` |
| `AutoplayVideo` | `keep_playing`, `StaticImageData` | `{ src, poster, label }` | the video, and the affordance while blocked | `src/components/autoplay_video.tsx` |
| fabrics figure of `/` | `AutoplayVideo`, the reel and its poster | none | the figure | `src/app/page.tsx` |

Edges: `AutoplayVideo` needs `keep_playing`. The fabrics figure needs `AutoplayVideo`. The reel, its poster and `StaticImageData` come from outside.

1. `keep_playing`
2. `AutoplayVideo`
3. fabrics figure of `/`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `keep_playing` | how WebKit's autoplay policy is answered: muted and inline attributes, rejection names, gesture unlock, visibility, retry budget | pass a mounted video and a listener, call the returned function on unmount, the listener hears `true` on a refusal and `false` on confirmed playback |
| `AutoplayVideo` | how a muted looping video and its refusal affordance appear | the video URL, its first frame as a static import, a label; it fills the width of its container |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| this video is refused | `AutoplayVideo` state | `AutoplayVideo` render | `keep_playing`, through `on_blocked_change` |
| videos waiting for a gesture | `keep_playing` module | the gesture unlock | `keep_playing` on a refusal, on `playing`, on release |
| retries left for one video | `keep_playing` closure of that video | its attempts | `keep_playing` |

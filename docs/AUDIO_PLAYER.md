# Audio player — P03

P03 provides a two-clip screen and a reusable audio player. **Accepted on 2026-11-09** after real-device checks on two phones (see below), by the product owner's choice; the Android tablet + Chrome check moves to P09. Playwright WebKit execution is still pending because agent environments reject its official download hosts.

## Behaviour and boundaries

- A tap starts the operation. The runtime creates/resumes an AudioContext synchronously before its first network/decode await, then decodes the complete MP3 and starts a new buffer source. It requests no media byte range.
- The data-layer adapter reads complete responses from `kumacz-audio-v1`, or fetches bundled same-origin audio. It rejects redirects, external URLs, partial responses and HTML pages. Only successfully decoded bytes are remembered. Cache refusal leaves online playback available; corrupt cached audio is removed before a later retry.
- Replaying or selecting another sample stops the previous operation. Stop, hiding the page, leaving it or unmounting also cancels pending work. Late async results cannot start obsolete audio or overwrite a newer state.
- If the file fails, fallback selects only a voice with `localService === true`. English requires `en-GB` (including its variants); Polish accepts `pl`/`pl-PL`. American English, remote/default voices and unknown locality are ineligible. The utterance always gets the selected voice explicitly.
- Voices are read again on every retry, so a list that arrives asynchronously can be used on the next tap. No delayed automatic speech starts when the OS voice list changes.
- Each source has a ten-second **startup** deadline. A rejected/pending unlock, missing voice or speech error remains retryable. Playback completion and cancellation are separate outcomes.
- The small permanent “Nagranie syntetyczne” label stays beside both sets of controls in idle, playback and error states (F-45, D-84). The screen also contains voice credits. It is a playback check screen, not an exercise or the final F-33 About screen.

No learning-time counter, answer, reward, profile or progress record is written here. `AudioOutcome` distinguishes `played`, `unavailable` and `cancelled`. A future exercise must keep listening-dependent work ungraded on `unavailable`/`cancelled` and offer retry (F-41); `played` is not a correct learner answer. Exercise-level integration belongs to P07/P08 and the session stages.

Content lives in `src/content/audio-samples.json`. P04's 2026-11-09 pronunciation review found that the generator's Polish language setting had not reached the native binding; the original Polish fixture actually used the English default. The screen now references the regenerated, hash-versioned P04 shared prompt; its P04 listening/material acceptance was recorded on 2026-11-10 in [`PILOT_LESSON.md`](PILOT_LESSON.md). The English fixture and original P02 files remain unchanged. Earlier phone checks below establish playback of those original bytes, not Polish pronunciation or acceptance of the replacement. Do not slow/regenerate a clip without listening and updating its provenance; the earlier Cori short-word distortion is recorded in STATUS. Version asset paths when content changes: this small cache-first adapter is a P03 boundary, and P36/P37 still own final package verification, cache/update versioning and offline app reopening. Cached replay in an already loaded page is not full offline readiness.

## Commands

```sh
npm ci
npm test
npm run check
npm run test:e2e
```

Playwright uses its matching installed Chromium/WebKit binaries by default:

```sh
npm exec -- playwright install chromium webkit
```

For a preinstalled Chromium, an explicit override is available; it does not affect the WebKit project:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --project=chromium --workers=1
```

The E2E runner builds a production preview at `http://127.0.0.1:4173/kumacz/`; keep that port free. Type-checking includes the E2E sources. No npm dependency or lockfile change is needed for P03, and dependency install scripts remain disabled.

## Verification record — 2026-11-07

- Final commands passed: **16 unit tests**, **9 Chromium E2E cases**, and the combined type-check/production build. Chromium was the installed system version 154.0.8037.57; no real-device or WebKit execution is included in those counts.
- Unit checks cover explicit local voice selection, file/local completion, unavailable outcomes, cancellation, late results, startup deadlines, cache failures, invalid responses and external URL refusal. The tests were introduced before the corresponding changes; missing implementation and regression failures were observed.
- Chromium browser checks use real MP3 decoding, AudioContext and Cache Storage for initial play, replay, stop and offline cached replay after a fresh page load. They also cover retry after a missing/corrupt file, storage denial, a controlled context rejection and narrow touch controls.
- OS speech is a controlled boundary in browser tests: success/error, exact local British voice selection, remote refusal and a list becoming available on a later tap. This verifies application policy and event handling, **not actual OS speech quality or the device's `localService` reporting**.
- The local-service policy tests detect an intentional inversion of the locality guard. Native browser playback does not produce automatic external requests.
- `npm run check` passes. The public sample files remain identical to P02. No Android/iPad result is asserted.
- WebKit 27.2 / Playwright build `v2388` could not download: the proxy returned HTTP 403 `Domain forbidden` for `cdn.playwright.dev` and `playwright.download.prss.microsoft.com`. The configured WebKit tests remain enabled; no proxy bypass or test skip was introduced. Once the environment permits the official downloads, install the browsers and run the WebKit project.

## Real-device record — 2026-11-09

Product owner, on the Pages test build (D-85), both clips:

| Device | Browser | Online playback | Offline replay (airplane mode, page already open) |
|---|---|---|---|
| iPhone (model/version not recorded) | Safari | passed | passed |
| Android smartphone (model/version not recorded) | Dolphin | passed | passed |

Not covered: the primary target (Android tablet + Chrome, N-01), stop/rapid switching and rotation were not reported separately, and the local-voice fallback was not exercised. The tablet + Chrome check is part of P09.

## Required actual-device check (tablet, P09)

**Simple route (D-85):** open `https://bartosz-szubert.github.io/kumacz/` in Chrome on the tablet. Play both clips, replay, stop during playback and alternate quickly; rotate the tablet. Then, with the page still open and both clips played once, switch on airplane mode and replay both. Check that "Nagranie syntetyczne" stays visible. The steps below (USB remote debugging) are for detailed diagnostics: blocked files and local-voice fallback.

Record the device/browser versions, date, audible result for both clips and the observations below. Keep children's real profiles and recordings out of the repository.

1. Run the production build on a computer and start its preview:

   ```sh
   npm run build
   npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
   ```

2. Connect Android Chrome by USB remote debugging (`chrome://inspect/#devices` on desktop Chrome). Forward device port `4173` to computer `localhost:4173`, then open `http://localhost:4173/kumacz/` on the tablet. This loopback origin supports Cache Storage; a plain LAN HTTP address may not. A trusted HTTPS development preview is another option.
3. Confirm silence before tapping. Listen to both samples, replay, stop during playback and alternate the two quickly. Check that the word/instruction is clear, the earlier clip stops, both labels stay visible and the controls work in portrait/landscape.
4. With the page loaded and the clips already played, set the tablet page's network to **Offline in remote DevTools**, then replay both. Re-enable it afterward. Turning off Wi-Fi alone does not prove this when a USB forwarding connection still reaches the server. Do not expect a cold offline app reload to work before P36.
5. Use remote DevTools request blocking for the chosen MP3 and remove **only its P03 audio-cache entry** in Application → Cache Storage. Check local fallback with an eligible installed voice, then with no eligible voice (or an unavailable OS speech engine): retry should remain available and no remote voice should be selected. Inspect the OS list using `speechSynthesis.getVoices()` and its `lang`/`localService` fields. Do not infer locality from a voice's name.
6. Remove the request block, retry the bundled recording and confirm recovery. Confirm backgrounding the page stops it. Record any playback/autoplay/voice-reporting failures before closing P03.

## Sources used

- [AudioContext resume](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume)
- [Complete-file decoding](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData)
- [Stopping a scheduled source](https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/stop)
- [Explicit voice locality](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService)
- [Speech queue](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/speak) and [voice-list updates](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event)
- [Cache response handling](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [React subscription to a non-React store](https://react.dev/reference/react/useSyncExternalStore)

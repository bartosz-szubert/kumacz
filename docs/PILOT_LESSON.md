# P04 pilot lesson — animals

**Accepted:** 2026-11-10, with the owner's explicit PR #18 merge approval. Dog is accepted; elephant variants 2/3 are accepted, with variant 2 selected; horse variant 2 is selected after the owner confirmed the only remaining concern was absent r, which matches standard UK /hɔːs/ (D-83).

One level-1 lesson, seven words. The recommended animal category was used after the product owner instructed Codex to proceed. This supplies the data for P07–P09; the child-facing app still shows the P03 audio check. The pilot with children remains P10 (D-44).

## Review the material

**Current selected audio:** the table links to the accepted lesson files including horse/elephant variant 2. **Nagrania syntetyczne:** [hear those two selected files](review/horse-elephant-selected-2.wav) (about 4 seconds, lossless WAV). The [six-entry comparison](PRONUNCIATION_REVIEW.md) and full revision-3 sequence below are historical references; they include superseded clips. The owner approved the final material and PR merge on 2026-11-10.

**Nagranie syntetyczne.** [Historical revision-3 full review (contains superseded horse/elephant)](review/animals-review-v3.mp3) (about 33 seconds). It starts with “Posłuchaj słowa i wybierz pasujący obrazek.”, then reads each English word and its Polish translation in the table order. Individual files are linked below. On GitHub, use the file's download/raw button if playback is unavailable.

Twemoji graphics: Twitter, Inc. and other contributors; maintained by [jdecked/twemoji](https://github.com/jdecked/twemoji/tree/b6b55fef1e8636b540a6d016a4729ca8cdf2e60b), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Selected SVG files unchanged. English synthetic voice: Cori medium (Bryce Beattie); Polish synthetic voice: Supertonic 3 (Supertone), preset 0. Sources and terms: [asset review](ASSET_LICENCES.md), [public notice](../public/assets/NOTICE.txt).

| Picture | English | Polish | Synthetic audio | Pair starts in review |
|---|---|---|---|---|
| <img src="../public/assets/pictures/twemoji/1f431.a7f61fb700b3.svg" width="64" height="64" alt="cat"> | cat | kot | [EN](../public/assets/audio/animals/en-GB-cat.b57946182716.mp3) · [PL](../public/assets/audio/animals/pl-PL-cat.31c925fe2b2a.mp3) | 5.0 s |
| <img src="../public/assets/pictures/twemoji/1f436.52acbb8b0f2d.svg" width="64" height="64" alt="dog"> | dog | pies | [EN](../public/assets/audio/animals/en-GB-dog.da36841efc9c.mp3) · [PL](../public/assets/audio/animals/pl-PL-dog.e744714e2b60.mp3) | 8.8 s |
| <img src="../public/assets/pictures/twemoji/1f41f.caa8008ee6db.svg" width="64" height="64" alt="fish"> | fish | ryba | [EN](../public/assets/audio/animals/en-GB-fish.f1ff40677adc.mp3) · [PL](../public/assets/audio/animals/pl-PL-fish.9cb72dc1f8fd.mp3) | 12.7 s |
| <img src="../public/assets/pictures/twemoji/1f438.82f93e8eec26.svg" width="64" height="64" alt="frog"> | frog | żaba | [EN](../public/assets/audio/animals/en-GB-frog.d9f8d504a551.mp3) · [PL](../public/assets/audio/animals/pl-PL-frog.c128ca269a06.mp3) | 16.5 s |
| <img src="../public/assets/pictures/twemoji/1f40e.a61f892c6c36.svg" width="64" height="64" alt="horse"> | horse | koń | [EN](../public/assets/audio/animals/en-GB-horse.b8bc5e42ff36.mp3) · [PL](../public/assets/audio/animals/pl-PL-horse.8b740c4b9d23.mp3) | — |
| <img src="../public/assets/pictures/twemoji/1f404.91749a903f15.svg" width="64" height="64" alt="cow"> | cow | krowa | [EN](../public/assets/audio/animals/en-GB-cow.ee42c186426f.mp3) · [PL](../public/assets/audio/animals/pl-PL-cow.e153bae2b040.mp3) | 24.6 s |
| <img src="../public/assets/pictures/twemoji/1f418.b23f4d2146dc.svg" width="64" height="64" alt="elephant"> | elephant | słoń | [EN](../public/assets/audio/animals/en-GB-elephant.01b680cd0241.mp3) · [PL](../public/assets/audio/animals/pl-PL-elephant.e4484fc18209.mp3) | — |

Listen for the complete word, pronunciation, stray sounds, truncation and consistent volume in **all 15 clips** (seven English words, seven Polish translations and the Polish instruction). Revision 3 levels the seven English words and regenerates the owner-approved instruction text; dog/horse use fresh sentence-punctuated Cori synthesis. Polish word translations are the improved revision-2 recordings. Listen especially for the final consonants of dog and horse and the balance between languages. If a word sounds wrong, report the word and language. The owner rejected revision 1 Polish pronunciation and reported revision 2 much better. After the comparison, variant 2 was selected for horse and elephant on 2026-11-10. Numerical level/decoding checks do not establish pronunciation; selections are based on that feedback.

## Content contract

- Data: [animals.json](../src/content/english/level-1/animals.json), format version 1. The module, level, lesson and word IDs are persistent identifiers; keep them when reordering or correcting text. A word ID is independent of its lesson position. Materially changing the learning concept needs a new ID. Asset paths include content hashes so replacement files cannot inherit stale audio from P03's cache. Resolve paths relative to Vite's `BASE_URL`, retaining `/kumacz/` on Pages.
- The seven words are in the **Pre A1 Starters Animals** column of the official [Cambridge English thematic wordlist](https://www.cambridgeenglish.org/images/149679-yle-starters-word-list.pdf), printed page 38. Polish translations are prepared for Kumacz. No Cambridge illustrations or exercises are copied.
- `exerciseTypes` currently lists only `flashcard` (F-08) and `listen-and-tap` (F-09), matching the P09 pilot. The English/Polish audio objects match P03's `AudioClip` shape. `instructions` supplies the reusable Polish F-09 prompt. P08 owns the remaining flashcard UI text and its audio; written/context tasks are P17/P18.
- Each target has two curated `distractorIds`, giving three distinct pictures (F-09 permits 3–4). All options are from this lesson. `confusablePairs` conservatively excludes cat/dog and cow/horse **anywhere in the full option set**, including between distractors (F-40). These are content curation choices, not a general animal-similarity algorithm. P07 must vary answer placement; array order does not prescribe a correct-answer position.
- Show the Polish translation and its audio on the flashcard back and after checking an answer (F-39). The JSON carries material, not display timing. It does not change session composition, the maximum of three new words, grading, Leitner or lesson completion.
- Seven pinned Twemoji SVGs were rendered and visually inspected by Codex. The child's recognition of these pictures and comprehension of the prompt still need P10 observation. Do not expand the other lessons before that feedback (D-44).

## Polish pronunciation correction — 2026-11-09

The owner reported that Polish words sounded English (e.g. “ryba” as “rajba”). A minimal check against the real sherpa-onnx 1.13.8 Python binding showed that `generation.extra["lang"] = "pl"` mutates a returned dictionary copy: reading `generation.extra` still gives `{}`. The [pinned native implementation](https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/sherpa-onnx/csrc/offline-tts-supertonic-impl.cc) defaults an absent `lang` to `en`. Assigning the whole property, `generation.extra = {"lang": "pl"}`, preserves it in the native configuration.

The regression test uses the real binding, not a mocked dict, and failed for words and the instruction before the fix. All eight Polish clips were regenerated with the same approved model/preset and fresh hash paths. The playback check now uses the corrected shared prompt. The original P02 fixture bytes remain as historical test evidence and are no longer referenced by the screen or lesson; its earlier device results concern playback, not Polish pronunciation. Superseded hashes and the rejected revision are recorded in the pilot provenance. The old review sequence is replaced by `animals-review-v2.mp3` to avoid cached revision 1.

## Level and instruction refinement — 2026-11-09

The owner reported much better Polish in revision 2, but quiet English made dog sound like doll and horse hard to hear. They explicitly chose the clearer instruction “Posłuchaj słowa i wybierz pasujący obrazek.” The updated prompt is also used on the playback check screen.

Revision 3 applies a measured constant gain to each English word, matching active speech level to the median of the seven Polish translations. Dog and horse were regenerated as `Dog.` and `Horse.` at the approved Cori speaker/speed 1.0; `synthesisText` records this punctuation while display/fallback text stays the ordinary word. The other five English source WAVs are reused with gain only. No audio is trimmed or time-stretched. Every changed MP3 has a fresh content-hash path.

The preparation target is active RMS −20.5 dBFS, measured in 20-ms decoded mono PCM blocks within 25 dB of the loudest block; this excludes padding silence consistently. Actual encoded English results are approximately −21.3 to −20.9 dBFS, versus roughly −32 to −27 dBFS in the first quiet recordings. Changed clips remain below −3 dBFS sample peak. This is a preparation check, not a claim of equal perceived loudness or a runtime learning rule. The [FFmpeg volume filter](https://ffmpeg.org/ffmpeg-filters.html#volume) applies each recorded `gainDb` before MP3 encoding. No limiter/compressor or playback-rate change is used. Remeasure after any regeneration; a past gain does not establish that new bytes are safe or clear.

The provenance stores source/encoded level measurements, gain, synthesis input, superseded hashes, the owner's feedback and the review sequence. Human listening still decides whether the final consonants are distinct and the cross-language balance is comfortable. The new review filename is `animals-review-v3.mp3`.

## Selected pronunciation — 2026-11-10

The owner accepted elephant variants 2 and 3. Variant 2 uses standard Cori parameters and was selected according to the earlier recommendation. For horse, the owner clarified that absent r was the only remaining concern with variants 2/3. [Cambridge's UK pronunciation reference](https://dictionary.cambridge.org/pl/pronunciation/english/horse) gives /hɔːs/, compared with US /hɔːrs/: the standard non-rhotic British target has no pronounced r here. Variant 2 was therefore selected for horse as well; no accent or voice change is implied.

Both selected MP3s were copied byte for byte from the heard comparison candidates, with fresh content-hash lesson paths and updated source/output metadata. Dog remains the accepted revision-3 recording. Superseded horse/elephant reference files are archived under `docs/review/pronunciation` so the historical six-entry comparison remains reproducible. Its candidate and selection record is in the comparison provenance. The current table/lesson JSON are authoritative; the old full review is explicitly historical. The short selected-words WAV uses the actual new lesson MP3s without another lossy encode.

## Second review and pilot observations — 2026-11-10

The product owner supplied Claude's second review of P04/P05, reporting passing types/build, 20 unit tests and 14 Chromium cases. The following P04 observations are non-blocking and do not change its acceptance:

- **Picture recognition (P10):** cat, dog and frog show heads, while horse, cow, elephant and fish show whole animals. Observe whether children independently recognise both framings during the pilot before proposing an illustration change.
- **Polish audio pacing (later lessons):** the reviewer reports approximately 0.3 s of leading silence in the Polish translations. Consider trimming when preparing later lessons, with listening checks to preserve complete words. The accepted P04 recordings remain unchanged.

## Provenance and generation

[pilot-animals-provenance.json](../tools/content/pilot-animals-provenance.json) records the vocabulary source, exact Twemoji revision/source paths/hashes, generation tool, model archives/input hashes, texts, voice settings, output hashes and the regenerated shared prompt. The model-specific licence review from P02 applies to these same fixed educational voices. Preserve the [public notice](../public/assets/NOTICE.txt) and show “Nagranie syntetyczne” wherever the app exposes playback (F-45); P35 must retain the credits in About.

Use the isolated, hash-pinned [P02 preparation environment and model verification](../tools/audio/README.md). No models or WAV intermediates are shipped. From the repository root, regenerate candidates outside the repository:

```sh
.venv-audio/bin/python tools/audio/generate-fixtures.py "$KUMACZ_AUDIO_WORK/models" "$KUMACZ_AUDIO_WORK/generated-animals" --manifest tools/content/pilot-animals-provenance.json
```

The optional manifest leaves the original P02 command unchanged. Cori uses speaker 0, speed 1.0; Supertonic uses preset 0, speed 1.0, eight steps, language `pl`. Conversion is MP3, libmp3lame 64 kbit/s, mono 22,050 Hz, with synthetic metadata. Inference is local; output bytes may differ on regeneration. Listen before replacing a clip, then update its output metadata and the hash in its filename/reference together. Never overwrite an immutable asset path with different bytes.

The review-only MP3 was made by decoding the listed files to 22,050 Hz mono PCM, appending one second of silence after each clip, concatenating in the recorded sequence and encoding at 64 kbit/s. Its hash and sequence offsets are in the manifest. It lives under `docs/review`, outside Vite's `public` tree, and is not included in the learning data or app package.

## Checks and remaining acceptance

Automated data checks run with `npm test` (focus: `npm test -- tools/content/animals.test.ts`): complete word/translation/audio coverage, unique IDs, supported pilot types, same-lesson distractors, exclusions across all three choices, local paths and actual asset hashes. The tests validate the committed lesson; they are not a runtime content-import validator. Keep future content checks with the content preparation tools, outside the browser bundle.

Technical preparation also checks all SVGs as XML (only passive shape elements in these seven pinned files), every new MP3's full FFmpeg decode, format, duration and synthetic metadata. The complete learning asset set is about 164 kB, plus the existing P03 fixtures. These checks do not establish full offline readiness (P36).

Verified after revision 3 on 2026-11-09: `npm run check`, 20 Vitest tests, 3 Python generator tests against sherpa-onnx 1.13.8, and 9 existing Chromium browser tests passed. The Python regression fails if the ignored item mutation is restored. System Chromium 154 decoded all 15 revision-3 lesson MP3 references under `/kumacz/`, and the playback screen completed the corrected Polish prompt. All seven SVGs were rendered and inspected during initial preparation. Changed clips pass full MP3 decoding and peak/active-level checks; source WAVs are non-silent without saturated 16-bit samples. Their format and synthetic metadata remain recorded. Initial negative checks also rejected an invalid cat/dog choice set and a changed model checksum. These are technical results, not a listening or real-device acceptance result.

The pronunciation selections and P04 acceptance are recorded above and in provenance; explicit owner merge approval was given on 2026-11-10. The target-tablet Chrome check remains in P09, and children's content validation remains P10. No extra lessons are part of this PR.

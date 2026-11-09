# P04 pilot lesson — animals

**Prepared:** 2026-11-09. **Acceptance:** human listening review pending (D-83).

One level-1 lesson, seven words. The recommended animal category was used after the product owner instructed Codex to proceed. This supplies the data for P07–P09; the child-facing app still shows the P03 audio check. The pilot with children remains P10 (D-44).

## Review the material

**Nagranie syntetyczne.** [Play/download the complete listening review](review/animals-review.mp3) (about 31 seconds). It starts with “Posłuchaj i wybierz obrazek.”, then reads each English word and its Polish translation in the table order. Individual files are linked below. On GitHub, use the file's download/raw button if playback is unavailable.

Twemoji graphics: Twitter, Inc. and other contributors; maintained by [jdecked/twemoji](https://github.com/jdecked/twemoji/tree/b6b55fef1e8636b540a6d016a4729ca8cdf2e60b), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Selected SVG files unchanged. English synthetic voice: Cori medium (Bryce Beattie); Polish synthetic voice: Supertonic 3 (Supertone), preset 0. Sources and terms: [asset review](ASSET_LICENCES.md), [public notice](../public/assets/NOTICE.txt).

| Picture | English | Polish | Synthetic audio | Pair starts in review |
|---|---|---|---|---|
| <img src="../public/assets/pictures/twemoji/1f431.a7f61fb700b3.svg" width="64" height="64" alt="cat"> | cat | kot | [EN](../public/assets/audio/animals/en-GB-cat.409aa7d78ce6.mp3) · [PL](../public/assets/audio/animals/pl-PL-cat.9f173fd5f63b.mp3) | 3.5 s |
| <img src="../public/assets/pictures/twemoji/1f436.52acbb8b0f2d.svg" width="64" height="64" alt="dog"> | dog | pies | [EN](../public/assets/audio/animals/en-GB-dog.6317eb438427.mp3) · [PL](../public/assets/audio/animals/pl-PL-dog.158810efa74c.mp3) | 7.3 s |
| <img src="../public/assets/pictures/twemoji/1f41f.caa8008ee6db.svg" width="64" height="64" alt="fish"> | fish | ryba | [EN](../public/assets/audio/animals/en-GB-fish.dbba89e3d03d.mp3) · [PL](../public/assets/audio/animals/pl-PL-fish.d1d44c9899d0.mp3) | 11.1 s |
| <img src="../public/assets/pictures/twemoji/1f438.82f93e8eec26.svg" width="64" height="64" alt="frog"> | frog | żaba | [EN](../public/assets/audio/animals/en-GB-frog.a75ee7fa6d9e.mp3) · [PL](../public/assets/audio/animals/pl-PL-frog.2263ebea0987.mp3) | 14.9 s |
| <img src="../public/assets/pictures/twemoji/1f40e.a61f892c6c36.svg" width="64" height="64" alt="horse"> | horse | koń | [EN](../public/assets/audio/animals/en-GB-horse.cdfadb840a31.mp3) · [PL](../public/assets/audio/animals/pl-PL-horse.19c3d8abd952.mp3) | 19.0 s |
| <img src="../public/assets/pictures/twemoji/1f404.91749a903f15.svg" width="64" height="64" alt="cow"> | cow | krowa | [EN](../public/assets/audio/animals/en-GB-cow.6a53bbc6cd47.mp3) · [PL](../public/assets/audio/animals/pl-PL-cow.21f9b7cbf512.mp3) | 23.0 s |
| <img src="../public/assets/pictures/twemoji/1f418.b23f4d2146dc.svg" width="64" height="64" alt="elephant"> | elephant | słoń | [EN](../public/assets/audio/animals/en-GB-elephant.f331b954ab25.mp3) · [PL](../public/assets/audio/animals/pl-PL-elephant.cc26c9c0e207.mp3) | 26.8 s |

Listen for the complete word, pronunciation, stray sounds, truncation and consistent volume in **all 14 new clips**. If a word sounds wrong, report the word and language; regenerate only that clip and repeat its listening and integrity checks. The approved P02 instruction was reused byte for byte. Successful decoding and browser playback do not establish correct pronunciation. No human listening result is claimed yet.

## Content contract

- Data: [animals.json](../src/content/english/level-1/animals.json), format version 1. The module, level, lesson and word IDs are persistent identifiers; keep them when reordering or correcting text. A word ID is independent of its lesson position. Materially changing the learning concept needs a new ID. Asset paths include content hashes so replacement files cannot inherit stale audio from P03's cache. Resolve paths relative to Vite's `BASE_URL`, retaining `/kumacz/` on Pages.
- The seven words are in the **Pre A1 Starters Animals** column of the official [Cambridge English thematic wordlist](https://www.cambridgeenglish.org/images/149679-yle-starters-word-list.pdf), printed page 38. Polish translations are prepared for Kumacz. No Cambridge illustrations or exercises are copied.
- `exerciseTypes` currently lists only `flashcard` (F-08) and `listen-and-tap` (F-09), matching the P09 pilot. The English/Polish audio objects match P03's `AudioClip` shape. `instructions` supplies the reusable Polish F-09 prompt. P08 owns the remaining flashcard UI text and its audio; written/context tasks are P17/P18.
- Each target has two curated `distractorIds`, giving three distinct pictures (F-09 permits 3–4). All options are from this lesson. `confusablePairs` conservatively excludes cat/dog and cow/horse **anywhere in the full option set**, including between distractors (F-40). These are content curation choices, not a general animal-similarity algorithm. P07 must vary answer placement; array order does not prescribe a correct-answer position.
- Show the Polish translation and its audio on the flashcard back and after checking an answer (F-39). The JSON carries material, not display timing. It does not change session composition, the maximum of three new words, grading, Leitner or lesson completion.
- Seven pinned Twemoji SVGs were rendered and visually inspected by Codex. The child's recognition of these pictures and comprehension of the prompt still need P10 observation. Do not expand the other lessons before that feedback (D-44).

## Provenance and generation

[pilot-animals-provenance.json](../tools/content/pilot-animals-provenance.json) records the vocabulary source, exact Twemoji revision/source paths/hashes, generation tool, model archives/input hashes, texts, voice settings, output hashes and reused prompt. The model-specific licence review from P02 applies to these same fixed educational voices. Preserve the [public notice](../public/assets/NOTICE.txt) and show “Nagranie syntetyczne” wherever the app exposes playback (F-45); P35 must retain the credits in About.

Use the isolated, hash-pinned [P02 preparation environment and model verification](../tools/audio/README.md). No models or WAV intermediates are shipped. From the repository root, regenerate candidates outside the repository:

```sh
.venv-audio/bin/python tools/audio/generate-fixtures.py "$KUMACZ_AUDIO_WORK/models" "$KUMACZ_AUDIO_WORK/generated-animals" --manifest tools/content/pilot-animals-provenance.json
```

The optional manifest leaves the original P02 command unchanged. Cori uses speaker 0, speed 1.0; Supertonic uses preset 0, speed 1.0, eight steps, language `pl`. Conversion is MP3, libmp3lame 64 kbit/s, mono 22,050 Hz, with synthetic metadata. Inference is local; output bytes may differ on regeneration. Listen before replacing a clip, then update its output metadata and the hash in its filename/reference together. Never overwrite an immutable asset path with different bytes.

The review-only MP3 was made by decoding the listed files to 22,050 Hz mono PCM, appending one second of silence after each clip, concatenating in the recorded sequence and encoding at 64 kbit/s. Its hash and sequence offsets are in the manifest. It lives under `docs/review`, outside Vite's `public` tree, and is not included in the learning data or app package.

## Checks and remaining acceptance

Automated data checks run with `npm test` (focus: `npm test -- tools/content/animals.test.ts`): complete word/translation/audio coverage, unique IDs, supported pilot types, same-lesson distractors, exclusions across all three choices, local paths and actual asset hashes. The tests validate the committed lesson; they are not a runtime content-import validator. Keep future content checks with the content preparation tools, outside the browser bundle.

Technical preparation also checks all SVGs as XML (only passive shape elements in these seven pinned files), every new MP3's full FFmpeg decode, format, duration and synthetic metadata. The complete learning asset set is about 150 kB, plus the existing P03 fixtures. These checks do not establish full offline readiness (P36).

Verified on 2026-11-09 with Node 24.19.0: `npm run check`, 19 Vitest tests and 9 existing Chromium browser tests passed. System Chromium 154 also decoded all 15 lesson MP3 references and loaded all seven SVGs from the production preview under `/kumacz/`. A deliberately invalid cat/dog choice set failed the data check; the original data was restored. A manifest with a changed model checksum was rejected before generation/output creation. All 14 source WAVs contain non-silent PCM without saturated 16-bit samples. These are technical results, not a listening or real-device acceptance result.

Before accepting P04: a human must listen to every new word/translation and record the result here or in STATUS. Then obtain explicit PR merge approval. The target-tablet Chrome check remains in P09, and children's content validation remains P10. No extra lessons are part of this PR.

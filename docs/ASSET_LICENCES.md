# Asset and voice licence review — P02

**Status (2026-11-07):** the product owner approved Cori and Supertonic 3 preset 0 (D-83) and a permanent "Nagranie syntetyczne" label on exercise screens (D-84, F-45). The text below is the original review.

**P04 refinements (2026-11-09):** [the animal pilot](PILOT_LESSON.md) includes seven unchanged SVGs from the pinned Twemoji revision and 15 clips using the approved voices. The owner rejected revision 1 Polish pronunciation; a native configuration bug silently selected English, so all eight Polish clips were regenerated with actual `pl`. They reported revision 2 much better. Revision 3 matches English levels, regenerates dog/horse with sentence punctuation and records the owner-approved clearer instruction. Model/preset choices and licence terms are unchanged. Exact sources/settings/output hashes, gains and review history are in [the pilot provenance](../tools/content/pilot-animals-provenance.json); [the public notice](../public/assets/NOTICE.txt) preserves attribution. Revision 3 listening is pending. The original P02 fixture remains historical playback evidence; its Polish-language claim below describes the intended setting and is superseded by the correction.

Reviewed on **2026-11-06** against D-48, D-49, D-57, D-80, D-82 and F-33. This is a proposal for the product owner's review. The two audio files are synthetic evaluation fixtures, not an approved lesson or a final voice choice. No PRD decision has been added.

## Recommendation

Use **Cori medium for British English** and **Supertonic 3 preset 0 for Polish instructions**, generated locally through the open-source sherpa-onnx tool, then converted from WAV to MP3. This keeps generation free and local, preserves one consistent voice per language, and provides documented terms for publishing the clips. Pronunciation, clarity and suitability for children still require listening and the planned target-device/pilot checks; successful decoding does not establish those qualities.

The alternative is to wait for an explicitly cleared or retrained Polish Piper voice. That would retain Piper voices for both languages but leaves the current Polish licence issue unresolved and delays the fixture work. Recommended: evaluate the supplied pair first. D-48 allows a local open-source generator such as Piper; changing the preparation tool does not add a runtime service or change the MP3/Web Audio decision.

## Twemoji graphics

- Source: [jdecked/twemoji v17.0.3](https://github.com/jdecked/twemoji/tree/b6b55fef1e8636b540a6d016a4729ca8cdf2e60b), commit `b6b55fef1e8636b540a6d016a4729ca8cdf2e60b`.
- Graphics: **CC BY 4.0**; the JavaScript code's MIT licence does not replace the graphics licence. See the pinned [licence](https://github.com/jdecked/twemoji/blob/b6b55fef1e8636b540a6d016a4729ca8cdf2e60b/LICENSE-GRAPHICS), [attribution guidance](https://github.com/jdecked/twemoji/blob/b6b55fef1e8636b540a6d016a4729ca8cdf2e60b/README.md#attribution-requirements), and the [preserved text](licences/Twemoji-CC-BY-4.0.txt).
- Copy the selected SVGs into the app in the content/UI stages, preserving source paths, revision, hashes and any modification notes. P02 does not select lesson illustrations or ship the entire set.
- Credit the creators and maintainers, link the source and licence, and state whether graphics were changed. F-33's About screen must carry this information. Keep the originating company's name within attribution only (D-82); do not import its logo.
- The licence permits adaptation and redistribution, including commercial use with its conditions. It does not establish that an emoji unambiguously represents a learning word; D-57 still applies in P04.

Proposed Polish About credit, once assets are included:

> Grafiki Twemoji: Twitter, Inc. i pozostali współautorzy; zestaw rozwijany przez jdecked/twemoji. Licencja CC BY 4.0. Źródło: https://github.com/jdecked/twemoji. Wybrane pliki SVG bez zmian.

Link CC BY 4.0 to `https://creativecommons.org/licenses/by/4.0/`. Replace the last sentence with the actual changes if an asset is edited; the credit is a template, not a claim that images have already shipped.

## English: Cori medium

- Exact voice: `en_GB-cori-medium`, one speaker, 22,050 Hz. The [voice card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/cori/medium/MODEL_CARD) identifies British English and training from scratch on LibriVox recordings, without a Lessac starting checkpoint.
- [The voice author, Bryce Beattie](https://brycebeattie.com/files/tts/), declares this model public domain and permits lawful use. This model-specific author statement supports the proposed generated clip; the catalogue's generic MIT label alone would not.
- Assessment: suitable for generating and publishing the new short vocabulary clip under the author's stated terms. This does not assert that every underlying book or recording is public domain in every country. Do not copy dataset recordings or book passages into Kumacz.
- Distribution used for generation: sherpa-onnx's [Cori model archive](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-en_GB-cori-medium.tar.bz2), verified against its release SHA-256. Its model/config/card hashes are in [provenance.json](../tools/audio/provenance.json). Do not assume repackaged ONNX bytes equal the original Hugging Face file.
- Suggested credit: `Angielski głos syntetyczny: Cori (Bryce Beattie), model udostępniony jako public domain; nagrania wygenerowane lokalnie.` Credit is retained for provenance even without a mandatory attribution condition.

## Polish: Supertonic 3, preset 0

- [Publisher's model card](https://huggingface.co/Supertone/supertonic-3) lists Polish and fixed voice presets. The fixture uses preset/speaker ID `0`, language `pl`, speed `1.0`, eight generation steps; it uses no custom voice service or reference recording.
- The [model licence](https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE) is **BigScience Open RAIL-M**, distinct from the sample code's MIT licence. It is an open-weight model with use restrictions, not an unrestricted open-source model.
- Sections 2–3 grant no-charge/royalty-free rights subject to the licence. Section 6 leaves rights in generated output unclaimed by the licensor, subject to the licence's conditions. The proposed ordinary learning instruction can be generated and published; do not describe the output as unconditionally CC0 or unrestricted.
- Attachment A(e) requires an express, understandable synthetic-content disclosure. The fixture is labelled in its README/notice and MP3 metadata. **Before playback is exposed in the app or pilot, show “Nagranie syntetyczne” with the audio context and retain the source/licence information in About.** Metadata alone is not the visible disclosure. The player stage must carry this requirement forward.
- The other use restrictions still apply to generation and subsequent output use. This review concerns the fixed educational clips; it does not approve a general synthesis service, model redistribution, voice cloning or training another model from its outputs.
- The upstream [source repository](https://github.com/supertone-oss-archive/supertonic) was archived in September 2026. Generation here uses the separately maintained, pinned sherpa-onnx runtime and a fixed downloaded model. The app ships MP3 files; no model or generator is included in its runtime.
- Distribution used: sherpa-onnx's [Supertonic 3 int8 archive dated 2026-05-11](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/sherpa-onnx-supertonic-3-tts-int8-2026-05-11.tar.bz2). The archive's small `LICENSE` file is the sample-code MIT licence; it must **not** be mistaken for the model's Open RAIL-M terms linked above.
- Proposed credit/disclosure: `Polskie nagrania są syntetyczne, wygenerowane lokalnie modelem Supertonic 3 (Supertone), preset 0. Model: BigScience Open RAIL-M. Źródło: https://huggingface.co/Supertone/supertonic-3.` No endorsement is implied.

## Piper candidates not cleared for public Kumacz clips

Dataset licences, model weights, starting checkpoints, generator code and generated output are separate questions. Fine-tuning does not by itself prove a particular legal outcome. The missing evidence below is a reason not to clear these candidates, not a conclusion that every generated clip is necessarily unlawful.

| Candidate | Source evidence | Assessment for this task |
|---|---|---|
| `en_GB-alan-medium` | [Card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/alan/medium/MODEL_CARD) points to Mycroft `apope_low`; its [LICENSE](https://github.com/MycroftAI/mimic3-voices/blob/master/voices/en_UK/apope_low/LICENSE) reserves all rights. The card also names Lessac as the starting voice. | No adequate redistribution grant established. Do not use. |
| `en_GB-alba-medium` | [Card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/alba/medium/MODEL_CARD) names a CC BY 4.0 dataset, but also a Lessac starting voice. | Dataset attribution alone does not resolve the base-model issue. |
| `pl_PL-gosia-medium` | [Card](https://huggingface.co/rhasspy/piper-voices/blob/main/pl/pl_PL/gosia/medium/MODEL_CARD) names CC0 data and a Lessac starting voice. [Dataset publisher](https://github.com/OHF-Voice/voice-datasets) confirms CC0 for its recordings. | CC0 for the new recordings does not settle the checkpoint/output question. |
| `pl_PL-darkman-medium` | [Card](https://huggingface.co/rhasspy/piper-voices/blob/main/pl/pl_PL/darkman/medium/MODEL_CARD) names CC0 data and a Lessac starting voice. | Same unresolved starting-checkpoint issue. |
| `pl_PL-bass-high` | [Card](https://huggingface.co/rhasspy/piper-voices/blob/main/pl/pl_PL/bass/high/MODEL_CARD) labels the model Apache 2.0 but also states fine-tuning from `en_US-lessac-high`. | The label does not resolve the stated training lineage. |
| `pl_PL-mls_6892-low` | [Card](https://huggingface.co/rhasspy/piper-voices/blob/main/pl/pl_PL/mls_6892/low/MODEL_CARD) names CC BY 4.0 MLS data and a Ryan-low starting voice. [Ryan-low's card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ryan/low/MODEL_CARD) names CC BY-NC-SA 4.0 data. | Do not treat this as an unrestricted alternative based only on MLS's licence. |

The [Lessac research licence](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html) limits use of the original materials to research and restricts redistribution. It does not explicitly settle all downstream model/output questions. In [Piper discussion #94](https://huggingface.co/rhasspy/piper-voices/discussions/94), maintainer Michael Hansen explicitly says the position is uncertain and describes plans to retrain from a CC BY base. No conclusive clearance for the reviewed Polish checkpoints was found there. Recheck an exact new checkpoint if one is published; a plan to retrain is not evidence that these files were retrained.

No audio from the uncleared candidates was generated or committed. No maintainer has been contacted on the owner's behalf.

## Generated fixtures and checks

Both files below are **synthetic evaluation recordings**:

| File | Text | MP3 properties |
|---|---|---|
| [en-GB-red.mp3](../public/assets/audio/fixtures/en-GB-red.mp3) | `Red.` | 22,050 Hz, mono, 64 kbit/s; about 1.20 s / 9.9 kB |
| [pl-PL-listen-and-choose.mp3](../public/assets/audio/fixtures/pl-PL-listen-and-choose.mp3) | `Posłuchaj i wybierz obrazek.` | 22,050 Hz, mono, 64 kbit/s; about 2.61 s / 21.2 kB |

The MP3s were generated only after the corresponding model-specific terms were reviewed. [The recipe](../tools/audio/README.md) and [provenance record](../tools/audio/provenance.json) pin the archives, model inputs, generator, text, settings and output hashes. Models, wheels and intermediate WAVs remain outside Git. The app's npm dependencies are unchanged.

Technical checks verify archive/input/output hashes, non-empty PCM without clipped samples, MP3 decoding, codec/rate/channels and script rejection of an incorrect model checksum. Generation ran from local files without network access. See the recipe for verification commands and limits. The player, Android playback, offline behaviour and human pronunciation review are not claimed as passed by these checks.

Before P03 uses the candidate clips in a visible flow: obtain the owner's voice choice, carry the synthetic disclosure into playback, then check the audio on the target tablet. If the owner prefers a different voice, repeat the model-specific review and regenerate the fixture before use. P04 still owns the pilot lesson and picture selection.

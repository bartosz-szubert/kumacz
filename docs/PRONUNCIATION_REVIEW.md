# Horse and elephant — pronunciation comparison

**Status (2026-11-09):** the owner accepted revision-3 **dog**, rejected **horse** (heard as “płoz”) and reported an unclear final **t** in **elephant**. These are review candidates, not selected lesson replacements. PR #18 stays draft.

**Nagrania syntetyczne.** [Play/download the comparison WAV](review/horse-elephant-comparison-1.wav) (about 11 seconds / 466 kB). Order: **horse 1, 2, 3; elephant 1, 2, 3**. On GitHub use the raw/download button and open the downloaded WAV if there is no player.

All six entries use the approved Cori medium English voice, speaker 0 and speed 1.0, with comparable measured active speech levels. The WAV contains decoded individual MP3s, with silence between them, **without another lossy encoding step**. This also checks whether the extra 64-kbit/s encode in the full revision-3 review affected clarity. The individual MP3 links below are the exact source bytes used for the comparison.

| Word | 1: existing individual file | 2: new punctuation, standard parameters | 3: new punctuation, reduced variation |
|---|---|---|---|
| horse | [MP3](../public/assets/audio/animals/en-GB-horse.7e542dfd9d4a.mp3) · 0.5 s | [MP3](review/pronunciation/horse-2.mp3) · 2.2 s | [MP3](review/pronunciation/horse-3.mp3) · 4.0 s |
| elephant | [MP3](../public/assets/audio/animals/en-GB-elephant.79226332db1e.mp3) · 5.7 s | [MP3](review/pronunciation/elephant-2.mp3) · 7.3 s | [MP3](review/pronunciation/elephant-3.mp3) · 8.9 s |

Check that horse is recognisable as that word and elephant has a distinct final consonant. If variant 1 is clear here, retain those exact lesson bytes and fix the full review export. Otherwise **start by evaluating variant 2**: it makes the smallest generation change while keeping Cori's standard parameters. Variant 3 separately tests zero acoustic/duration noise; it may alter naturalness. This is a technical recommendation, not a claim of better pronunciation without listening. Report the clearest number for each word, or that none is suitable; no candidate is accepted automatically.

## Generation and evidence

- Variant 2 synthesises `horse!` and `Elephant.` at the standard VITS noise values 0.667 / 0.8. Variant 3 uses those same texts with both noise values set to 0. The model, speaker and speed are identical. These controls are in the [pinned sherpa-onnx model configuration](https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/sherpa-onnx/csrc/offline-tts-vits-model-config.h).
- [The comparison provenance](../tools/content/pronunciation-comparison-provenance.json) pins model/input hashes, generator, settings, source/output levels, gains, clip hashes and sequence offsets. The preparation used the existing local hash-pinned generation environment; no model or WAV synthesis intermediate is committed.
- New clips are MP3, 64 kbit/s, mono 22,050 Hz, with synthetic metadata. Gain is applied before encoding, using the same −20.5 dBFS active-RMS reference as revision 3. No clipping, trim, time-stretch, added syllables or manual phoneme substitution is used.
- A relevant [upstream BOS/pad bug](https://github.com/k2-fsa/sherpa-onnx/issues/3721) is already fixed in the installed runtime's matching source: runtime commit `11afbd00` matches v1.13.8 (`11afbd009a7f8c08f4bcf2fc1b265d0df4670fbf`). No runtime upgrade or phonemizer patch was introduced on that hypothesis. Root cause of the perceived pronunciation is not established by the technical checks.
- Each source MP3 and the combined WAV were fully decoded, checked against their hashes and measured for peak/active level. These checks establish file integrity, not correct speech. Choose replacements only after listening, then update the lesson/provenance paths and review material together.

Cori medium: Bryce Beattie, model declared public domain by its [author](https://brycebeattie.com/files/tts/). The samples are generated educational words, not copied dataset recordings. Terms and credits: [asset review](ASSET_LICENCES.md).

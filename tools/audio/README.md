# P02 audio fixtures

P04 reuses this preparation pipeline with the optional `--manifest tools/content/pilot-animals-provenance.json` argument. The original command and fixtures remain unchanged. See [the pilot recipe and listening review](../../docs/PILOT_LESSON.md).

P08 uses `--manifest tools/content/flashcard-audio-provenance.json` for its new Polish flashcard instruction, with the same approved Supertonic 3 preset and corrected `pl` configuration. Its source/output hashes and measured constant gain are separate from the accepted P04 word recordings; no P04 clip is regenerated. The revised D-87 recording was accepted by the owner on 2026-11-12; retain its exact hash-named bytes.

**Language correction (2026-11-09):** the original Polish fixture and P04 revision 1 accidentally used Supertonic's default English language. In the pinned Python binding, changing `generation.extra["lang"]` modifies a dictionary copy. The fixed generator assigns the complete property, `generation.extra = {"lang": "pl"}`. All eight P04 Polish clips, including the instruction, were regenerated under fresh hashed paths for repeat listening. Original P02 bytes/hashes remain historical evidence, not approved Polish learning content; a current run of this corrected recipe intentionally will not reproduce that erroneous language setting. See the [correction record](../../docs/PILOT_LESSON.md#polish-pronunciation-correction--2026-11-09).

Run the language regression check in the optional pinned generation environment (no models or network needed):

```sh
.venv-audio/bin/python -m unittest discover -s tools/audio -p 'test_*.py'
```

The tests check the real native configuration readback for Polish words/instructions, the unchanged English settings and a real FFmpeg encoding/decoding comparison proving that a recorded 6 dB boost is applied without changing duration. It is separate from the app's npm tests, which do not install synthesis dependencies.

P04 revision 3 also records optional per-clip `synthesisText` (e.g. `Dog.` while display/fallback text stays `dog`) and `gainDb`. The generator applies fixed gain with FFmpeg's `volume` filter before MP3 encoding. With either field absent, the corresponding input/encoding behaviour is unchanged. These are reviewed content-preparation settings, not runtime controls. The pilot provenance records the actual source/encoded levels and target; remeasure the final decoded MP3 after regeneration and listen, rather than assuming an old gain is suitable for new inference output. Keep sample peaks below −3 dBFS; do not slow or trim short words to hide unclear consonants.

Optional preparation tooling, separate from the web app. The committed MP3s are synthetic evaluation clips; [the licence review](../../docs/ASSET_LICENCES.md) describes the proposed voices and disclosure requirements. No synthesis runs in the browser, no hosted generation service is used, and no models are committed.

P09 uses `--manifest tools/content/introduction-audio-provenance.json` for the introduction instruction, with the same approved preset and `pl` configuration. It has separate hashes and measured preparation gain; the owner accepted the recording unchanged on 2026-11-12.

## Reproduce the generation recipe

Verified environment: Linux x86_64, CPython 3.12.14, FFmpeg 7.1.5 with `libmp3lame`. `requirements.txt` pins binary wheels and SHA-256 hashes for this Python/platform combination. Other platforms need their own reviewed wheel hashes; do not disable hash checking or build arbitrary source packages to work around a mismatch.

Create an isolated environment from the repository root:

```sh
python3.12 -m venv .venv-audio
.venv-audio/bin/python -m pip install --only-binary=:all: --require-hashes -r tools/audio/requirements.txt
```

sherpa-onnx **1.13.8** is pinned because it supports both the bundled Piper phonemizer and Supertonic 3. Its 2.0 API removes the bundled Piper frontend; upgrading requires a separate phonemizer and another review, rather than silently changing the generated pronunciation. Sources: [VITS configuration in 1.13.8](https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/sherpa-onnx/csrc/offline-tts-vits-model-config.h), [2.0 phonemizer example](https://github.com/k2-fsa/sherpa-onnx/blob/v2.0.1/python-api-examples/test-offline-tts-piper-phonemize.py), and [Supertonic example in 1.13.8](https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/python-api-examples/supertonic-tts.py). The runtime includes third-party components, including the GPL eSpeak phonemizer; their software licences are separate from the voice/model/output terms. None of these binaries is shipped with Kumacz.

Download only the two reviewed archives listed in `provenance.json`. This command uses the sherpa-onnx project's published GitHub release packages and validates each archive **before** extracting it. These are repackaged model distributions, not an assertion that their ONNX bytes match the original publisher's files. Keep proxy and TLS verification enabled.

```sh
KUMACZ_AUDIO_WORK=$(mktemp -d)
python3 - "$KUMACZ_AUDIO_WORK" <<'PY'
import hashlib
import json
from pathlib import Path
import sys
import tarfile
import urllib.request

root = Path(sys.argv[1])
data = json.loads(Path('tools/audio/provenance.json').read_text())
for model in data['models']:
    archive = root / (model['id'] + '.tar.bz2')
    with urllib.request.urlopen(model['download'], timeout=60) as response:
        with archive.open('wb') as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
    if hashlib.sha256(archive.read_bytes()).hexdigest() != model['archiveSha256']:
        raise ValueError('Archive checksum mismatch: ' + model['id'])
    with tarfile.open(archive) as contents:
        contents.extractall(root / 'models', filter='data')
PY
```

The archives total about 196 MB; they are preparation inputs, not an app download. Review `provenance.json` and the licence sources before using a changed archive or voice. The Supertonic package's MIT `LICENSE` concerns sample code; its weights remain under the publisher's Open RAIL-M licence.

Now disconnect the network if desired. Generation reads only local inputs and has no download code:

```sh
.venv-audio/bin/python tools/audio/generate-fixtures.py "$KUMACZ_AUDIO_WORK/models" "$KUMACZ_AUDIO_WORK/generated"
```

This writes one PCM WAV and one MP3 for each fixture in `provenance.json`. The script checks the recorded top-level model, configuration, token and style file hashes before loading the models; the archive hash also covers the bundled phonemizer resources. It uses CPU inference, the recorded text and voice settings, and FFmpeg's `libmp3lame` at 64 kbit/s, mono, 22,050 Hz. The MP3 metadata also identifies the clips as synthetic. Do not overwrite the committed samples until their sound and provenance have been reviewed.

The recipe reproduces the process, not guaranteed bit-identical inference output across runs/platforms. Provenance hashes identify the **actual committed recording**; record new output hashes after an approved regeneration. Keep WAV intermediates, models, wheels and environments outside commits.

## Verify committed recordings

```sh
python3 - <<'PY'
import hashlib
import json
from pathlib import Path
import subprocess

data = json.loads(Path('tools/audio/provenance.json').read_text())
for clip in data['fixtures']:
    path = Path(clip['path'])
    assert hashlib.sha256(path.read_bytes()).hexdigest() == clip['mp3Sha256']
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(path), '-f', 'null', '-'], check=True)
    print(path, 'checksum and decoding passed')
PY
```

P02 checks passed for both files: archive/input/output checksums, non-empty PCM without clipped samples, complete FFmpeg decoding, and MP3 rate/channel/codec inspection. A negative check with a modified expected model checksum was refused before generation or output creation. The dependency installation was repeated from the downloaded wheels with `--no-index --only-binary=:all: --require-hashes`. All synthesis ran locally without network permission.

There are no application behaviour tests added in P02. These are data/tool checks. They do not establish correct pronunciation, child comprehension, real-device playback or offline readiness; those require listening, P03 and the later pilot. Before any app/pilot playback of Supertonic output, display **“Nagranie syntetyczne”** in the audio context as required by its model licence; see the fixture `NOTICE.txt` and carry the credits into F-33.

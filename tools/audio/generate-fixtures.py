"""Generate synthetic clips from a reviewed manifest locally; no downloads.

API sources (sherpa-onnx v1.13.8):
https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/python-api-examples/offline-tts.py
https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/python-api-examples/supertonic-tts.py
"""

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import wave

import numpy as np
import sherpa_onnx


def make_generation_config(fixture):
    generation = sherpa_onnx.GenerationConfig()
    generation.sid = fixture["speakerId"]
    generation.speed = fixture["speed"]
    if fixture["model"] == "supertonic-3-int8":
        generation.num_steps = fixture["steps"]
        # The pybind getter returns a dict copy; item mutation silently loses lang.
        generation.extra = {"lang": "pl"}
    return generation


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("models", type=Path, help="Directory of extracted model archives")
    parser.add_argument("output", type=Path, help="Directory for generated WAV and MP3 clips")
    parser.add_argument(
        "--manifest", type=Path, default=Path(__file__).with_name("provenance.json"),
        help="Reviewed generation manifest (defaults to the P02 fixtures)",
    )
    args = parser.parse_args()
    provenance = json.loads(args.manifest.read_text(encoding="utf-8"))
    if sherpa_onnx.__version__ != provenance["generator"]["version"]:
        raise ValueError("Use the pinned generation environment in requirements.txt")

    # Refuse unreviewed model/config/token/style files before loading native models.
    for model in provenance["models"]:
        for name, expected in model["files"].items():
            actual = hashlib.sha256((args.models / model["directory"] / name).read_bytes())
            if actual.hexdigest() != expected:
                raise ValueError(f"Model input checksum mismatch: {name}")

    args.output.mkdir(parents=True, exist_ok=True)
    for fixture in provenance["fixtures"]:
        model = next(m for m in provenance["models"] if m["id"] == fixture["model"])
        root = args.models / model["directory"]
        if model["id"] == "cori-medium":
            voice = sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=str(root / "en_GB-cori-medium.onnx"),
                    tokens=str(root / "tokens.txt"),
                    data_dir=str(root / "espeak-ng-data"),
                ),
                num_threads=1,
                provider="cpu",
            )
        elif model["id"] == "supertonic-3-int8":
            voice = sherpa_onnx.OfflineTtsModelConfig(
                supertonic=sherpa_onnx.OfflineTtsSupertonicModelConfig(
                    duration_predictor=str(root / "duration_predictor.int8.onnx"),
                    text_encoder=str(root / "text_encoder.int8.onnx"),
                    vector_estimator=str(root / "vector_estimator.int8.onnx"),
                    vocoder=str(root / "vocoder.int8.onnx"),
                    tts_json=str(root / "tts.json"),
                    unicode_indexer=str(root / "unicode_indexer.bin"),
                    voice_style=str(root / "voice.bin"),
                ),
                num_threads=1,
                provider="cpu",
            )
        else:
            raise ValueError(f"Unreviewed generator configuration: {model['id']}")
        config = sherpa_onnx.OfflineTtsConfig(model=voice)
        if not config.validate():
            raise ValueError("Invalid generation configuration")
        tts = sherpa_onnx.OfflineTts(config)
        generation = make_generation_config(fixture)
        audio = tts.generate(fixture["text"], generation)
        if not len(audio.samples):
            raise ValueError("The generator returned empty audio")
        wav_path = args.output / (fixture["id"] + ".wav")
        mp3_path = args.output / (fixture["id"] + ".mp3")
        samples = (np.clip(audio.samples, -1, 1) * 32767).astype("<i2")
        with wave.open(str(wav_path), "wb") as wav:
            wav.setparams((1, 2, audio.sample_rate, 0, "NONE", "not compressed"))
            wav.writeframes(samples.tobytes())
        subprocess.run(
            ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", str(wav_path),
             "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "22050", "-ac", "1",
             "-map_metadata", "-1", "-metadata", "comment=Nagranie syntetyczne.",
             str(mp3_path)],
            check=True,
        )
        print(f"Generated synthetic evaluation clip: {mp3_path}")
        del tts


if __name__ == "__main__":
    main()

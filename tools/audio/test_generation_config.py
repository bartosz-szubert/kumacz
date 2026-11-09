"""Regression checks with the pinned native binding and FFmpeg; no models needed."""

import array
import math
import subprocess
import tempfile
import unittest
from pathlib import Path
import runpy
import wave

recipe = runpy.run_path(
    str(Path(__file__).with_name("generate-fixtures.py"))
)
make_generation_config = recipe["make_generation_config"]
encode_mp3 = recipe["encode_mp3"]


class GenerationConfigTests(unittest.TestCase):
    def test_polish_language_reaches_the_native_binding_for_words_and_instructions(self):
        for text in ("ryba", "żaba", "Posłuchaj słowa i wybierz pasujący obrazek."):
            with self.subTest(text=text):
                config = make_generation_config({
                    "model": "supertonic-3-int8", "language": "pl-PL", "text": text,
                    "speakerId": 0, "speed": 1.0, "steps": 8,
                })
                self.assertEqual(dict(config.extra), {"lang": "pl"})
                self.assertEqual(config.sid, 0)
                self.assertEqual(config.speed, 1.0)
                self.assertEqual(config.num_steps, 8)

    def test_english_piper_configuration_stays_unchanged(self):
        config = make_generation_config({
            "model": "cori-medium", "language": "en-GB", "text": "fish",
            "speakerId": 0, "speed": 1.0,
        })
        self.assertEqual(dict(config.extra), {})
        self.assertEqual(config.sid, 0)
        self.assertEqual(config.speed, 1.0)

    def test_recorded_gain_increases_encoded_audio_without_changing_duration(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "tone.wav"
            samples = array.array("h", (
                int(2000 * math.sin(2 * math.pi * 440 * index / 22050))
                for index in range(22050)
            ))
            with wave.open(str(source), "wb") as wav:
                wav.setparams((1, 2, 22050, 0, "NONE", "not compressed"))
                wav.writeframes(samples.tobytes())
            decoded = []
            for gain in (0, 6):
                target = root / f"gain-{gain}.mp3"
                encode_mp3(source, target, gain)
                pcm = array.array("f", subprocess.check_output([
                    "ffmpeg", "-nostdin", "-v", "error", "-i", str(target),
                    "-f", "f32le", "-ar", "22050", "-ac", "1", "-",
                ]))
                decoded.append(pcm)
                self.assertLess(max(abs(sample) for sample in pcm), 1)
            self.assertEqual(len(decoded[0]), len(decoded[1]))
            rms = [math.sqrt(sum(s*s for s in pcm)/len(pcm)) for pcm in decoded]
            self.assertAlmostEqual(20*math.log10(rms[1]/rms[0]), 6, delta=0.2)


if __name__ == "__main__":
    unittest.main()

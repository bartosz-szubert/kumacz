"""Regression checks against the real pinned sherpa-onnx binding; no models needed."""

import unittest
from pathlib import Path
import runpy

make_generation_config = runpy.run_path(
    str(Path(__file__).with_name("generate-fixtures.py"))
)["make_generation_config"]


class GenerationConfigTests(unittest.TestCase):
    def test_polish_language_reaches_the_native_binding_for_words_and_instructions(self):
        for text in ("ryba", "żaba", "Posłuchaj i wybierz obrazek."):
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


if __name__ == "__main__":
    unittest.main()

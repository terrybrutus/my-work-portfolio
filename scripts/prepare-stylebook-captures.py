"""Crop only the app's observed 16:9 frame from the requested native captures."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
source = root / "outputs/stylebook-20261025"
destination = source / "frames"
destination.mkdir(parents=True, exist_ok=True)
for name in ("stylebook-calendar", "stylebook-clients", "stylebook-profile", "stylebook-services"):
    with Image.open(source / f"{name}.png") as image:
        image.crop((169, 122, 1737, 1004)).convert("RGB").save(destination / f"{name}.png")
        print(f"{name}: 1568x882, no resizing")

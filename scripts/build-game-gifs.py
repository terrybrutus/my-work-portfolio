"""Encode real browser captures without reducing their source resolution."""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("capture_dir", type=Path)
parser.add_argument("output_dir", type=Path)
parser.add_argument("--only", nargs="+", default=["common-thread", "worduel"])
args = parser.parse_args()
args.output_dir.mkdir(parents=True, exist_ok=True)

sequences = {
    "common-thread-wide": [("board", 2200), ("selected", 1600), ("reveal", 3500)],
    "common-thread": [("common-public-board", 2200), ("common-public-one", 700), ("common-public-selected", 1400), ("common-public-reveal", 3500)],
    "worduel": [("worduel-question", 2600), ("worduel-answer", 3000), ("worduel-saved", 2200), ("worduel-next", 2600)],
}
for name, sequence in sequences.items():
    if name not in args.only:
        continue
    sources = [Image.open(args.capture_dir / f"{frame}.jpg").convert("RGB") for frame, _ in sequence]
    width, height = max(image.width for image in sources), max(image.height for image in sources)
    frames = []
    for source in sources:
        canvas = Image.new("RGB", (width, height), source.getpixel((0, 0)))
        canvas.paste(source, (0, 0))
        frames.append(canvas.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE))
    destination = args.output_dir / f"{name}.gif"
    frames[0].save(destination, save_all=True, append_images=frames[1:], duration=[duration for _, duration in sequence], loop=0, optimize=False, disposal=2)
    print(f"{destination.name}: {width}x{height}, {len(frames)} frames, {destination.stat().st_size:,} bytes")

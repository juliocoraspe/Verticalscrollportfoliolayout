from pathlib import Path

import pdfplumber
from PIL import Image, ImageFilter


SOURCE_PDF = Path(
    "/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/"
    "My Drive/BeReal Externship/project 1/BeReal — Research Analysis.pdf"
)
SOURCE_RENDER = Path("tmp/pdfs/real-life-research-preview.png")
OUTPUT_IMAGE = Path("src/assets/images/RealLife_research-analysis-redacted.jpg")
OUTPUT_PDF = Path("src/assets/documents/RealLife_research-analysis-redacted.pdf")


with pdfplumber.open(SOURCE_PDF) as document:
    page = document.pages[0]
    words = [word for word in page.extract_words() if "bereal" in word["text"].lower()]
    page_width = float(page.width)
    page_height = float(page.height)

image = Image.open(SOURCE_RENDER).convert("RGB")
scale_x = image.width / page_width
scale_y = image.height / page_height

for word in words:
    pad_x = 10
    pad_y = 7
    left = max(0, int(word["x0"] * scale_x) - pad_x)
    top = max(0, int(word["top"] * scale_y) - pad_y)
    right = min(image.width, int(word["x1"] * scale_x) + pad_x)
    bottom = min(image.height, int(word["bottom"] * scale_y) + pad_y)
    crop = image.crop((left, top, right, bottom))
    crop = crop.filter(ImageFilter.GaussianBlur(radius=9))
    image.paste(crop, (left, top))

OUTPUT_IMAGE.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT_IMAGE, "JPEG", quality=91, optimize=True, progressive=True)
image.save(OUTPUT_PDF, "PDF", resolution=120.0, quality=91)

print(f"Blurred {len(words)} company-name occurrences")
print(f"Saved {OUTPUT_IMAGE}")
print(f"Saved {OUTPUT_PDF}")

from pathlib import Path

import fitz


ROOT = Path(
    "/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-"
    "juliocoraspe@gmail.com/My Drive/BeReal Externship"
)
OUT = Path("/Users/juliocoraspe/Desktop/UX UI Portfolio/tmp/real-life-context/rendered/pdfs")
FILES = {
    "research-analysis": ROOT / "project 1/BeReal — Research Analysis.pdf",
    "problem-opportunity": ROOT / "project 1/BeReal — PM Problem Statement & Opportunity Note.pdf",
    "rice-analysis": ROOT / "project 3/BeReal_RICE_Analysis_Real_Life_Challenges.pdf",
    "feature-proposal": ROOT / "project 3/Real-Life Challenges — BeReal Feature Proposal.pdf",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, source in FILES.items():
        document = fitz.open(source)
        for page_index, page in enumerate(document):
            rect = page.rect
            target_width = 1800
            scale = min(2.0, target_width / rect.width)
            pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            pixmap.save(OUT / f"{slug}-page-{page_index + 1}.png")


if __name__ == "__main__":
    main()

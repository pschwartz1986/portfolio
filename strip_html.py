from pathlib import Path

base = Path(__file__).parent

pages = [
    "index.html",
    "anschreiben.html",
    "kurzprofil.html",
    "lebenslauf.html",
    "portfolio.html",
]


def make_stub(original_html: str, filename: str) -> str:
    pc_marker = '<div id="portfolio-content"'
    pc_start = original_html.find(pc_marker)
    if pc_start == -1:
        raise ValueError("portfolio-content not found")

    before_pc = original_html[:pc_start].rstrip()

    scripts = """  <script src="assets/bootstrap/bootstrap.bundle.min.js"></script>
  <script src="assets/js/crypto.js"></script>
  <script src="assets/js/encrypted-data.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>"""

    return before_pc + '\n  <div id="portfolio-content" style="display:none;"></div>\n' + scripts


if __name__ == "__main__":
    for page in pages:
        path = base / page
        html = path.read_text(encoding="utf-8")
        stub = make_stub(html, page)
        path.write_text(stub, encoding="utf-8")
        print(f"Stripped {page} -> {len(stub)} chars")

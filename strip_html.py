from pathlib import Path

base = Path(__file__).parent

pages = [
    "index.html",
    "anschreiben.html",
    "kurzprofil.html",
    "lebenslauf.html",
    "portfolio.html",
]


def extract_login_block(html: str) -> str:
    login_start = html.find('<div id="login-screen"')
    if login_start == -1:
        raise ValueError("login-screen not found")
    gt = html.find(">", login_start)
    if gt == -1:
        raise ValueError("login-screen tag not closed")
    pos = gt + 1
    depth = 1
    while pos < len(html) and depth > 0:
        next_open = html.find("<div", pos)
        next_close = html.find("</div>", pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                return html[login_start : next_close + 6]
            pos = next_close + 6
    raise ValueError("No matching closing tag for login-screen")


def make_stub(original_html: str, filename: str) -> str:
    login_block = extract_login_block(original_html)
    head_end = original_html.lower().find("</head>")
    if head_end == -1:
        raise ValueError("No </head> found")
    head_part = original_html[: head_end + 7]
    extra_newline = ""
    if not head_part.endswith("\n"):
        extra_newline = "\n"
    body_start = original_html.lower().find("<body")
    body_close = original_html.find(">", body_start)
    if body_start == -1 or body_close == -1:
        raise ValueError("No <body> found")
    body_open = original_html[body_start : body_close + 1]
    scripts = """\
  <script src="assets/bootstrap/bootstrap.bundle.min.js"></script>
  <script src="assets/js/crypto.js"></script>
  <script src="assets/js/encrypted-data.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>"""
    return (
        head_part
        + extra_newline
        + body_open
        + "\n"
        + login_block
        + '\n  <div id="portfolio-content" style="display:none;"></div>\n'
        + scripts
    )


if __name__ == "__main__":
    for page in pages:
        path = base / page
        html = path.read_text(encoding="utf-8")
        stub = make_stub(html, page)
        path.write_text(stub, encoding="utf-8")
        print(f"Stripped {page} -> {len(stub)} chars")

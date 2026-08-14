"""Recolector responsable: nunca evade CAPTCHA; pausa para resolución humana."""
import argparse
import csv
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


def robots_allows(url: str) -> bool:
    parsed = urlparse(url)
    robots = RobotFileParser(f"{parsed.scheme}://{parsed.netloc}/robots.txt")
    try:
        robots.read()
        return robots.can_fetch("NexoLabAcademicBot/1.0", url)
    except Exception:
        return False  # Ante la duda, no recolectar automáticamente.


def collect(url: str, item_selector: str, output: Path):
    if not robots_allows(url):
        raise SystemExit("robots.txt no autoriza o no pudo verificarse. Use una API oficial o solicite permiso.")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page(user_agent="NexoLabAcademicBot/1.0 (contacto: equipo-proyecto)")
        page.goto(url, wait_until="domcontentloaded")
        if page.locator("iframe[src*='captcha'], .g-recaptcha, [id*='captcha']").count():
            input("CAPTCHA detectado. Resuélvalo manualmente en el navegador y presione Enter para continuar…")
        time.sleep(2)
        soup = BeautifulSoup(page.content(), "html.parser")
        rows = [{"texto": node.get_text(" ", strip=True), "fuente": url} for node in soup.select(item_selector)]
        browser.close()
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=["texto", "fuente"])
        writer.writeheader(); writer.writerows(rows)
    print(f"{len(rows)} registros guardados en {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--selector", required=True)
    parser.add_argument("--output", type=Path, default=Path("data/raw/scraped.csv"))
    args = parser.parse_args()
    collect(args.url, args.selector, args.output)

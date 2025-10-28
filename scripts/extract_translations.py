import os
import json
import xml.etree.ElementTree as ET

LANGDIR = "./EXTRACTED/language"
PREFIX = "english"
OUTPUT = "translations.json"

translations = {}

def get_value(prop):
    """Extracts text from either <Property value=""> or inner text."""
    if prop is None:
        return ""
    # Support attributes
    if "value" in prop.attrib:
        return prop.attrib.get("value", "")
    # Support inner text
    if prop.text:
        return prop.text.strip()
    return ""

for fname in os.listdir(LANGDIR):
    if PREFIX.lower() in fname.lower() and fname.lower().endswith(".mxml"):
        path = os.path.join(LANGDIR, fname)
        try:
            tree = ET.parse(path)
            root = tree.getroot()

            # Matches both your structure and other NMS localisation formats
            # //Data/Property[@name='Table']/Property[@name='Table']
            entries = root.findall(".//Property[@name='Table']/Property[@name='Table']")
            if not entries:
                # Try alternate structure used in other versions:
                entries = root.findall(".//Property[@name='Table']")

            for entry in entries:
                key = entry.get("_id")
                if not key:
                    continue

                eng = entry.find("Property[@name='English']")
                us_eng = entry.find("Property[@name='USEnglish']")

                value = get_value(eng)
                if not value and us_eng is not None:
                    value = get_value(us_eng)

                translations[key] = value

        except ET.ParseError:
            print(f"Skipping malformed XML: {fname}")

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(translations, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(translations)} entries to {OUTPUT}")
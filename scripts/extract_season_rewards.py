import xml.etree.ElementTree as ET
import json
import re

xml_path = "./unlockableseasonrewards.MXML"
mapping_path = "./item_to_name_mappings.json"
output_path = "./season_rewards.json"

# Load product name mapping
with open(mapping_path, "r", encoding="utf-8") as f:
    name_map = json.load(f)

tree = ET.parse(xml_path)
root = tree.getroot()

results = []

for entry in root.findall(".//Property[@name='Table'][@value='GcUnlockableSeasonReward']"):
    entry_id = None
    expedition = None

    # Traverse properties
    for prop in entry.findall("Property"):
        # ID field
        if prop.get("name") == "ID":
            entry_id = prop.get("value")

        # SeasonIds nested property
        if prop.get("name") == "SeasonIds":
            season_prop = prop.find("Property")
            if season_prop is not None:
                season_value = season_prop.get("value")
                if season_value and season_value.isdigit():
                    expedition = int(season_value)

    if entry_id is None:
        continue

    # Resolve name from mapping (fallback: reuse ID)
    name = name_map.get(entry_id, entry_id)

    results.append({
        "name": name,
        "id": f"^{entry_id}",
        "expedition": expedition if expedition is not None else 0
    })

# Output JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Saved {len(results)} entries to {output_path}")


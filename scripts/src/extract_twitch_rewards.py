import xml.etree.ElementTree as ET
import json

xml_path = "./out/unlockabletwitchrewards.MXML"
mapping_path = "./out/item_to_name_mappings.json"
output_path = "./out/twitch_rewards.json"

# Load product id --> localized name mapping
with open(mapping_path, "r", encoding="utf-8") as f:
    name_map = json.load(f)

tree = ET.parse(xml_path)
root = tree.getroot()

rewards = []

# Locate entries in the unlockable twitch rewards table
for reward in root.findall(".//Property[@name='Table'][@value='GcUnlockableTwitchReward']"):
    twitch_id = None
    product_id = None

    for prop in reward.findall("Property"):
        if prop.get("name") == "TwitchId":
            twitch_id = prop.get("value")
        if prop.get("name") == "ProductId":
            product_id = prop.get("value")

    if twitch_id and product_id:
        display_name = name_map.get(product_id, product_id)
        rewards.append({
            "id": f"^{twitch_id}",
            "name": display_name
        })

# Write output JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(rewards, f, indent=2, ensure_ascii=False)

print(f"Saved {len(rewards)} entries to {output_path}")

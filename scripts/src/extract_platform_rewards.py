import xml.etree.ElementTree as ET
import json

platform_rewards_xml = "./out/unlockableplatformrewards.MXML"
product_mapping_json = "./out/item_to_name_mappings.json"
output_json = "./out/platform_rewards.json"

# Load ID --> translated product name mapping
with open(product_mapping_json, "r", encoding="utf-8") as f:
    product_names = json.load(f)

# Heuristic platform classification rules
# Extend this dict if Hello Games adds more platform identifiers
PLATFORM_LOOKUP = {
    "TGA": "PC",
    "SW": "Switch",
}

def detect_platform(product_id: str) -> str:
    upper = product_id.upper()
    for key, platform in PLATFORM_LOOKUP.items():
        if upper.startswith(key):
            return platform
    return "Unknown"

tree = ET.parse(platform_rewards_xml)
root = tree.getroot()

rewards_list = []

for node in root.findall(".//Property[@value='GcUnlockablePlatformReward']"):
    reward_id = None
    product_id = None

    for prop in node.findall("Property"):
        if prop.get("name") == "RewardId":
            reward_id = prop.get("value")
        if prop.get("name") == "ProductId":
            product_id = prop.get("value")

    if reward_id and product_id:
        display_name = product_names.get(product_id, product_id)
        platform = detect_platform(product_id)

        rewards_list.append({
            "id": f"^{reward_id}",
            "name": display_name,
            "platform": platform
        })

# Save JSON
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(rewards_list, f, indent=2, ensure_ascii=False)

print(f"Saved {len(rewards_list)} platform rewards to {output_json}")

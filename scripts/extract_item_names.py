import xml.etree.ElementTree as ET
import json

xml_paths = [
    "./nms_reality_gcproducttable.MXML",
    "./nms_basepartproducts.MXML"
]
translations_path = "./translations.json"
output_json = "item_to_name_mappings.json"

# Load translation strings
with open(translations_path, "r", encoding="utf-8") as f:
    translations = json.load(f)

mapping = {}

def process_xml(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    # Find all product entries
    for product in root.findall(".//Property[@name='Table'][@value='GcProductData']"):
        prod_id = None
        name_lower_key = None

        for prop in product.findall("Property"):
            if prop.get("name") == "ID":
                prod_id = prop.get("value")
            if prop.get("name") == "NameLower":
                name_lower_key = prop.get("value")

        if prod_id and name_lower_key:
            translated_value = translations.get(name_lower_key, name_lower_key)
            mapping[prod_id] = translated_value

# Process both XMLs
for path in xml_paths:
    process_xml(path)

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(mapping, f, indent=4, ensure_ascii=False)

print(f"Saved {len(mapping)} combined entries to {output_json}")

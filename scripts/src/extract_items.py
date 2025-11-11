import xml.etree.ElementTree as ET
import json
import os
from PIL import Image

xml_paths = [
    "./out/nms_reality_gcproducttable.MXML",
    "./out/nms_basepartproducts.MXML",
    "./out/nms_reality_gcsubstancetable.MXML",
    "./out/nms_reality_gctechnologytable.MXML",
    "./out/nms_reality_gcproceduraltechnologytable.MXML",
    "./out/proceduralproducttable.MXML"
]
translations_path = "./out/translations.json"
output_json = "./out/items.json"

# Load translation strings
with open(translations_path, "r", encoding="utf-8") as f:
    translations = json.load(f)

items = {}

def remove_text_tags(text):
    if not text:
        return text
    # Loop through and remove everything in <> and the <> themselves
    while True:
        start = text.find("<")
        end = text.find(">")
        if start == -1 or end == -1:
            break
        text = text[:start] + text[end+1:]
    return text.strip()

def process_xml(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    products = root.findall(".//Property[@value='GcProductData']")
    if(len(products) == 0):
        products = root.findall(".//Property[@value='GcRealitySubstanceData']")
    if(len(products) == 0):
        products = root.findall(".//Property[@value='GcProceduralTechnologyData']")
    if(len(products) == 0):
        products = root.findall(".//Property[@value='GcTechnology']")

    print(len(products), "items found in", xml_path)

    for product in products:
        prod_id = None
        name_lower_key = None
        description_key = None
        texture_path = None

        for prop in product.findall("Property"):
            if prop.get("name") == "ID":
                prod_id = prop.get("value")
            if prop.get("name") == "Subtitle" and "proceduralproducttable.MXML" in xml_path:
                name_lower_key = prop.get("value")
            if prop.get("name") == "NameLower":
                name_lower_key = prop.get("value")
            if prop.get("name") == "Description":
                description_key = prop.get("value")
            if prop.get("name") == "Template":
                template_value = prop.get("value")
                if template_value in items:
                    texture_path = items[template_value]["texture"]
            if prop.get("name") == "Icon":
                icon_prop = prop.find("Property[@name='Filename']")
                if icon_prop is not None:
                    texture_path = icon_prop.get("value").lower()
                    if texture_path.startswith("textures/"):
                        real_path = os.path.abspath(os.path.join(__file__, "../../out/EXTRACTED/", texture_path))
                        target_path = os.path.abspath(os.path.join(__file__, "../../../static/nms/", texture_path))
                        texture_path = "/nms/" + texture_path.replace(".dds", ".png")
                        if "textures/ui/frontend/icons" in texture_path:
                            if os.path.exists(real_path):
                                if not os.path.exists(os.path.dirname(target_path)): 
                                    os.makedirs(os.path.dirname(target_path), exist_ok=True)
                                img = Image.open(real_path)
                                img = img.resize((64, 64))
                                img.save(target_path.replace(".dds", ".png"))
                            else:
                                texture_path = None
                        else:
                            texture_path = None


        if prod_id and name_lower_key:
            translated_value = translations.get(name_lower_key, name_lower_key)
            description_value = translations.get(description_key, description_key) if description_key else None

            items[prod_id] = {
                "name": translated_value,
                "description": remove_text_tags(description_value),
                "texture": texture_path
            }

for path in xml_paths:
    process_xml(path)

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(items, f, indent=4, ensure_ascii=False)

print(f"Saved {len(items)} combined entries to {output_json}")

from PIL import Image
import os

x128 = [
  #"textures/ui/frontend/icons/expedition/patch.expedition.1.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.2.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.3.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.4.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.5.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.6.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.7.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.8.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.9.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.10.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.11.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.12.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.13.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.14.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.15.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.16.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.17.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.18.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.19.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.20.dds",
  #"textures/ui/frontend/icons/expedition/patch.expedition.21.dds",
]

x24 = [
  "textures/ui/frontend/icons/currency.nanites.dds",
  "textures/ui/frontend/icons/currency.quicksilver.dds",
  "textures/ui/frontend/icons/currency.units.dds"
]


def resize(pt, s):
  real_path = os.path.abspath(os.path.join(__file__, "../../out/EXTRACTED/", pt))
  target_path = os.path.abspath(os.path.join(__file__, "../../../static/nms/", pt))
  if os.path.exists(real_path):
    if not os.path.exists(os.path.dirname(target_path)): 
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
    img = Image.open(real_path)
    img = img.resize((s, s))
    img.save(target_path.replace(".dds", ".png"))
  else:
    print(f"⚠️  Missing asset: {pt}")


for asset in x24:
  resize(asset, 24)
  
for asset in x128:
  resize(asset, 128)
  
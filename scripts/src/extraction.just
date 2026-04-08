### Paks

NMSARC_MetadataEtc:
    @gum spin --spinner dot --title "Extracting NMSARC.MetadataEtc.pak" -- ./out/hgpaktool ./PCBANKS/NMSARC.MetadataEtc.pak -O ./out/EXTRACTED > /dev/null;

    @for f in ./out/EXTRACTED/language/*english*.mbin; do \
        gum spin --spinner dot --title "Converting $f" -- ./out/mbincompiler -y -d ./out/EXTRACTED/language/ "$f" > /dev/null; \
    done;

    @gum style --foreground 10 "✅ NMSARC.MetadataEtc.pak extracted."

NMSARC_Precache:
    @gum spin --spinner dot --title "Extracting NMSARC.Precache.pak" -- ./out/hgpaktool ./PCBANKS/NMSARC.Precache.pak -O ./out/EXTRACTED > /dev/null;

    @gum spin --spinner dot --title "Converting nms_reality_gcproducttable.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/nms_reality_gcproducttable.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting nms_basepartproducts.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/nms_basepartproducts.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting nms_reality_gcsubstancetable.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/nms_reality_gcsubstancetable.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting nms_reality_gctechnologytable.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/nms_reality_gctechnologytable.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting nms_reality_gcproceduraltechnologytable.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/nms_reality_gcproceduraltechnologytable.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting proceduralproducttable.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/proceduralproducttable.mbin" > /dev/null;
    
    @gum spin --spinner dot --title "Converting unlockableseasonrewards.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/unlockableseasonrewards.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting unlockabletwitchrewards.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/unlockabletwitchrewards.mbin" > /dev/null;
    @gum spin --spinner dot --title "Converting unlockableplatformrewards.mbin" -- ./out/mbincompiler -y -d ./out/ "./out/EXTRACTED/metadata/reality/tables/unlockableplatformrewards.mbin" > /dev/null;

    @gum style --foreground 10 "✅ NMSARC.Precache.pak extracted."

NMSARC_TexUI:
    @gum spin --spinner dot --title "Extracting NMSARC.TexUI.pak" -- ./out/hgpaktool ./PCBANKS/NMSARC.TexUI.pak -O ./out/EXTRACTED > /dev/null;
    @gum style --foreground 10 "✅ NMSARC.TexUI.pak extracted."

### Base data

extract-mappings:
    @gum spin --spinner dot --title "Downloading mapping.json..." -- curl -sSL "https://github.com/monkeyman192/MBINCompiler/releases/download/{{MBIN_COMPILER_VERSION}}/mapping.json" -o ./out/mapping.json
    @jq '.Mapping | map({(.Key): .Value}) | add' ./out/mapping.json > ../src/data/mapping.json
    @npx prettier --write ../src/data/mapping.json --config ../.prettierrc > /dev/null
    @gum style --foreground 10 "✅ mapping.json created."

extract-locale: NMSARC_MetadataEtc
    @gum spin --spinner dot --title "Extracting translations" -- python ./src/extract_translations.py
    @gum style --foreground 10 "✅ translations.json ready."

extract-item-name-mappings: extract-locale NMSARC_MetadataEtc NMSARC_Precache
    @gum spin --spinner dot --title "Extracting item names" -- python ./src/extract_item_names.py
    @gum style --foreground 10 "✅ item_to_name_mappings.json created."

extract-items: extract-locale NMSARC_MetadataEtc NMSARC_Precache
    @gum spin --spinner dot --title "Extracting items" -- python ./src/extract_items.py
    @cp ./out/items.json ../src/data/items.json
    @npx prettier --write ../src/data/items.json --config ../.prettierrc > /dev/null
    @gum style --foreground 10 "✅ items.json & item images created."

extract-textures: NMSARC_TexUI
    @gum spin --spinner dot --title "Extracting textures" -- python ./src/extract_textures.py
    @gum style --foreground 10 "✅ textures created."

### Rewards

extract-season-rewards: extract-item-name-mappings
    @gum spin --spinner dot --title "Extracting rewards" -- python ./src/extract_season_rewards.py
    @cp ./out/season_rewards.json ../src/data/rewards/season.json
    @npx prettier --write ../src/data/rewards/season.json --config ../.prettierrc > /dev/null
    @gum style --foreground 10 "✅ rewards/season.json created."

extract-twitch-rewards: extract-item-name-mappings
    @gum spin --spinner dot --title "Extracting rewards" -- python ./src/extract_twitch_rewards.py
    @cp ./out/twitch_rewards.json ../src/data/rewards/twitch.json
    @npx prettier --write ../src/data/rewards/twitch.json --config ../.prettierrc > /dev/null
    @gum style --foreground 10 "✅ rewards/twitch.json created."

extract-platform-rewards: extract-item-name-mappings
    @gum spin --spinner dot --title "Extracting rewards" -- python ./src/extract_platform_rewards.py
    @cp ./out/platform_rewards.json ../src/data/rewards/platform.json
    @npx prettier --write ../src/data/rewards/platform.json --config ../.prettierrc > /dev/null
    @gum style --foreground 10 "✅ rewards/platform.json created."

extract-all-rewards: extract-season-rewards extract-twitch-rewards extract-platform-rewards

extract-all: extract-mappings extract-all-rewards extract-textures extract-items
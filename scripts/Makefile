.PHONY: clean install-deps all mapping.json rewards translations.json item_to_name_mappings.json season_rewards.json twitch_rewards.json

VERSION := 6.12-BREACH-28.October.2025

all: clean install-deps mapping.json rewards

clean:
	rm -f ./season_rewards.json ./twitch_rewards.json ./item_to_name_mappings.json ./translations.json ./mapping.json
	rm -rf ./EXTRACTED
	rm -f ./MBINCompiler-linux
	rm -rf ./HGPAKtool
	rm -f ./*.log
	rm -f ./*.MXML

install-deps:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/download/v6.13.0-pre1/MBINCompiler-linux-dotnet6  -o ./MBINCompiler-linux
	git clone https://github.com/monkeyman192/HGPAKtool.git ./HGPAKtool
	chmod +x ./MBINCompiler-linux

mapping.json:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/latest/download/mapping.json -o ./mapping.json
	jq '.Mapping | map({(.Key): .Value}) | add' ./mapping.json > ../src/data/mapping.json
	npx prettier --write ../src/data/mapping.json --config ../.prettierrc

translations.json:
	python ./HGPAKtool/HGPAKTool/hgpaktool.py ./PCBANKS/NMSARC.MetadataEtc.pak
	for f in EXTRACTED/language/*_usenglish.mbin; do \
		echo "Decoding $$f"; \
		./MBINCompiler-linux -y -d ./EXTRACTED/language/ "$$f"; \
	done
	python ./extract_translations.py

item_to_name_mappings.json: translations.json
	curl -sSL "https://github.com/NMSCD/nms-archive/raw/refs/heads/main/$(VERSION)/METADATA/REALITY/TABLES/NMS_REALITY_GCPRODUCTTABLE.MXML" -o ./NMS_REALITY_GCPRODUCTTABLE.MXML
	curl -sSL "https://github.com/NMSCD/nms-archive/raw/refs/heads/main/$(VERSION)/METADATA/REALITY/TABLES/NMS_BASEPARTPRODUCTS.MXML" -o ./NMS_BASEPARTPRODUCTS.MXML
	python ./extract_item_names.py

season_rewards.json: item_to_name_mappings.json
	curl -sSL "https://github.com/NMSCD/nms-archive/raw/refs/heads/main/$(VERSION)/METADATA/REALITY/TABLES/UNLOCKABLESEASONREWARDS.MXML" -o ./UNLOCKABLESEASONREWARDS.MXML
	python ./extract_season_rewards.py
	cp ./season_rewards.json ../src/data/rewards/season.json
	npx prettier --write ../src/data/rewards/season.json --config ../.prettierrc

twitch_rewards.json: item_to_name_mappings.json
	curl -sSL "https://github.com/NMSCD/nms-archive/raw/refs/heads/main/$(VERSION)/METADATA/REALITY/TABLES/UNLOCKABLETWITCHREWARDS.MXML" -o ./UNLOCKABLETWITCHREWARDS.MXML
	python ./extract_twitch_rewards.py
	cp ./twitch_rewards.json ../src/data/rewards/twitch.json
	npx prettier --write ../src/data/rewards/twitch.json --config ../.prettierrc

rewards: season_rewards.json twitch_rewards.json
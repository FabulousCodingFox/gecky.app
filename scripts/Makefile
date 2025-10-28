.PHONY: clean install-deps all mapping.json rewards translations.json item_to_name_mappings.json season_rewards.json twitch_rewards.json platform_rewards.json extract_pcbank_metadataetc extract_pcbank_precache

MBIN_COMPILER_VERSION := v6.13.0-pre1

all: clean install-deps mapping.json rewards

clean:
	rm -f ./season_rewards.json ./twitch_rewards.json ./item_to_name_mappings.json ./translations.json ./mapping.json ./platform_rewards.json
	rm -rf ./EXTRACTED
	rm -f ./MBINCompiler-linux
	rm -rf ./HGPAKtool
	rm -f ./*.log
	rm -f ./*.MXML

install-deps:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/download/$(MBIN_COMPILER_VERSION)/MBINCompiler-linux-dotnet6  -o ./MBINCompiler-linux
	git clone https://github.com/monkeyman192/HGPAKtool.git ./HGPAKtool
	chmod +x ./MBINCompiler-linux

mapping.json:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/download/$(MBIN_COMPILER_VERSION)/mapping.json -o ./mapping.json
	jq '.Mapping | map({(.Key): .Value}) | add' ./mapping.json > ../src/data/mapping.json
	npx prettier --write ../src/data/mapping.json --config ../.prettierrc

extract_pcbank_metadataetc:
	python ./HGPAKtool/HGPAKTool/hgpaktool.py ./PCBANKS/NMSARC.MetadataEtc.pak

extract_pcbank_precache:
	python ./HGPAKtool/HGPAKTool/hgpaktool.py ./PCBANKS/NMSARC.Precache.pak

translations.json: extract_pcbank_metadataetc
	for f in EXTRACTED/language/*_usenglish.mbin; do \
		echo "Decoding $$f"; \
		./MBINCompiler-linux -y -d ./EXTRACTED/language/ "$$f"; \
	done
	python ./extract_translations.py

item_to_name_mappings.json: translations.json extract_pcbank_precache
	./MBINCompiler-linux -y -d ./ ./EXTRACTED/metadata/reality/tables/nms_reality_gcproducttable.mbin
	./MBINCompiler-linux -y -d ./ ./EXTRACTED/metadata/reality/tables/nms_basepartproducts.mbin
	python ./extract_item_names.py

season_rewards.json: item_to_name_mappings.json extract_pcbank_precache
	./MBINCompiler-linux -y -d ./ ./EXTRACTED/metadata/reality/tables/unlockableseasonrewards.mbin
	python ./extract_season_rewards.py
	cp ./season_rewards.json ../src/data/rewards/season.json
	npx prettier --write ../src/data/rewards/season.json --config ../.prettierrc

twitch_rewards.json: item_to_name_mappings.json extract_pcbank_precache
	./MBINCompiler-linux -y -d ./ ./EXTRACTED/metadata/reality/tables/unlockabletwitchrewards.mbin
	python ./extract_twitch_rewards.py
	cp ./twitch_rewards.json ../src/data/rewards/twitch.json
	npx prettier --write ../src/data/rewards/twitch.json --config ../.prettierrc

platform_rewards.json: item_to_name_mappings.json extract_pcbank_precache
	./MBINCompiler-linux -y -d ./ ./EXTRACTED/metadata/reality/tables/unlockableplatformrewards.mbin
	python ./extract_platform_rewards.py
	cp ./platform_rewards.json ../src/data/rewards/platform.json
	npx prettier --write ../src/data/rewards/platform.json --config ../.prettierrc

rewards: season_rewards.json twitch_rewards.json platform_rewards.json
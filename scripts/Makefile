.PHONY: install-deps all mapping.json expeditions.json twitch.json

all: install-deps mapping.json expeditions.json twitch.json

install-deps:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/latest/download/MBINCompiler-linux  -o ./MBINCompiler-linux
	git clone https://github.com/monkeyman192/HGPAKtool.git ./HGPAKtool
	chmod +x ./MBINCompiler-linux

mapping.json:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/latest/download/mapping.json -o ./mapping.json
	jq '.Mapping | map({(.Key): .Value}) | add' ./mapping.json > ../src/data/mapping.json
	npx prettier --write ../src/data/mapping.json --config ../.prettierrc

twitch.json:
	curl -sSL "https://github.com/NMSCD/nms-archive/raw/refs/heads/main/6.01-VOYAGERS-28.August.2025/METADATA/REALITY/TABLES/UNLOCKABLETWITCHREWARDS.MBIN" -o ./UNLOCKABLETWITCHREWARDS.MBIN
	./MBINCompiler-linux -d ./ ./UNLOCKABLETWITCHREWARDS.MBIN -y

season.json:
	curl -sSL "https://github.com/NMSCD/nms-archive/raw/refs/heads/main/6.01-VOYAGERS-28.August.2025/METADATA/REALITY/TABLES/UNLOCKABLESEASONREWARDS.MBIN" -o ./UNLOCKABLESEASONREWARDS.MBIN
	./MBINCompiler-linux -d ./ ./UNLOCKABLESEASONREWARDS.MBIN -y

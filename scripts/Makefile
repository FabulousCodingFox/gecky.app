.PHONY: all mapping.json

all: mapping.json

mapping.json:
	curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/latest/download/mapping.json -o ./mapping.json
	jq '.Mapping | map({(.Key): .Value}) | add' ./mapping.json > ../src/data/mapping.json
	npx prettier --write ../src/data/mapping.json --config ../.prettierrc

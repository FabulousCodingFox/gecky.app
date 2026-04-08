# https://github.com/monkeyman192/MBINCompiler/releases
MBIN_COMPILER_VERSION := "v6.30.0-pre1"

# https://github.com/monkeyman192/HGPAKtool/releases
HGPAK_TOOL_VERSION    := "1.1.3"

download-mbincompiler:
  @gum spin --spinner dot --title "Downloading MBINCompiler ({{MBIN_COMPILER_VERSION}})..." -- curl -sSL https://github.com/monkeyman192/MBINCompiler/releases/download/{{MBIN_COMPILER_VERSION}}/MBINCompiler-linux -o ./out/mbincompiler
  @gum style --foreground 10 "✅ Downloaded MBINCompiler ({{MBIN_COMPILER_VERSION}})."
  @chmod +x ./out/mbincompiler

download-hgapaktool:
  @gum spin --spinner dot --title "Downloading HGPAKtool ({{HGPAK_TOOL_VERSION}})..." -- curl -sSL https://github.com/monkeyman192/HGPAKtool/releases/download/{{HGPAK_TOOL_VERSION}}/hgpaktool-x86_64-unknown-linux.gz -o ./out/hgpaktool.gz
  @gum style --foreground 10 "✅ Downloaded HGPAKtool ({{HGPAK_TOOL_VERSION}})."
  @gunzip -c ./out/hgpaktool.gz > ./out/hgpaktool
  @rm ./out/hgpaktool.gz
  @chmod +x ./out/hgpaktool

install-dependencies: download-mbincompiler download-hgapaktool
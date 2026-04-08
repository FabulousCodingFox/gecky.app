clean:
  @if [ ! -d "./out" ]; then mkdir ./out; gum style --foreground 10 "✅ Created out directory."; fi
  @rm -rf ./out/*
  @gum style --foreground 10 "✅ Cleaned out directory."

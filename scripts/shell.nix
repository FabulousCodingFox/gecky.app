{ pkgs ? import <nixpkgs> {
    config = {
      permittedInsecurePackages = [
        "dotnet-runtime-6.0.36"
      ];
    };
  }
}:

pkgs.mkShell {
  buildInputs = [
    pkgs.dotnetCorePackages.runtime_8_0-bin
    pkgs.just
    pkgs.gum
    pkgs.jq
    pkgs.curl
    pkgs.python313
    pkgs.python313Packages.pillow
    pkgs.xmlstarlet
  ];

  shellHook = ''
    export DOTNET_ROOT=${pkgs.dotnetCorePackages.runtime_8_0-bin}/share/dotnet/
  '';
}

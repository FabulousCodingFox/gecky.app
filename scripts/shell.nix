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
    pkgs.dotnet-runtime_6
    pkgs.just
    pkgs.gum
    pkgs.jq
    pkgs.curl
    pkgs.python313
    pkgs.python313Packages.pillow
    pkgs.xmlstarlet
  ];

  shellHook = ''
    export DOTNET_ROOT=${pkgs.dotnet-runtime_6}/share/dotnet/
  '';
}

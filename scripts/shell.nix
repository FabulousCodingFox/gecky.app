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
    pkgs.gnumake
    pkgs.nodejs_24
    pkgs.jq
  ];

  shellHook = ''
    export DOTNET_ROOT=${pkgs.dotnet-runtime_6}/share/dotnet/
  '';
}

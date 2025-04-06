{ pkgs, ... }: {
  channel = "stable-24.05"; # Or "unstable" for latest packages

  packages = [
    pkgs.nodejs_20 # For Cloud Functions and frontend development
    pkgs.nodePackages.npm # Node Package Manager
    pkgs.python311 # For potential Python Cloud Functions or scripts
    pkgs.python311Packages.pip # Python Package Manager
    pkgs.google-cloud-sdk # Google Cloud SDK for gcloud commands
    pkgs.jq # For JSON processing (useful with gcloud)
    pkgs.git # Version control
    pkgs.adoptopenjdk-bin
    pkgs.nano
    pkgs.sudo
  ];

  env = {
    # Set any necessary environment variables here
    # Example: NODE_ENV = "development";
  };

  idx = {
    extensions = [
      "esbenp.prettier-vscode" # Code formatting
      "dbaeumer.vscode-eslint" # Linting
      "ms-azuretools.vscode-docker" # Docker support (if you use containers)
      "googlecloudplatform.googlecloudcode" # Google Cloud Code extension
      "ms-vscode.live-server"
      "ritwickdey.LiveServer"
    ];

    previews = {
      enable = true;
      previews = {
        # If your frontend has a development server, configure it here:
        # web = {
        #   command = ["npm" "run" "dev"];
        #   manager = "web";
        #   env = {
        #     PORT = "$PORT";
        #   };
        # };
      };
    };

    workspace = {
      onCreate = {
        npm-install = "npm install"; # Install frontend dependencies
        python-install = "pip install -r requirements.txt"; # Install python dependencies if you use python
        default.openFiles = [
          "README.md"
          "frontend/index.html" # Example frontend file
          "backend/pre-verification/index.js" # Example Cloud Function
        ];
      };
      onStart = {
        # Example: Start a local development server or watcher
        # start-dev = "npm run start";
      };
    };
  };
}
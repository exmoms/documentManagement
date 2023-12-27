#!/bin/bash

# This file is included inside the document management docker image and is invoked automatically when starting the image.
# The configuration environment variables are provided by docker-compose.

# The script starts the dotnet application in config mode and passes all configuration parameters to it in the first run.
# The application is responsible to store them securely and use them in subsequent runs when the environment variables
# are not provided.

# break when any operation fails
set -e

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <webapp_dll_file_name>"
  exit 1
fi

# returns true iff all configuration environment variables are available
all_environment_variables_available() {
  [[ -n "$DB_HOST" ]] || return
  [[ -n "$DB_USER" ]] || return
  [[ -n "$DB_Name" ]] || return
  [[ -n "$SECRET_DB_PASSWORD" ]] || return
  [[ -n "$SECRET_JWT_ISSUER_SIGNING_KEY" ]] || return
}

if all_environment_variables_available; then
  echo All configuration environment variables are available.
  echo Starting the application in config mode...
  DB_CONNECTION_STRING="Server=$DB_HOST;User=$DB_USER;Password=$SECRET_DB_PASSWORD;Database=$DB_Name;MultipleActiveResultSets=true"
  { echo "$SECRET_JWT_ISSUER_SIGNING_KEY"; echo "$DB_CONNECTION_STRING"; } | dotnet "$1" -config
  echo configuration finished successfully.
fi

echo starting web application...
dotnet "$1"

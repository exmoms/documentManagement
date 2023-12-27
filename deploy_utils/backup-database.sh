#!/bin/bash

# This file is included inside the document management docker image and is invoked automatically when starting the image.
# The configuration environment variables are provided by docker-compose.

# The script starts the dotnet application in config mode and passes all configuration parameters to it in the first run.

# break when any operation fails
set -e

if [ -f docker-compose.yml ]; then
  echo "an installation exists!"
  # create a backup folder if not exist
  docker exec mssql_server_2019 mkdir -p /var/opt/mssql/backup
  echo "start backup database..."
  
  # Create a file name for the backup based on the current date and time
  # Example: 2019-01-27_13:42:00.master.bak
  FILE_NAME=$(date +%Y-%m-%d_%H:%M:%S.$DATABASE_NAME.bak)
  
  docker exec mssql_server_2019 /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SECRET_DB_PASSWORD -Q "BACKUP DATABASE [$DATABASE_NAME] TO DISK = N'/var/opt/mssql/backup/$FILE_NAME' WITH NOFORMAT, NOINIT, NAME = '$DATABASE_NAME-full', SKIP, NOREWIND, NOUNLOAD, STATS = 10"

fi

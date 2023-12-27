# Modified from https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-3.1

FROM registry.gitlab.scase.local/general/dockerhubmirror/dotnet_core_aspnet:3.1.1-buster-slim

WORKDIR /app
COPY app/publish ./
# add startup script
COPY config_and_run.sh ./
RUN chmod +x config_and_run.sh

CMD ["dotnet", "DM.Presentation.dll"]

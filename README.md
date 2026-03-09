## Disclaimer

This repository is a fork of the original **maintainerr/maintainerr** project.

I created this fork solely to experiment with and implement a feature that allows **archiving media instead of permanently deleting it**. The goal was to keep media files in an archive location rather than removing them entirely.

Please note that **I am not a programmer**. The modifications in this repository were primarily implemented with the help of **Claude (AI)**. My role was mainly to guide the implementation and test the results.

Because of this, the code may not follow best practices and should be considered **experimental**. Use it at your own risk.

All credit for the original project and the vast majority of the code goes to the maintainers and contributors of the original repository:
https://github.com/maintainerr/maintainerr


<b>Maintainerr</b> makes managing your media easy.

- Do you hate being the janitor of your server?
- Do you have a lot of media that never gets watched?
- Do your users constantly request media, and let it sit there afterward never to be touched again?

If you answered yes to any of those questions... You NEED <b>Maintainerr</b>.
It's a one-stop-shop for handling those outlying shows and movies that take up precious space on your server.

# Features

- Configure rules specific to your needs, based on several available options from Plex, Jellyfin, Seerr, Radarr, Sonarr and Tautulli.
- Switch between Plex and Jellyfin as your media server, with automatic rule migration.
- Manually add media to a collection, in case it's not included after rule execution. (one-off items that don't match a rule set)
- Selectively exclude media from being added to a collection, even if it matches a rule.
- Show a collection, containing rule matched media, on the media server home screen for a specific duration before deletion. Think "Leaving soon".
- Optionally, use a manual collection, in case you don't want <b>Maintainerr</b> to add & remove collections at will.
- Manage media straight from the collection within your media server. <b>Maintainerr</b> will sync and add or exclude media to/from the internal collection.
- Remove or unmonitor media from \*arr
- Clear requests from Seerr
- Delete files from disk or archive them to a specified folder

<br />
Currently, <b>Maintainerr</b> supports rule parameters from these apps :

- [Plex](https://www.plex.tv/)
- [Jellyfin](https://jellyfin.org/)
- [Seerr](https://seerr.dev/)
- [Radarr](https://radarr.video/)
- [Sonarr](https://sonarr.tv/)
- [Tautulli](https://tautulli.com/)

# Preview

![image](apps/ui/public/screenshots/overview_screenshot.png)
![image](apps/ui/public/screenshots/rules_screenshot.png)
![image](apps/ui/public/screenshots/collections_screenshot.png)
![image](apps/ui/public/screenshots/rule_example_screenshot.png)

# Installation

Docker images for amd64 & arm64 are available under <b>ghcr.io/maintainerr/maintainerr</b> and [maintainerr/maintainerr](https://hub.docker.com/r/maintainerr/maintainerr). <br />

Data is saved within the container under /opt/data, it is recommended to tie a persistent volume to this location in your docker run command/compose file.
Make sure this directory is read/writeable by the user specified in the 'user' instruction. If no 'user' instruction is configured, the volume should be accessible by UID:GID 1000:1000.

For more information, visit the [installation guide](https://docs.maintainerr.info/latest/Installation).

Docker run:

```Yaml
docker run -d \
--name maintainerr \
-e TZ=Europe/Brussels \
-v ./data:/opt/data \
-u 1000:1000 \
-p 6246:6246 \
--restart unless-stopped \
ghcr.io/heeelga/maintainerr:latest
```

Docker-compose:

```Yaml
services:
    maintainerr:
        image: ghcr.io/heeelga/maintainerr:latest # or maintainerr/maintainerr:latest
        container_name: maintainerr
        user: 1000:1000
        volumes:
          - /path_to_local_media:/media #This is where you store your media
          - /path_to_local_archive:/archive #Your archived media will be placed here
          - type: bind
            source: ./data
            target: /opt/data
        environment:
          - TZ=Europe/Brussels
#      - BASE_PATH=/maintainerr # uncomment if you're serving maintainerr from a subdirectory
#      - UI_HOSTNAME=:: # uncomment if you want to listen on IPv6 instead (default 0.0.0.0)
#      - UI_PORT=6247 # uncomment to change the UI port (default 6246)
#      - GITHUB_TOKEN=ghp_yourtoken # Optional: GitHub Personal Access Token for higher API rate limits (60/hr without, 5000/hr with token)
        ports:
          - 6246:6246
        restart: unless-stopped
```

# Documentation

[For more information, please consult the documentation](https://docs.maintainerr.info/)

# Features

[To get an indication of which features are most desired, you can vote for them](https://features.maintainerr.info/?view=most-wanted)

# Credits

Maintainerr is heavily inspired by Seerr (Overseerr / Jellyseerr). Some parts of Maintainerr's code are plain copies. Big thanks to the Seerr team!

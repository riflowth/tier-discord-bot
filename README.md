<img width="100" src="https://user-images.githubusercontent.com/17198802/150626546-125a834c-4ba4-4ae0-83d5-495c7aab4dfe.png" alt="tier logo" />

# Tier Community Edition

This repository (`tier-discord-bot`) is where I develop the [discord](https://discord.com/) bot with the community.  
This source code is available to everyone under the standard [MIT license](LICENSE.md).

## Building Tier Community Edition
Tier requires [Node](https://nodejs.org/) v.16.6.0 or higher because using of [discord.js v13](https://discord.js.org/).  

If your system meets the requirement above then you're good to go!
You only need to run `yarn install` in your terminal and then start in your node environment.  

## Running
Tier discord bot has provided a Docker image to run it on the [Docker](https://www.docker.com/) container.  
First, you need to pull the image by using the command below.

```bash
docker pull ghcr.io/riflowth/tier-discord-bot:latest
```

and then start the container with your bot application `token` environment created from [Discord developer portal](https://discord.com/developers/applications)

```bash
docker run -d -e TOKEN=<your_discord_bot_token> -n ghcr.io/riflowth/tier-discord-bot:latest
```

## Contributing
There are many ways in which you can participate in this project, for example:
- [Submit bugs and feature request](https://github.com/riflowth/tier-discord-bot/issues)
- Review [source code changes](https://github.com/riflowth/tier-discord-bot/pulls)
- Fixing issues and contributing directly to the code base by [submitting pull requests](https://github.com/riflowth/tier-discord-bot/pulls)

## License
Copyright (c) Krid Heprakhone. All rights reserved.

Licensed under the [MIT](LICENSE.md) license.

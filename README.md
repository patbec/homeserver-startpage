# thinkbox.center <img width="11%" align="right" src="src/favicon.svg"></img>

![Deploy](https://img.shields.io/github/deployments/patbec/thinkbox.center/github-pages?label=deploy) ![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=brightgreen&up_message=online&url=https%3A%2F%2Fthinkbox.center) ![html](https://img.shields.io/github/size/patbec/thinkbox.center/src/index.html?label=html)

A small overview page of services hosted under my domain. Feel free to fork it and add your own services.

![Preview](./docs/website-preview-dark.png#gh-dark-mode-only)
![Preview](./docs/website-preview-light.png#gh-light-mode-only)

## Features

A short list of what features the front-end offers.

<b>Supported device classes:</b><br>
✅ Small smartphones<br>
✅ Smartphones<br>
✅ Tablets<br>
✅ Laptops<br>
✅ Desktops<br>
❌ Foldable devices<br>
❌ Handhelds<br>

<b>Supported views:</b><br>
✅ Night view<br>
✅ Day view<br>
✅ High contrast view <sup>(1)</sup>

<b>High-DPI support:</b><br>
✅ Yes - SVGs are used <sup>(2)</sup><br>

<b>Multilanguage:</b><br>
❌ No - English only<br>

<b>External dependencies:</b><br>
✅ None<br>

<br>

<sup>(1)</sup>
High contrast view is for people with low vision. Activate the `forced-colors` scheme under `More Tools -> Rendering` in Chrome Dev Tools to get a preview.<br>
The colors used are determined by the browser, see at W3C CSS Color Module Level 4 - [6.2. System Colors](https://www.w3.org/TR/css-color-4/#css-system-colors).

<sup>(2)</sup>
Vector images were used whenever possible, some application icons are from [Simple Icons](https://simpleicons.org/) and were manually post-processed. See [Zigbee2MQTT](https://github.com/patbec/thinkbox.center/blob/f6a5288f53e902a0a1a430dea4d855bf444f1367/src/images/apps/zigbee2mqtt.svg?short_path=c657464) or [Node-RED](https://github.com/patbec/thinkbox.center/blob/f6a5288f53e902a0a1a430dea4d855bf444f1367/src/images/apps/nodered.svg?short_path=cdbf839) as an example, the vector code was reduced and cleaned up.

## Usage

Here is a summary about the project directory.

### Project

Open this folder using Visual Studio Code. After opening, the [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is offered as the recommended extension to install. If you are using a different local web server for testing, you can ignore the recommendation.

The website uses **absolute paths** for the image files, so the `liveServer.settings.root` setting in `setting.json` is set to the `src` folder.

### Workflow

Under `.github/workflow` there is a `pages.yml` file, this is a customized version of the [original GitHub Pages](https://github.com/marketplace/actions/deploy-to-github-pages) workflow file to automatically deploy a web page. Compared to the default file, it only uploads the `src` folder, other contents like the docs folder etc. are ignored.

### Security

When you fork this page, modify the `.well-known/security.txt` file. This file contains information for contacting researchers according to the standard [RFC9116](https://www.rfc-editor.org/rfc/rfc9116).

With [this page](https://securitytxt.org/) you can create your own `security.txt` according to the current standard.

### Handler

If you want to use the `Secure Shell` item to open an **SSH connection**, it works out of the box on Linux and macOS. For Windows, a registry entry is required, pointing to the Windows terminal, for example.

The shell handler looks like this: `ssh://console.thinkbox.center`

> Since there is no username defined in the url, your current username will be used for the SSH connection.

### Modifications

After forking, changes should be made in the following places:

* File `index.html` _(title and meta tags + content)_
* File `security.txt` _(See previous point)_
* File `mask-main.svg` _(If you want to replace the cat asset with another one)_

## Design <img align="right" height="50" src="docs/cloud.svg" alt="Cloud"/>

Here are a few small good-to-know points when customizing the look of the page.

### Mask Color

The file `mask-main.svg` has the border color `#808080`, this shade of gray matches the light and dark theme without color changes.

### SVG favicons

The favorite icon supports the `light`, `dark` and `high contrast` theme. For this a [CSS Media Query was embedded](https://github.com/patbec/thinkbox.center/blob/main/src/favicon.svg?short_path=231b622#L5) directly in the SVG. [See here](https://caniuse.com/link-icon-svg) what browsers fully support SVG favicons.

### Overflow color

The background is a gradient, on touch devices you can scroll beyond the page border. As you can see in [this example image](docs/website-gradient-sample.png), the page has the same color at the top and bottom. This prevents a color break when scrolling beyond the page border on a smartphone or tablet.
The overflow color can only have a solid color and is set with `theme-color`.

```html
<meta name="theme-color" media="(prefers-color-scheme:light)" content="#fbfbfb">
<meta name="theme-color" media="(prefers-color-scheme:dark)" content="#161b22">
```

## Setup

These services are only accessible via <b>VPN</b>, the subdomain <i>(bsp. test.thinkbox.center)</i> returns a private IP address. Routers usually filter such requests via the [DNS rebind](https://en.wikipedia.org/wiki/DNS_rebinding) protection function.

If you have a FRITZ!Box, you can add an exception for your domain with [this guide](https://avm.de/service/wissensdatenbank/dok/FRITZ-Box-7390/663_DNS-Auflosung-privater-IP-Adressen-nicht-moglich/).

Use a command like this to check if DNS resolution is working:
```
nslookup test.thinkbox.center
```

<details>
  <summary>Example configuration for a reverse proxy with certificate from let's encrypt</summary>

### Treafik

A sample config to provide a HTTPS connection for docker services.

```
version: '3.9'
services:
  traefik:
    container_name: traefik
    image: "traefik:v2.8"
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/lib/certificates:/certificates
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=true
      - --certificatesresolvers.letsencrypt.acme.dnschallenge=true
      - --certificatesresolvers.letsencrypt.acme.dnschallenge.provider=joker
      - --certificatesresolvers.letsencrypt.acme.email=info@thinkbox.center
      - --certificatesresolvers.letsencrypt.acme.storage=/certificates/acme.json
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --entrypoints.web.http.redirections.entrypoint.permanent=true
      - --entrypoints.websecure.address=:443
      - --entrypoints.websecure.http.tls=true
      - --entrypoints.websecure.http.tls.certResolver=letsencrypt
      - --entrypoints.websecure.http.tls.domains[0].main=thinkbox.center
      - --entrypoints.websecure.http.tls.domains[0].sans=*.thinkbox.center
    ports:
      - "80:80"
      - "443:443"
    environment:
      - JOKER_API_MODE=SVC
      - JOKER_USERNAME=${SECRET_DNS_JOKER_USERNAME}
      - JOKER_PASSWORD=${SECRET_DNS_JOKER_PASSWORD}
    networks:
      - default
    labels:
      - traefik.http.routers.dashboard.rule=Host(`traefik.thinkbox.center`)
      - traefik.http.routers.dashboard.service=api@internal
      - traefik.http.routers.dashboard.entrypoints=websecure
      - traefik.http.middlewares.exceptions.errors.service=serviceError
      - traefik.http.middlewares.exceptions.errors.query=/{status}.html
```

Use a DNS wildcard `A/AAAA-Record` to forward all requests to your Traefik.

</details>

## Licence

This project is licensed under MIT - See the [LICENSE](/LICENSE) file for more information.

---

&uarr; [Back to top](#)

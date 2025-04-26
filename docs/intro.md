# Welcome to the SparkleCord Documentation!  
This is the main index for understanding SparkleCord, its structure, and how to use it.  

---
## Table Of Contents
- [Introduction](#introduction)
- [Folder & File Structure](#folder--file-structure)
## Other Pages To Check Out
- [Plugin System](docs/plugins.md)
- [Custom CSS & Themes](docs/themes.md)
- [Emoji & Twemoji Integration](docs/emojis.md)
--- 

# Introduction
SparkleCord is an offline, customizable, lightweight, and open-source Discord clone.  
If you're here because you want to download SparkleCord, you can do that by clicking one of the following links:
- https://sparklecord.github.io/download
> This page directly downloads the latest (non pre-release) version from GitHub's API.  
- https://github.com/SparkleCord/SparkleCord-Client/releases
> This includes pre-releases, such as 1.3.0.

# Folder & File Structure
SparkleCord is made up by many files! In this section we will be looking into all of them.
### 📁 `/src` (or the ZIP's base directory)
Not really much to explain, this contains pretty much everything the user will actually use, including but not limited to; the backend (JS), mid-end (CSS), aaaand the frontend (HTML).
- 📁 [assets](#-assets)
> This includes assets, we'll be looking at this later on.
- 📁 css
> This includes all the CSS styles, we'll be looking at this later on.
- 📁 emoji
> This includes all the emoji files (taken from the twemoji repository.), we'll be looking at this in the [emojis](docs/emojis.md) section, and a brief explanation here later.
- 📁 js
> This includes all the javascript files, we'll be looking at this later on.
- 🌐 css-editor.html
> This is the UserCSS editor, uses Monaco editor (the same one VSCode uses) if online, though otherwise falls back to CodeMirror.
- 🌐 index.html
> This is the actual SparkleCord file. Without this, SparkleCord will not work.
- 📄 README.txt
> This file tells you to open index.html to start SparkleCord.
### 📁 `/assets`
This folder contains assets (usually images) used by SparkleCord.  
All folders here have `.nomedia` to ensure Android or other mobile operating system galleries don't show SparkleCord's assets (as there's quite a lot).  
- 📁 avatars
> This folder only contains default *user* profile pictures.
- 📁 avatars > core
> This folder contains profile pictures for system users such as Byte or Sparkly.
- 📁 fonts
> This folder includes all fonts used by SparkleCord (usually in woff2 format). For example, "gg-sans-400-normal.woff2".
- 📁 icons
> This folder includes all SparkleCord logos, in ico, png, or other formats.
- 📁 loading
> This folder includes all loading spinners used by SparkleCord in transparent GIF format. for example, "Birthday.gif".
- 📁 PWA
> This folder includes files required for the Progressive Web Application (PWA). (currently only manifest.json)
- 📁 svg
> This folder includes all Scalable Vector Graphic (SVG) files used by SparkleCord.
> Trivia: Before 1.2.0, I used hardcoded SVGs for everything.
> And before 1.4.0, the leftover unused SVGs remained.
- 📁 svg > file
> This includes all the SVGs used for files (For example, sending an unrenderable file, dragging and dropping, sending an audio file, etc.), even ones that aren't as common or able to be seen in-app.
### 📁 `/css`
This folder contains all the styling rules to make SparkleCord look like Discord, and not absolute garbage. (not a gd reference i promise)
- 📁 base
> This folder contains the following:
> - CSS Variables for all 4 themes (light, dark, darker, and midnight), visual refresh variants of said themes, and gradient theme support (may be used soon)  
> - `@font-face` declarations in `/base/fonts.css`  
> - A file that contains base styles and some normalization (`base/reset.css`)
- 📁 components
> This folder contains styles for components, such as `components/autocomplete.css`, or `components/settings.css`.
> 
> ---
> ***Suggestion:*** For better maintainability, consider separating longer CSS files into smaller components.  
For example, `settings.css` currently includes many button styles, perhaps those could be put in `buttons.css`.  
Also, consider renaming `commands.css` for clarity, something like `bot-tag.css` might make more sense.
- 📁 layout
> This folder contains styles for the layout, like the profile section or the loading screen.
### 📁 `/emoji`
This folder contains all emoji assets, directly sourced from the Twemoji repository. It also includes a `.nomedia` file to prevent emojis from showing up in mobile galleries.
### 📁 `/js`
This folder is pretty much the actual brain behind SparkleCord, without it, SparkleCord would look nice, but be as useful as a toaster with Wi-Fi and no slots for bread.
- 📁 codemirror
> This folder contains stuff for the fallback css editor.
- 📁 compatibility
> This folder contains stuff for compatibility, such as polyfills.
- 📁 data
> This folder contains JSON data for stuff.
- 📁 highlight
> This folder contains stuff for highlight.js (hljs).
- 📁 modules
> This folder contains modules/libraries I might include, such as `Twemoji`.
- 📁 plugins
> This folder contains stuff for plugin management, including your own custom plugins.
I'm gonna have to sleep now, this documentation will be polished up tomorrow.

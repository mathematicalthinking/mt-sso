# MT-SSO [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

MT-SSO is a Single-Sign-On authentication system for [EnCOMPASS](https://github.com/mathematicalthinking/encompass) and [VMT](https://github.com/mathematicalthinking/vmt)

## Prerequisites

You will need the following things properly installed on your computer.  These instructions may vary if not using a mac.  Some of the tools are a suggestion, such as MacDown.

Note: these procedures work for an M1 Mac running Monterey.  Please update this ddocument for other variations of OS and hardware.

### Install HomeBrew (for zsh shell)
  [HomeBrew Install](https://docs.brew.sh/Installation)
#### Summary:
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
  Note: this will install command line tools for xcode if needed
  
### Install Git

[Git](https://git-scm.com/)
#### summary:
    brew install git
    brew install git-gui
    
### Install NVM (Node Version Manager):

[NVM Readme.md](https://github.com/nvm-sh/nvm)

#### summary:
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

#### open a new tab for NVM environment variables to be set
    nvm --version
    nvm install 12.16.1
    <!-- - [Node.js](https://nodejs.org/) (with npm) -->

### Install Google Chrome and Firefox
[Google Chrome](https://google.com/chrome/)

[Firefox](https://www.mozilla.org/en-US/firefox/new/)

### Install Mongodb Community Edition
  [Mongo Install on Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
  
    xcode-select --install
    brew install mongodb-community@5.0
    
##### To Start Mongo on M1 Mac
    brew services start mongodb/brew/mongodb-community@4.4

##### To Stop Mongo
    brew services stop mongodb/brew/mongodb-community@4.4

### Install Markdown Editor
#### for example:
  https://macdown.uranusjr.com/)


## Installation (Technologies used)
- [MongoDB](http://www.mongodb.org/),
- [Express](http://expressjs.com/),
- [Node.js](http://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)


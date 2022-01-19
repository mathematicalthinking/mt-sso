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
    git config --global user.name "<your name here>"
    git config --global user.email <your.email@here>
    
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

### MongoDB

#### Install Mongodb Community Edition (M1 Mac)
  [Mongo Install on Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
  
    xcode-select --install
    brew install mongodb-community@4.4
    ln -s /opt/homebrew/Cellar/mongodb-community@4.4/4.4.10/bin/mongod /opt/homebrew/bin/mongod 
    mongod --config /opt/homebrew/etc/mongod.conf
    mongosh

#### Send output from mongod to console, not log file
##### Comment out systemLog options, so it defaults to console

    vi /opt/homebrew/etc/mongod.conf
    cat /opt/homebrew/etc/mongod.conf

Config file should look like:

```
# systemLog:
  # destination: file
  # path: /opt/homebrew/var/log/mongodb/mongo.log
  # logAppend: true
storage:
  dbPath: /opt/homebrew/var/mongodb
net:
  bindIp: 127.0.0.1
```

#### Mongodb Troubleshooting (M1 Mac)
- Log location on M1 Mac: /opt/homebrew/var/log/mongodb/mongo.log
- Database location on M1 Mac: /opt/homebrew/var/mongodb
- Configuration file location on M1 Mac: /opt/homebrew/etc/mongod.conf
- run mongod with debugging (-v for level 1, -vvvvv for level 5)
    ```mongod -vvvvv --config /opt/homebrew/etc/mongod.conf```
    
- 'mongod not found' on M1 Mac
  - to run with full path to see if any errors:
    ```/opt/homebrew/opt/mongodb-community@4.4/bin/mongod```
    
  - to set symbolic link to resolve problem:
    ```ln -s /opt/homebrew/Cellar/mongodb-community@4.4/4.4.10/bin/mongod /opt/homebrew/bin/mongod```
    
- monitor the mongo.log (tail to only see log items after starting command - <ctl>c to stop):
  ```tail -f /opt/homebrew/var/log/mongodb/mongo.log```
  
- "Error during global initialization","attr":{"error":{"code":38,"codeName":"FileNotOpen","errmsg":"Failed to open /opt/homebrew/var/log/mongodb/mongo.log"}}
  - check the security on the log file:
    ```ls -al /opt/homebrew/var/log/mongodb/mongo.log```
  - change the ownership of the log file to not be root
    ```sudo chown <yourMacUsername>:admin /opt/homebrew/var/log/mongodb/mongo.log```
  - Lesson Learned: do not do sudo brew install
- "DBException in initAndListen, terminating","attr":{"error":"IllegalOperation: Attempted to create a lock file on a read-only directory: /opt/homebrew/var/mongodb"}
  - check the security on the database directory:
    ```ls -al /opt/homebrew/var/mongodb```
  - change ownership of all database files to not be root:
    ```sudo chown -R <yourMacUsername>:admin /opt/homebrew/var/mongodb/```
  - Lesson Reinforced: do not do sudo brew install
- mongosh returns ```MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017```
  - confirm mongod is running

#### install MongoDB Compass GUI
[Download Compass](https://www.mongodb.com/try/download/compass)

### Install Markdown Editor
#### for mac you can use MacDown:
  https://macdown.uranusjr.com/)

 
### Install Express
[Express](http://expressjs.com/)

#### Summary:
    npm install express --save

### Install Typescript
[TypeScript](https://www.typescriptlang.org/)

#### Summary:
    npm install typescript --save-dev

### Set Up Development Environment variable in the .env file

#### Option 1 - 21pstem Setup (OAUTH via Mathematical Thinking google accounts)
1. Locate the most recent date stamped folder of the Mathematical Thinking environments file in the SoftwareConfigs / DotEnvFiles folder.
2. 

#### Option 2 - other setups (OAUTH via other google accounts)

1. Copy the .env.example file to .env

    cp .env.example .env
    
1. ##### Set up OAuth with Google for Sign In with Google

    [Set Up Sign In with Google (To Do)](https://github.com/mathematicalthinking/mt-sso/wiki/Setup-Sign-In-with-Google)

## Start the Mathematical Thinking Single Sign On
    mongod --config /opt/homebrew/etc/mongod.conf
    npm run dev 

### Setup To Do
1. Database load or generated testing database
    download mtlogin_stage_db_2021_05_10.gz from VmtEncompass folder
    mongo restore command
2. User email and password to log in at
	username from mtlogin_stage_db_2021_05_10.gz database




#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 1
fi

if [ $1 != "prod" -a $1 != "staging" ]
  then
  echo "Argument must be 'prod' or 'staging'"
  exit 1
fi

if [ -d $1 ]; then
  rm -rf $1
fi

if [ -f "sso-$1.zip" ]; then
  rm -f "sso-$1.zip"
fi

tsc
mkdir $1
cp -r dist $1
cp ".env_$1" "$1/.env"
cp -r views $1/dist
cp package.json $1/dist
zip -r sso-$1.zip $1
echo -e "done"

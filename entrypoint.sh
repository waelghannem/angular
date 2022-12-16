#!/bin/sh

FILE_NAME="src/assets/config/environment.json"


#export MY_APP_API_URL="URI TO TEST"


echo 'Replacing in file '$FILE_NAME

echo 'Replacing MY_APP_API_URL by '$MY_APP_API_URL
sed -i "s/MY_APP_API_URL/$MY_APP_API_URL/" ${FILE_NAME}


sh -c "$@"




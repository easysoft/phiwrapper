#!/bin/sh
var=$(type node)
$var || {
    echo 'no node found, cannot run wrapperwrapper'
    exit 1
}

cd /home/gcc/phiwrapper
node wrapperwrapper.js

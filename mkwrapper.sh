#!/bin/sh
type node >&- 2>&- || {
    echo no node found, cannot run wrapperwrapper
    exit 1
}

node wrapperwrapper.js &&
sh build/concat.bat
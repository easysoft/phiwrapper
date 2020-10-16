#!/bin/sh
type node >&- 2>&- || {
    echo no node found, cannot run wrapperwrapper
    exit 1
}

exec node wrapperwrapper.js
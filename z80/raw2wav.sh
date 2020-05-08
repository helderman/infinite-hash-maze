#!/bin/bash

# raw2wav.sh - converts raw audio to a regular audio file
# Needs sox (sudo apt install sox)

sox -r 8k -e unsigned -b 8 -c 1 "$@" pad 0 1

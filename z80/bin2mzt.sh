#!/bin/bash

# bin2mzt.sh - prepends a 128-byte tape header to a Z80 object file
# (assumes start and execute address are 4000h)
# Example: bin2mzt.sh foo.bin > foo.mzt

NAME=${1^^}
NAME=${NAME%.BIN}

echo -ne '\01'
echo -n "$NAME"
echo -ne '\x0D'
printf '%*s' $((16 - ${#NAME}))
printf '%04x' $(wc -c < "$1") | xxd -p -r | dd conv=swab status=none
echo -ne '\0@\0@\0\0\0\0\0\0\0\0'
echo -ne '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
echo -ne '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
echo -ne '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
cat "$1"

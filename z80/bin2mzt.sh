#!/bin/bash

# bin2mzt.sh - prepends a 128-byte tape header to a Z80 object file
# Usage: bin2mzt.sh <object file> <label file>
# Example: bin2mzt.sh foo.bin foo.lbl > foo.mzt

function padding {
	dd bs=$1 conv=sync,ucase status=none
}
function output_word {
	printf '%04x' $1 | xxd -p -r | dd conv=swab status=none
}

NAME="$(basename "$1" .bin)"
LOAD_ADDRESS="$(grep -oiP '^START:\s*equ\s+\$\K\w+' "$2")"
EXEC_ADDRESS="$(grep -oiP '^START:\s*equ\s+\$\K\w+' "$2")"

echo -n $'\1'"${NAME::16}"$'\r' | padding 18
output_word $(wc -c < "$1")
output_word 0x${LOAD_ADDRESS:-1200}
output_word 0x${EXEC_ADDRESS:-1200}
echo -ne '\0' | padding 104

cat "$1"

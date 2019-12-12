#!/bin/bash

# bin2mzt.sh - prepends a 128-byte tape header to a Z80 object file
# Usage: bin2mzt.sh <input file> <load address> <execute address>
# Example: bin2mzt.sh foo.bin 0x4000 0x4000 > foo.mzt

function padding {
	dd bs=$1 conv=sync,ucase status=none
}
function output_word {
	printf '%04x' $1 | xxd -p -r | dd conv=swab status=none
}

NAME="$(basename "$1" .bin)"

echo -n $'\1'"${NAME::16}"$'\r' | padding 18
output_word $(wc -c < "$1")
output_word "$2"
output_word "$3"
echo -ne '\0' | padding 104

cat "$1"

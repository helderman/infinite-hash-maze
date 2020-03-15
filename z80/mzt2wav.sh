#!/bin/bash

# mzt2raw.sh - converts MZ-700 tape file to raw audio
# Output: 8000 samples per second, 8 bits per sample (unsigned), 1 channel

# Temporary file
TMPBYTES=bytes.tmp

# SLUG=00 for traditional gaps (11 and 5.5 seconds)
# SLUG=0 for shorter gaps (1.1 and 0.55 seconds)
SLUG=$2

# A single 8-bit sample in the WAV file, for a duration of 0.125 ms
# (hexadecimal notation)
# Here you can tune volume, polarity, D/C offset
LOW=00
HIGH=FF

# Samples for a single bit
BIT0=$HIGH$HIGH$LOW$LOW
BIT1=$HIGH$HIGH$HIGH$HIGH$LOW$LOW$LOW$LOW

# 2-second delay ('motor on')
function delay {
	printf "$LOW%.0s" {1..16000} | xxd -p -r
}

# Long gap (introduces tape header)
function gapLong {
	eval printf "0%.0s" {1..220$SLUG}
	printf "1%.0s" {1..40}
	printf "0%.0s" {1..40}
	echo 1
}

# Short gap (introduces data)
function gapShort {
	eval printf "0%.0s" {1..110$SLUG}
	printf "1%.0s" {1..20}
	printf "0%.0s" {1..20}
	echo 1
}

function bytes2binary {
	xxd -b | grep -oP ':\K( [01]{8})+'
}

function binary2bytes {
	tr '01 ' XYY | sed "s/X/$BIT0/g;s/Y/$BIT1/g" | xxd -p -r
}

function checksum {
	printf '%04X' "$(xxd -b "$1" | grep -oP ':\K( [01]{8})+' | tr -cd 1 | wc -c)" | tail -c 4 | xxd -p -r
}

function header2bytes {
	dd if="$1" of="$TMPBYTES" bs=128 count=1 status=none
	cat "$TMPBYTES"
	checksum "$TMPBYTES"
	rm "$TMPBYTES"
}

function data2bytes {
	dd if="$1" of="$TMPBYTES" bs=128 skip=1 status=none
	cat "$TMPBYTES"
	checksum "$TMPBYTES"
	rm "$TMPBYTES"
}

function header2binary {
	gapLong
	header2bytes "$1" | bytes2binary
	echo 1
}

function data2binary {
	gapShort
	data2bytes "$1" | bytes2binary
	echo 1
}

delay
header2binary "$1" | binary2bytes
delay
data2binary "$1" | binary2bytes

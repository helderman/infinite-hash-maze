all: maze.mzt

%.mzt: header.bin %.bin
	cat $^ > $@

%.bin: %.txt
	xxd -r -p $^ $@

%.bin: %.z80asm
	z80asm $^ -o $@
	truncate -s512 $@

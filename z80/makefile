all: maze.mzt

%.mzt: %.bin
	./bin2mzt.sh $< 0x4000 0x4000 > $@

%.bin: %.z80asm
	z80asm $^ -o $@

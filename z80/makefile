all: maze.mzt

%.mzt: %.bin
	./bin2mzt.sh $^ > $@

%.bin: %.z80asm
	z80asm $^ -o $@

all: mazegame.wav mazeview.wav testtape.wav

%.wav: %.raw
	./raw2wav.sh $< $@

%.raw: %.mzt
	./mzt2raw.sh $< 0 > $@

%.mzt: %.bin
	./bin2mzt.sh $< 0x4000 0x4000 > $@

%.bin: %.z80asm
	z80asm $^ -o $@

all: mazegame.mzt mazeview.mzt

# MP3 may be too lossy - needs investigation...
%.mp3: %.mzt
	./mzt2wav.sh $< $@

%.wav: %.mzt
	./mzt2wav.sh $< $@

%.mzt: %.bin
	./bin2mzt.sh $< 0x4000 0x4000 > $@

%.bin: %.z80asm
	z80asm $^ -o $@

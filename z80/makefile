all: \
	mazegame.mzt mazeview.mzt mazewalk.mzt smooth.mzt testtape.mzt \
	mazegame.wav mazeview.wav mazewalk.wav smooth.wav testtape.wav

# GNU Make automatically recognizes %.bin and %.raw as intermediate files,
# but not %.lbl. Giving a small hint here.
.INTERMEDIATE: \
	mazegame.lbl mazeview.lbl mazewalk.lbl smooth.lbl testtape.lbl

%.wav: %.raw
	./raw2wav.sh $< $@

%.raw: %.mzt
	./mzt2raw.sh $< 0 > $@

%.mzt: %.bin %.lbl
	./bin2mzt.sh $^ > $@

%.bin %.lbl: %.z80asm
	z80asm $< -o$*.bin -L$*.lbl

clean:
	$(RM) *.bin *.lbl *.mzt *.raw *.wav

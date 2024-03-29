# Infinite Hash Maze
Infinite maze using procedural generation, with zero memory footprint.

The algorithm proposed here is extremely simple:
just place walls between cells based on the outcome of a 1-bit hash function
applied to cell coordinates.

This results in a maze that is not a fully connected graph;
at least a small percentage of all cells will be unreachable.
But for a typical maze game, it is good enough.

The maze is infinite,
but depending on the quality of the hash function,
it will repeat itself after a certain number of cells.

By picking a hash function that is computationally inexpensive,
we can generate a section of the maze on the fly,
so without the need to calculate things up front.

I am using the following hash function:

```
parity(a * x + b * y)
```

where `a` and `b` are constants (preferably moderately big primes), and
`parity(n)` is the number of '1' digits in the binary representation of `n`.
If the result is odd, there will be a wall;
if the result is even, there will be a passage.

In an orthogonal maze, every cell borders four other cells,
but as each border is shared by two cells,
we only need to calculate two borders per cell.
So I define two hash functions, with distinct parameters `a` and `b`:

- `parity(563*x + 761*y)` for the border between cells (x, y-1) and (x, y)
- `parity(1409*x + 397*y)` for the border between cells (x-1, y) and (x, y)

In the implementations listed below, I limited the hash function.
The parity function only looks at the 16 least significant bits,
so the maze will repeat itself after 65,536 cells in either direction.
For a game, that should be more than enough.
(In real-life proportions, such a maze would already be the size of
[Rhode Island](https://en.wikipedia.org/wiki/Rhode_Island).)

If you really want to, then you could use arbitrary-precision integers,
but that also warrants bigger primes `a`, `b`, `c` and `d`
to prevent the maze from repeating itself.

## Scratch implementation

I have used this maze as the basis for my game
[The Search for Dumbledore](https://scratch.mit.edu/projects/224252447/).

It's an adventure that takes place in a relatively small part of the maze,
but the game _does_ give you the freedom to roam around as far as you like.

## JavaScript implementation

Go here to freely browse through the maze:   
[https://helderman.github.io/infinite-hash-maze/html5/maze.html](https://helderman.github.io/infinite-hash-maze/html5/maze.html)

Note: zoom out too far and your web browser may break under the strain.

## Z80 implementation

To demonstrate just how simple and cheap the algorithm really is,
I implemented the maze in Z80 assembly.
The resulting binary is just 149 bytes.
The program stores its state in registers, not in RAM.
It does not even use the stack.
(Of course, it does write to video RAM, to display the maze.)

The program runs on a
[Sharp MZ-700](https://commons.wikimedia.org/wiki/File:Sharp_MZ-700.jpg)
at a reasonable frame rate. Just feed
[mazeview.wav](https://helderman.github.io/infinite-hash-maze/z80/mazeview.wav)
into the computer's tape interface.

It is unlikely you will own the real machine,
so instead please drag and drop
[mazeview.mzt](https://helderman.github.io/infinite-hash-maze/z80/mazeview.mzt)
onto this emulator:   
[https://takamin.github.io/mz700-js/emu.html](https://takamin.github.io/mz700-js/emu.html)

On the real machine, find your way in this 50 fps smooth-scrolling implementation:
[smooth.wav](https://helderman.github.io/infinite-hash-maze/z80/smooth.wav)

The smooth-scrolling implementation uses HBLANK synchronization,
something not supported by most emulators, causing the program to freeze.
Try this instead:
[mazegame.mzt](https://helderman.github.io/infinite-hash-maze/z80/mazegame.mzt)

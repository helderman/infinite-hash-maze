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

I have used this maze as the basic for my game
[The Search for Dumbledore](https://scratch.mit.edu/projects/224252447/).
There, the hash function was slightly restricted;
the parity function only looked at the 16 least significant bits,
so the maze would repeat itself after 65,536 cells in either direction.
But that was already more than enough;
the whole game was set in a relatively tiny part of the maze.

Go here to browse through the entire maze:   
https://helderman.github.io/infinite-hash-maze/html5/maze.html

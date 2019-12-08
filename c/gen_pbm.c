/* Generate .PBM file (text-based bitmap; GIMP understands it) */

#include <stdio.h>

#define SIZE	1000

#define X_TOP	563
#define Y_TOP	761
#define X_LEFT	1409
#define Y_LEFT	397

#define parity	__builtin_parity	/* GCC-specific */

static int left(int x, int y)
{
	return parity(x * X_LEFT + y * Y_LEFT);
}

static int top(int x, int y)
{
	return parity(x * X_TOP + y * Y_TOP);
}

int main()
{
	int y;
	printf("P1\n%d %d", 2 * SIZE, 2 * SIZE);
	for (y = -SIZE/2; y < SIZE/2; y++)
	{
		int x, c = '\n';
		for (x = -SIZE/2; x < SIZE/2; x++)
		{
			int t = top(x, y);
			printf("%c%d %d", c, t || left(x, y) || top(x-1, y) || left(x, y-1), t);
			c = ' ';
		}
		c = '\n';
		for (x = -SIZE/2; x < SIZE/2; x++)
		{
			int l = left(x, y);
			printf("%c%d %d", c, l, l && top(x, y) && left(x+1, y) && top(x, y+1));
			c = ' ';
		}
	}
	putchar('\n');
	return 0;
}

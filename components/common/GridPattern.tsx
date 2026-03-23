'use client';

import { cn } from '@/lib/utils';

interface GridPatternProps {
  className?: string;
  variant?: 'light' | 'dark';
  rows?: number;
  cols?: number;
  cellSize?: number;
  gap?: number;
}

/**
 * Architectural blueprint grid pattern.
 *
 * Uses a hardcoded matrix to place fills precisely — avoids the chaotic
 * look of hash-based randomness. Each cell is one of:
 *   0 = border only (thin outline)
 *   1 = border + navy fill aligned to an edge
 *   _ = skip (empty space)
 *
 * The fill position within a cell is determined by (row+col) % 4 so
 * fills naturally stagger across the grid.
 */

// prettier-ignore
const PATTERN_MATRIX: (0 | 1 | null)[][] = [
  [0,    0,    0,    null, 0   ],
  [null, 0,    null, 0,    0   ],
  [0,    null, 0,    0,    null],
  [0,    0,    null, 1,    1   ],
  [null, 0,    0,    0,    null],
  [0,    null, null, 0,    0   ],
];

type FillEdge = { x: number; y: number; w: number; h: number };

const FILL_EDGES: FillEdge[] = [
  { x: 0, y: 0, w: 0.45, h: 0.7 },    // top-left block
  { x: 0.55, y: 0, w: 0.45, h: 0.55 }, // top-right block
  { x: 0, y: 0.45, w: 0.6, h: 0.55 },  // bottom-left block
  { x: 0.4, y: 0.4, w: 0.6, h: 0.6 },  // bottom-right block
];

function getFillEdge(row: number, col: number): FillEdge {
  return FILL_EDGES[(row + col) % FILL_EDGES.length];
}

export function GridPattern({
  className,
  variant = 'light',
  rows = 4,
  cols = 5,
  cellSize = 48,
  gap = 6,
}: GridPatternProps) {
  const totalW = cols * (cellSize + gap) - gap;
  const totalH = rows * (cellSize + gap) - gap;

  const borderColor = variant === 'light' ? '#CBD5E1' : 'rgba(255,255,255,0.12)';
  const fillColor = variant === 'light' ? '#1B2A4A' : 'rgba(255,255,255,0.15)';

  const cells: React.ReactNode[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Look up from the repeating matrix
      const matrixRow = r % PATTERN_MATRIX.length;
      const matrixCol = c % (PATTERN_MATRIX[matrixRow]?.length ?? cols);
      const cellType = PATTERN_MATRIX[matrixRow]?.[matrixCol];

      if (cellType === null || cellType === undefined) continue;

      const x = c * (cellSize + gap);
      const y = r * (cellSize + gap);

      // Border rect
      cells.push(
        <rect
          key={`b-${r}-${c}`}
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill="none"
          stroke={borderColor}
          strokeWidth={0.75}
        />
      );

      // Fill block for type 1
      if (cellType === 1) {
        const edge = getFillEdge(r, c);
        cells.push(
          <rect
            key={`f-${r}-${c}`}
            x={x + edge.x * cellSize}
            y={y + edge.y * cellSize}
            width={edge.w * cellSize}
            height={edge.h * cellSize}
            fill={fillColor}
          />
        );
      }
    }
  }

  return (
    <svg
      className={cn('pointer-events-none select-none', className)}
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
}

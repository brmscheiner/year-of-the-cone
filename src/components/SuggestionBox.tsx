const HREF = 'https://www.patreon.com/CaseyClapp';

const BOX_WIDTH = 42;
const BOX_HEIGHT = 26;
const DEPTH_X = 7;
const DEPTH_Y = 9;
const PADDING = 6;
const SLOT_WIDTH = 16;
const SLOT_DEPTH = 2.5;

const LEFT = PADDING;
const RIGHT = PADDING + BOX_WIDTH;
const TOP = PADDING + DEPTH_Y;
const BOTTOM = TOP + BOX_HEIGHT;

const BACK_LEFT = LEFT + DEPTH_X;
const BACK_RIGHT = RIGHT + DEPTH_X;
const BACK_TOP = TOP - DEPTH_Y;
const BACK_BOTTOM = BOTTOM - DEPTH_Y;

const SVG_WIDTH = BACK_RIGHT + PADDING;
const SVG_HEIGHT = BOTTOM + PADDING;

const SLOT_LEFT = 2 + LEFT + (BOX_WIDTH - SLOT_WIDTH) / 2;
const SLOT_RIGHT = SLOT_LEFT + SLOT_WIDTH;
const SLOT_BACK_LEFT = SLOT_LEFT + (DEPTH_X * SLOT_DEPTH) / DEPTH_Y;
const SLOT_BACK_RIGHT = SLOT_RIGHT + (DEPTH_X * SLOT_DEPTH) / DEPTH_Y;
const SLOT_FRONT_Y = TOP - (DEPTH_Y - SLOT_DEPTH) / 2;
const SLOT_BACK_Y = SLOT_FRONT_Y - SLOT_DEPTH;

const pts = (...pairs: number[][]) => pairs.map((p) => p.join(',')).join(' ');

export function SuggestionBox() {
  return (
    <div className="flex justify-center">
      <a
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="suggestion-box-btn group mt-4 flex w-fit cursor-pointer flex-col items-center gap-2 p-3 transition-opacity hover:opacity-75"
        style={{ textDecoration: 'none', color: 'inherit', borderBottom: 'none' }}
      >
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points={pts(
              [RIGHT, TOP],
              [RIGHT, BOTTOM],
              [BACK_RIGHT, BACK_BOTTOM],
              [BACK_RIGHT, BACK_TOP],
            )}
            fill="var(--color-stone-deep)"
            stroke="var(--color-amber-dim)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points={pts([LEFT, TOP], [RIGHT, TOP], [RIGHT, BOTTOM], [LEFT, BOTTOM])}
            fill="var(--color-stone-deep)"
            stroke="var(--color-amber)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points={pts([LEFT, TOP], [BACK_LEFT, BACK_TOP], [BACK_RIGHT, BACK_TOP], [RIGHT, TOP])}
            fill="var(--color-stone-deep)"
            stroke="var(--color-amber)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <polygon
            points={pts(
              [SLOT_LEFT, SLOT_FRONT_Y],
              [SLOT_RIGHT, SLOT_FRONT_Y],
              [SLOT_BACK_RIGHT, SLOT_BACK_Y],
              [SLOT_BACK_LEFT, SLOT_BACK_Y],
            )}
            fill="var(--color-stone-void)"
            stroke="var(--color-amber-dim)"
            strokeWidth="1"
          />
        </svg>
        <span className="dim text-xs tracking-widest">SUGGESTION BOX</span>
      </a>
    </div>
  );
}

import { useId } from "react";

/* The FM Icons mark: five coloured dots on an "F", joined by soft gradient bars.
   Top bar: purple → green. Middle bar: pink → orange. Stem: purple → pink → blue.
   The same drawing lives in public/favicon.svg. */

const dot = {
  topLeft: { x: 11, y: 9, c: "#9b3dff" },
  topRight: { x: 30, y: 9, c: "#22c55e" },
  midLeft: { x: 11, y: 21, c: "#ff3d8b" },
  midRight: { x: 25, y: 21, c: "#ff9f0a" },
  foot: { x: 11, y: 33, c: "#1e8cff" },
};

type Bar = { from: keyof typeof dot; to: keyof typeof dot; bend: number };

// `bend` pushes the middle of the bar up (negative) or down (positive), for the soft arcs
const bars: Bar[] = [
  { from: "topLeft", to: "topRight", bend: -2.5 },
  { from: "midLeft", to: "midRight", bend: 2.5 },
  { from: "topLeft", to: "midLeft", bend: 0 },
  { from: "midLeft", to: "foot", bend: 0 },
];

export function LogoMark({ size = 32, className }: { size?: number | string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 40 42" fill="none" aria-hidden="true" className={className}>
      <defs>
        {bars.map((b, i) => {
          const a = dot[b.from];
          const z = dot[b.to];
          return (
            <linearGradient key={i} id={`${id}-${i}`} gradientUnits="userSpaceOnUse" x1={a.x} y1={a.y} x2={z.x} y2={z.y}>
              <stop offset="0" stopColor={a.c} />
              <stop offset="1" stopColor={z.c} />
            </linearGradient>
          );
        })}
      </defs>

      {/* Bars sit behind the dots, slightly see-through like coloured glass */}
      <g opacity="0.55" strokeWidth="7" strokeLinecap="round">
        {bars.map((b, i) => {
          const a = dot[b.from];
          const z = dot[b.to];
          const mx = (a.x + z.x) / 2;
          const my = (a.y + z.y) / 2 + b.bend;
          return <path key={i} d={`M${a.x} ${a.y}Q${mx} ${my} ${z.x} ${z.y}`} stroke={`url(#${id}-${i})`} />;
        })}
      </g>

      {Object.values(dot).map((d) => (
        <circle key={d.c} cx={d.x} cy={d.y} r="5" fill={d.c} />
      ))}
    </svg>
  );
}

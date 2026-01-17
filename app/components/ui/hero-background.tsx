import React from "react";

export function HeroBackground() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none opacity-15 dark:opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage: `
            radial-gradient(ellipse at center, black 10%, transparent 80%),
            repeating-linear-gradient(to right, black 0 3px, transparent 3px 10px),
            repeating-linear-gradient(to bottom, black 0 3px, transparent 3px 10px)
          `,
          WebkitMaskComposite: "source-in, source-over",
          color: "inherit"
        }}
      />
    </>
  );
}

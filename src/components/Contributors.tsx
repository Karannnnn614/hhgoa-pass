"use client";

import { useState } from "react";

/**
 * Footer credits with a hover/tap tooltip over each avatar.
 *
 * Avatars come from github.com/<handle>.png — GitHub serves those directly,
 * so there is no API call, no token, and no rate limit to worry about.
 */

type Person = { handle: string; name: string };

const AUTHOR: Person = { handle: "Karannnnn614", name: "Karan Mundre" };

const CONTRIBUTORS: Person[] = [
  { handle: "VaibHUB17", name: "Vaibhav Shivhare" },
  { handle: "Ankur2606", name: "Bhavya Pratap Singh Tomar" },
];

function Avatar({ person }: { person: Person }) {
  // Tooltips are hover-only on desktop; touch devices need the tap to work too.
  const [open, setOpen] = useState(false);

  return (
    <a
      href={`https://github.com/${person.handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onTouchStart={() => setOpen((value) => !value)}
      aria-label={`${person.name} (@${person.handle}) on GitHub`}
    >
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded-xl border border-cream/15 bg-ink/95 px-3 py-2 text-center shadow-xl transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <span className="block text-xs font-bold text-cream">{person.name}</span>
        <span className="block text-[10px] font-semibold text-orange">@{person.handle}</span>
      </span>

      {/* eslint-disable-next-line @next/next/no-img-element -- avatars are remote and unoptimised by design */}
      <img
        src={`https://github.com/${person.handle}.png?size=160`}
        alt={person.name}
        width={56}
        height={56}
        loading="lazy"
        className="h-14 w-14 rounded-full border-2 border-cream/20 object-cover transition duration-200 group-hover:-translate-y-1 group-hover:border-orange group-focus-visible:-translate-y-1 group-focus-visible:border-orange"
      />
    </a>
  );
}

export default function Contributors() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40">
          Built by
        </span>
        <Avatar person={AUTHOR} />
      </div>

      <div className="hidden h-16 w-px bg-cream/10 sm:block" />

      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40">
          Contributors
        </span>
        <div className="flex items-center gap-3">
          {CONTRIBUTORS.map((person) => (
            <Avatar key={person.handle} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
}

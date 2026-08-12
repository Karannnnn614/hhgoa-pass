"use client";

import { useState } from "react";

/**
 * Footer credits with a hover/tap tooltip over each avatar.
 *
 * Avatars come from github.com/<handle>.png — GitHub serves those directly,
 * so there is no API call, no token, and no rate limit to worry about.
 */

type Person = { handle: string; name: string };

const TEAM: Person[] = [
  { handle: "Karannnnn614", name: "Karan Mundre" },
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
        src={`https://github.com/${person.handle}.png?size=120`}
        alt={person.name}
        width={32}
        height={32}
        loading="lazy"
        // -ml-2 on all but the first overlaps them into a stack; hover lifts
        // the avatar clear of its neighbours.
        className="h-8 w-8 rounded-full border-2 border-ink bg-ink object-cover ring-1 ring-cream/20 transition duration-200 group-hover:-translate-y-1 group-hover:ring-orange group-focus-visible:-translate-y-1 group-focus-visible:ring-orange"
      />
    </a>
  );
}

export default function Contributors() {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 align-middle">
      {/* Label is the first thing to go when a phone runs out of width. */}
      <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-cream/40 min-[380px]:inline sm:text-xs">
        Shipped by
      </span>
      <span className="flex items-center">
        {TEAM.map((person, index) => (
          <span
            key={person.handle}
            className={index > 0 ? "-ml-2" : ""}
            // First avatar sits fully on top; each later one tucks behind the
            // previous. Hovering any of them raises it above the rest.
            style={{ zIndex: TEAM.length - index }}
          >
            <Avatar person={person} />
          </span>
        ))}
      </span>
    </span>
  );
}

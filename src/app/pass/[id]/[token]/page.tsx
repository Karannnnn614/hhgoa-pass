"use client";

import { use } from "react";
import PublicPassView from "@/components/PublicPassView";
import { decodePassToken } from "@/lib/passLink";

export default function CompactPublicPassPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>;
}) {
  const { id, token } = use(params);
  const fields = decodePassToken(token) ?? {
    firstName: "BUILDER",
    lastName: "",
    profileTitle: "Hacker House Goa 2026",
    teamName: "",
    xUsername: "",
  };

  return <PublicPassView passId={id} fields={fields} />;
}

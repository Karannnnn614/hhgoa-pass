import type { Metadata } from "next";
import PublicPassView from "@/components/PublicPassView";
import { decodePassToken, type PublicPassFields } from "@/lib/passLink";
import { siteUrl } from "@/lib/siteUrl";

type Params = Promise<{ id: string; token: string }>;

function fallbackFields(): PublicPassFields {
  return {
    firstName: "BUILDER",
    lastName: "",
    profileTitle: "Hacker House Goa 2026",
    teamName: "",
    xUsername: "",
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id, token } = await params;
  const fields = decodePassToken(token) ?? fallbackFields();
  const query = new URLSearchParams({
    n: [fields.firstName, fields.lastName].filter(Boolean).join(" "),
    t: fields.profileTitle,
    g: fields.teamName,
    h: fields.xUsername,
  });
  const og = `${siteUrl()}/api/og?${new URLSearchParams({ ...Object.fromEntries(query), p: id })}`;
  const name = [fields.firstName, fields.lastName].filter(Boolean).join(" ") || "Builder";

  return {
    title: `${name} — Builder Pass · HH Goa 2026`,
    description: `${name}'s Hacker House Goa 2026 Builder Pass`,
    openGraph: {
      title: `${name} — Builder Pass`,
      description: "Hacker House Goa 2026 · Build. Ship. Ascend.",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Builder Pass`,
      description: "Hacker House Goa 2026 · Build. Ship. Ascend.",
      images: [og],
    },
    alternates: { canonical: `${siteUrl()}/pass/${id}/${token}` },
  };
}

export default async function CompactPublicPassPage({
  params,
}: {
  params: Params;
}) {
  const { id, token } = await params;
  const fields = decodePassToken(token) ?? fallbackFields();

  return <PublicPassView passId={id} fields={fields} />;
}

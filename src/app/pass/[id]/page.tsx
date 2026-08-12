"use client";

import { use } from "react";
import PublicPassView from "@/components/PublicPassView";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getParam = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) || "";

export default function LegacyPublicPassPage({ params, searchParams }: PageProps) {
  const { id } = use(params);
  const query = use(searchParams);

  return (
    <PublicPassView
      passId={id || "HH26-XXX-XXXX"}
      fields={{
        firstName: getParam(query.fn) || "",
        lastName: getParam(query.ln) || "",
        profileTitle: getParam(query.t) || "Software Engineer",
        teamName: getParam(query.tm) || "",
        xUsername: getParam(query.x) || "",
      }}
    />
  );
}

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
      passId={id || "HH26-BLD-1047"}
      fields={{
        firstName: getParam(query.fn) || "VAIBHAV",
        lastName: getParam(query.ln) || "SHIVHARE",
        profileTitle: getParam(query.t) || "Builder • Software Engineer • Rust",
        teamName: getParam(query.tm) || "LEVIATHON",
        xUsername: getParam(query.x) || "sukuna1709",
      }}
    />
  );
}

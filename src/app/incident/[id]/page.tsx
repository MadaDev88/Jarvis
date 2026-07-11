import { incidents } from "@/data/incidents";
import IncidentPageClient from "./IncidentPageClient";

export function generateStaticParams() {
  return incidents.map((i) => ({ id: i.id }));
}

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IncidentPageClient id={id} />;
}

"use client";

import { useRouter } from "next/navigation";
import { incidents } from "@/data/incidents";
import IncidentDetail from "@/components/incidents/IncidentDetail";
import { ArrowLeft, Map } from "lucide-react";
import Link from "next/link";

export default function IncidentPageClient({ id }: { id: string }) {
  const router = useRouter();
  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    return (
      <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Incident Not Found</h1>
          <p className="text-white/50">
            No incident matching &ldquo;{id}&rdquo; was found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors"
          >
            <Map size={14} />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Map
          </Link>
          <Link
            href={`/?incident=${incident.id}`}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-colors"
          >
            <Map size={14} />
            View on Map
          </Link>
        </div>
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden">
          <IncidentDetail
            incident={incident}
            onClose={() => router.push("/")}
            onFlyTo={() => router.push(`/?incident=${incident.id}`)}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AnimatedMeshBackground = dynamic(
  () => import("@/components/generic/AnimatedMeshBackground"),
  { ssr: false }
);

export default function MeshBackgroundClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;            // ⟵ Don't render during hydration
  return <AnimatedMeshBackground />;
}

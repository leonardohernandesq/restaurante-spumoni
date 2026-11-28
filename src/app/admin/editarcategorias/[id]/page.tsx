"use client";

import { useParams } from "next/navigation";
import { CategoriaForm } from "@/components/categoria/CategoriaForm";

export default function EditarCategoriaPage() {
  const params = useParams();
  return <CategoriaForm id={parseInt(params.id as string)} />;
}

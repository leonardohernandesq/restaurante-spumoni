// app/alterar-senha/page.tsx
import ResetPasswordForm from "./ResetPasswordForm";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AlterarSenhaPage({ searchParams }: PageProps) {
  // Await the searchParams promise
  const resolvedParams = await searchParams;
  const code =
    typeof resolvedParams.code === "string" ? resolvedParams.code : "";

  if (!code) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-bold">
          Token não encontrado ou inválido!
        </p>
      </div>
    );
  }

  return <ResetPasswordForm code={code} />;
}

// app/alterar-senha/page.tsx
import ResetPasswordForm from "./ResetPasswordForm";

export default function AlterarSenhaPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = searchParams.code || "";
  return <ResetPasswordForm code={code} />;
}

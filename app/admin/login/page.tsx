import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-lime mb-2 text-center">
        CrossNation
      </p>
      <h1 className="font-display text-2xl font-semibold uppercase text-center mb-8">
        Club Login
      </h1>
      <LoginForm />
    </div>
  );
}

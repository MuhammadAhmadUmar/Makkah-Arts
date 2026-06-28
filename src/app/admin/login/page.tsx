import { loginAdmin } from "@/app/admin/actions";

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md border border-border bg-white p-8">
        <h1 className="font-serif text-2xl">Admin Login</h1>
        <p className="mt-2 text-sm text-muted">Makkah Arts dashboard</p>

        <form action={loginAdmin} className="mt-8 space-y-2">
          <div>
            <label htmlFor="email" className="text-xs tracking-widest text-muted uppercase">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-2 w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs tracking-widest text-muted uppercase">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          {params.error && (
            <p className="text-sm text-red-600">{decodeURIComponent(params.error)}</p>
          )}
          <button
            type="submit"
            className="w-full bg-foreground py-3 text-xs tracking-widest text-background uppercase hover:bg-accent"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

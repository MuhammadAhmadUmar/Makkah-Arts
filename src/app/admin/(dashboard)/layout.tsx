import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-border bg-white">
        <div className="container-main flex h-14 items-center justify-between">
          <Link href="/admin" className="font-serif text-lg">
            Makkah Arts Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/admin/products" className="hover:text-accent">
              Products
            </Link>
            <Link href="/admin/orders" className="hover:text-accent">
              Orders
            </Link>
            <Link href="/" className="text-muted hover:text-foreground">
              View Store
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="text-muted hover:text-foreground">
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="container-main py-8">{children}</div>
    </div>
  );
}

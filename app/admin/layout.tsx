import { Header } from "../../components/layout/header";
import { Sidebar } from "../../components/layout/sidebar";
import { DeviceDetector } from "../../components/layout/DeviceDetector";
import { requireAdmin } from "../../src/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DeviceDetector
        mobileComponent={<Sidebar user={user} />}
        desktopComponent={<Header user={user} />}
      />
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4">{children}</div>
      </main>
    </div>
  );
}

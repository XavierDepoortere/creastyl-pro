import { redirect } from "next/navigation";
import { getCurrentUser } from "../src/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue dans le système d'administration
          </h1>

          {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
            <div className="flex flex-col gap-4 mt-4">
              <h2 className="text-xl font-semibold">
                Actions d'administration
              </h2>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/admin/invitations">Gérer les invitations</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/users">Gérer les utilisateurs</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
            Bienvenue dans le système dadministration
          </h1>
        </div>
      </div>
    </div>
  );
}

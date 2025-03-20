"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Users,
  Settings,
  Home,
  LogOut,
  Info,
  Caravan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: any;
}

export function Sidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
    { name: "Paramètres", href: "/settings", icon: Settings },
    { name: "Congés", href: "/holiday", icon: Caravan },
  ];

  return (
    <>
      {/* Bouton pour ouvrir la sidebar sur mobile */}
      <div className="fixed top-4 left-4 ">
        <Menu
          size="icon"
          onClick={toggleSidebar}
          className="h-5 w-5 md:hidden"
        />
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out  
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:w-64 flex flex-col
      `}
      >
        {/* Header de la sidebar - fixe en haut */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-lg">Admin System</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden "
          ></Button>
        </div>

        {/* Profil utilisateur - fixe sous le header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-medium">{user.name || "Utilisateur"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Contenu défilable - prend l'espace restant */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          {/* Navigation - défile si nécessaire */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Déconnexion - reste visible en bas */}
          <div className="p-4 border-t mt-auto w-full flex-col items-center">
            <div className="flex items-center mb-4 gap-2">
              <Info className="mr-2 h-4 w-4 " />
              <span>Information légales</span>
            </div>
            <div
              className="flex items-center mb-4 gap-2"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Déconnexion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer la sidebar quand elle est ouverte sur mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

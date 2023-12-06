"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { getUser } from "@/lib/app/get-user";

export function SiteHeader() {
  const [user, setUser] = useState(null);
  const scrolled = useScroll(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur transition-all",
        scrolled && "bg-background/50 "
      )}
    >
      <div className="container flex h-20 items-center">
        <MainNav />
        <div className="hidden flex-1 items-center justify-between space-x-2 md:flex md:justify-end">
          {user && <span>IGC: {user.igc}</span>}
          <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
            Dashboard
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

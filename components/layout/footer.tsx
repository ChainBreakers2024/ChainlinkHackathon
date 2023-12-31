import { HTMLAttributes } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { LinkComponent } from "../shared/link-component"
import { buttonVariants } from "../ui/button"

export function Footer({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const classes = cn(
    className,
    "flex flex-col items-center justify-center px-4 py-6"
  )

  return (
    <footer className={classes} {...props}>
      <h2>{siteConfig.title}</h2>
      <Link
        href="https://github.com/ChainBreakers2024"
        target="_blank"
        rel="noreferrer noopenner"
        className={cn(buttonVariants({ variant: "link", size: "sm" }))}
      >
        Built by Yusuf Aykın | Rauf Şen | Emirhan Sarı      </Link>
      <div className="mt-2 flex items-center space-x-2">
       
      </div>
    </footer>
  )
}

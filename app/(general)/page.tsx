"use client"
import Image from "next/image"
import Link from "next/link"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { LuBook } from "react-icons/lu"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderCTA,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"
import { CopyButton } from "@/components/shared/copy-button"
import { depositTransaction } from "@/lib/contract/deposit"

export default function HomePage() {
  return (
    <div className="container relative mt-20 px-0">
      <PageHeader className="pb-8">
        <Image
          src="/logo-gradient.png"
          alt="ChainBreakers Logo"
          width={512}
          height={512}
          className="h-20 w-20 rounded-2xl"
        />
        <PageHeaderHeading>Chain Breakers</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
        <PageHeaderCTA>
          <Link
            href={"https://github.com/ChainBreakers2024/ChainlinkHackathon"}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonVariants({ variant: "secondary" })}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            Github
          </Link>
          
        </PageHeaderCTA>
        <PageHeaderCTA>
          <CopyButton value="chainbreakers.cloud">
            <span className="text-xs sm:text-base">
              chainbreakers.cloud
            </span>
          </CopyButton>
        </PageHeaderCTA>
      </PageHeader>
    </div>
  )
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Site
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
interface SiteConfig {
  name: string
  title: string
  emoji: string
  description: string
  localeDefault: string
  links: {
    docs: string
    discord: string
    twitter: string
    github: string
  }
}

export const SITE_CANONICAL = "https://chainbreakers.cloud"

export const siteConfig: SiteConfig = {
  name: "ChainBreakers",
  title: "ChainBreakers - Web3 App",
  emoji: "⚡",
  description:
    "Break the chain with ChainBreakers.",
  localeDefault: "en",
  links: {
    docs: "https://forms.gle/hD1rBufG1VP1mUYi9",
    discord: "https://discord.com",
    twitter: "https://twitter.com",
    github: "https://github.com/ChainBreakers2024/ChainlinkHackathon",
  },
}

export const DEPLOY_URL =
  "https://vercel.com"

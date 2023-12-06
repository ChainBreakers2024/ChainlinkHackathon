import { HtmlHTMLAttributes } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const WalletConnect = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={className} {...props}>
    <ConnectButton
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "avatar",
        }}
        chainStatus={{
          smallScreen: "icon",
          largeScreen: "icon",
        }}
      />    </span>
  )
}
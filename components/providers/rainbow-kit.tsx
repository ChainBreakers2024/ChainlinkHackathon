"use client"

import "@rainbow-me/rainbowkit/styles.css"

import { ReactNode, useMemo, useRef, useState } from "react"
import {
  AuthenticationStatus,
  connectorsForWallets,
  createAuthenticationAdapter,
  darkTheme,
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { createConfig, WagmiConfig } from "wagmi"
import { SessionProvider } from 'next-auth/react';
import { chains, publicClient, webSocketPublicClient } from "@/config/networks"
import { siteConfig } from "@/config/site"
import { useColorMode } from "@/lib/state/color-mode"
import { SiweMessage } from "siwe"

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      rainbowWallet({ chains }),
      coinbaseWallet({ chains, appName: siteConfig.name }),
      walletConnectWallet({ chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})


export function RainbowKit({ children }: { children: ReactNode }) {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch('/api/siwe/nonce');
        return await response.text();
      },
  
      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Etherum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
      },
  
      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },
  
      verify: async ({ message, signature }) => {
        verifyingRef.current = true;
  
        try {
          const response = await fetch('/api/siwe/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
          });
  
          const authenticated = Boolean(response.ok);
  
          if (authenticated) {
            setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
            dispatchEvent(new Event("verified"))
          }
  
          return authenticated;
        } catch (error) {
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },
  
      signOut: async () => {
        setAuthStatus('unauthenticated');
        await fetch('/api/siwe/logout');
      },
    });
  }, []);
  const [colorMode] = useColorMode()
  return (
    <WagmiConfig config={wagmiConfig}>
        <RainbowKitAuthenticationProvider
            adapter={authAdapter}
            status={authStatus}
          >
          <RainbowKitProvider
            chains={chains}
            theme={colorMode == "dark" ? darkTheme() : lightTheme()}
          >
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  )
}

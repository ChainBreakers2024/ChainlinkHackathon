"use client"

import "@rainbow-me/rainbowkit/styles.css"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import {
  AuthenticationStatus,
  connectorsForWallets,
  createAuthenticationAdapter,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, mainnet, sepolia, WagmiConfig } from "wagmi"
import { publicClient, webSocketPublicClient } from "@/config/networks"
import { useColorMode } from "@/lib/state/color-mode"
import { SiweMessage } from "siwe"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://ethereum-sepolia.publicnode.com`,
      }),
    }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: '291287d6b621d3de43d19b19edd3286f',
  chains
});

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
  
  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const response = await fetch('/api/app/user');
        const json = await response.json();
        setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
      } catch (_error) {
        setAuthStatus('unauthenticated');
      } finally {
        fetchingStatusRef.current = false;
      }
    };
    fetchStatus();

    window.addEventListener('focus', fetchStatus);
    return () => window.removeEventListener('focus', fetchStatus);
  }, []);

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
          statement: 'Sign in with Etherum to t2e app.',
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
            body: JSON.stringify({ message, "signature": signature }),
          });
  
          const authenticated = Boolean(response.ok);

          if (authenticated) {
            setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
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
  console.log(colorMode)
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

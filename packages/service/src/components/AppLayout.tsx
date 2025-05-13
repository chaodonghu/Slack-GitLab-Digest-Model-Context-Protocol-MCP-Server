"use client";

// For remote modules
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";
import * as emotion from "@emotion/react";
import dynamic from "next/dynamic";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { CurrentAccountIdProvider } from "@zapier/identity";

import { UniversalLayout } from "@zapier/universal-layout";

import {
  Layout as MarketingLayout,
  loadMarketingSiteLayoutComponents,
  withSSR,
  MARKETING_SITE_LAYOUT_STYLESHEET,
} from "@zapier/marketing-site-layout";

interface Props {
  children: ReactNode;
}

const { Header, Footer } = withSSR(dynamic, () => {
  return loadMarketingSiteLayoutComponents({
    dependencies: {
      react,
      "react/jsx-runtime": jsxRuntime,
      "@emotion/react": emotion,
    },
  });
});

export default function AppLayout({ children }: Props) {
  const pathname = usePathname();
  const isInApp = pathname?.startsWith("/app/");

  const Layout = isInApp ? (
    <UniversalLayout
      currentUrl={pathname || ""}
      mainContentId="templates"
      trackEvent={() => {}}
      showSimplifiedFooter={isInApp}
      shouldSidebarBeInitiallyCollapsed={true}
    >
      {children}
      <Analytics />
      <SpeedInsights />
    </UniversalLayout>
  ) : (
    <>
      <link rel="stylesheet" href={MARKETING_SITE_LAYOUT_STYLESHEET} />
      <MarketingLayout header={Header} footer={Footer}>
        {children}
        <Analytics />
        <SpeedInsights />
      </MarketingLayout>
    </>
  );

  return <CurrentAccountIdProvider>{Layout}</CurrentAccountIdProvider>;
}

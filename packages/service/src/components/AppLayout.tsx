"use client";

// For remote modules
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";
import * as emotion from "@emotion/react";
import dynamic from "next/dynamic";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SplitFactoryProvider } from "@splitsoftware/splitio-react";

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

import {
  FullStory,
  TrackRouting,
  initializeDatadogRum,
  initializeSentry,
  nextJsReportWebVitals,
} from "../observability";

import { isDatadog } from "../utils/isDatadog";

interface Props {
  children: ReactNode;
}

const shouldInitSentry = !isDatadog();
if (shouldInitSentry) {
  initializeSentry({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
    commitHash: process.env.NEXT_PUBLIC_COMMIT_SHA || "",
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "",
  });
}

// Configure Split to accessing feature toggles client-side in the browser.
const sdkConfig: SplitIO.IBrowserSettings = {
  core: {
    authorizationKey: process.env.SPLIT_CLIENT_API_KEY || "localhost",
    key: "user_id",
  },
  features: {
    SayHello: "on",
  },
};

const { Header, Footer } = withSSR(dynamic, () => {
  return loadMarketingSiteLayoutComponents({
    dependencies: {
      react,
      "react/jsx-runtime": jsxRuntime,
      "@emotion/react": emotion,
    },
  });
});

// Measure and report web vitals that Next.js tracks to Datadog.
// See: https://nextjs.org/docs/advanced-features/measuring-performance
initializeDatadogRum();
export const reportWebVitals = nextJsReportWebVitals;

export default function AppLayout({ children }: Props) {
  const pathname = usePathname();
  const isInApp = pathname?.startsWith("/app/");

  // TODO - If this is a logged-in page, user needs to be fetched here using whatever
  // data fetching method you prefer. FullStory requires accountId, fullName, and email fields
  const user = undefined;

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
      <FullStory user={user} />
    </UniversalLayout>
  ) : (
    <>
      <link rel="stylesheet" href={MARKETING_SITE_LAYOUT_STYLESHEET} />
      <MarketingLayout header={Header} footer={Footer}>
        {children}
        <Analytics />
        <SpeedInsights />
        <FullStory user={user} />
      </MarketingLayout>
    </>
  );

  return (
    <CurrentAccountIdProvider>
      <TrackRouting>
        <SplitFactoryProvider config={sdkConfig}>{Layout}</SplitFactoryProvider>
      </TrackRouting>
    </CurrentAccountIdProvider>
  );
}

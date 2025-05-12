import { datadogRum } from "@datadog/browser-rum";
import type { NextWebVitalsMetric } from "next/app";

import { isProduction } from "../utils/environment";

const shouldTrackToDatadog = isProduction;

export function initializeDatadogRum() {
  // Don't initialize during SSR
  if (typeof window === "undefined") {
    return;
  }

  const applicationId = process.env.NEXT_PUBLIC_DATADOG_APP_ID;
  const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;
  if (!applicationId || !clientToken) {
    // eslint-disable-next-line no-console
    console.info(
      "Datadog RUM not initialized: missing applicationId or clientToken.",
    );
    return;
  }

  if (!shouldTrackToDatadog) {
    // eslint-disable-next-line no-console
    console.info(
      "Datadog RUM not initialized: not in a production environment.",
    );
    return;
  }

  // See https://docs.datadoghq.com/real_user_monitoring/installation/?tab=us#initialization-parameters
  // for more information on what these individual parameters do.
  datadogRum.init({
    applicationId,
    clientToken,
    traceSampleRate: 10,
    service: "zhwdailysummarizer",
    env: process.env.NEXT_PUBLIC_VERCEL_ENV,
    version: process.env.NEXT_PUBLIC_COMMIT_SHA,
    // Enables distributed tracing for any `*.zapier.com` or `*.zapier-staging.com` APIs.
    // See: https://docs.datadoghq.com/real_user_monitoring/connect_rum_and_traces/?tab=browserrum
    allowedTracingUrls: [/https:\/\/(.*\.)?zapier(-staging)?\.com/],
    sessionSampleRate: 100,
    sessionReplaySampleRate: 10,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });
}

const vitalsMapper: { [key: string]: string } = {
  // Length of time it takes for the page to start and finish hydrating (in ms)
  "Next.js-hydration": "nextJsHydration",
  // Length of time it takes for a page to start rendering after a route change (in ms)
  "Next.js-route-change-to-render": "nextJsRouteChangeToRender",
  // Length of time it takes for a page to finish render after a route change (in ms)
  "Next.js-render": "nextJsRender",

  // Web Vitals - https://web.dev/vitals/
  CLS: "cumulativeLayoutShift",
  FCP: "firstContentfulPaint",
  FID: "firstInputDelay",
  INP: "interactionToNextPaint",
  LCP: "largestContentfulPaint",
  TTFB: "timeToFirstByte",
};

// Measure and report web vitals that Next.js tracks to Datadog.
// See: https://nextjs.org/docs/advanced-features/measuring-performance
export function nextJsReportWebVitals(metric: NextWebVitalsMetric) {
  const mappedName = vitalsMapper[metric.name] || metric.name;

  if (!shouldTrackToDatadog) {
    // eslint-disable-next-line no-console
    console.info(
      `Datadog RUM: would have tracked web vital ${mappedName} - ${metric.value}.`,
    );
    return;
  }

  datadogRum.addAction(`Web Vital: ${mappedName}`, {
    [mappedName]: metric.value,
  });
}

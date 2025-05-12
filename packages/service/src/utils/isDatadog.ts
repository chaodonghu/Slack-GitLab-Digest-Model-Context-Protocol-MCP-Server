/**
 * Determine if client side context within Datadog request (Synthetic Bots etc...)
 *
 * Useful to disable event tracking for Datadog bots.
 * See Datadog Identify Synthetic Bots documentation here:
 * https://docs.datadoghq.com/synthetics/guide/identify_synthetics_bots/?tab=singleandmultistepapitests#default-headers
 */
export function isDatadog() {
  return (
    typeof window !== "undefined" &&
    window.navigator.userAgent.includes("Datadog")
  );
}

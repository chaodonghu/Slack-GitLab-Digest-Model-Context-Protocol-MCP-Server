const { execSync } = require("child_process");

const gitCommand = "git rev-parse HEAD";

function getGitCommitHash() {
  return execSync(gitCommand).toString().trim();
}

const nextConfig = {
  // buildId is what next uses for the folder where it outputs some files to,
  // like the build manifest, or some of the SSG hydration endpoints.
  // By appending our project name to the buildId, we make sure those paths won't
  // conflict with other frontends that also attach to zapier.com subpaths.
  // For more information, see:
  // https://engineering.zapier.com/guides/frontend/vercel/exposing-from-zapier-subpath/#step-1-namepace-your-app-paths
  generateBuildId: async () => `zhwdailysummarizer-${getGitCommitHash()}`,

  assetPrefix: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined,

  productionBrowserSourceMaps: true,

  typescript: {
    // We check TS errors in CI already. No need to check them here and increase our build times
    ignoreBuildErrors: true,
  },
  eslint: {
    // We check ESLint in CI already. No need to check here and increase build times
    ignoreDuringBuilds: true,
  },

  // Remove the x-powered-by: next headers
  poweredByHeader: false,

  env: {
    NEXT_PUBLIC_COMMIT_SHA: getGitCommitHash(),
  },

  async headers() {
    return [
      // These headers are recommended by security: https://coda.io/d/Security_dtqINjlBmfO/HTTP-Security-Guidelines_suyRE#_luJ9U
      {
        source: "/:path*",
        headers: [
          // By default, we disallow all routes of a service from being embedded in iframes.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      // if the host is `zhwdailysummarizer.vercel.zapier.com`, add noindex header
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "zhwdailysummarizer.vercel.zapier.com",
          },
        ],
        headers: [
          {
            key: "x-robots-tag",
            value: "noindex",
          },
        ],
      },
    ];
  },

  //
  // Needed for preview deployments to proxy our app to the rest of zapier-staging
  //
  async rewrites() {
    // On production or staging we don't need proxying
    if (process.env.VERCEL_ENV === "production") {
      return [];
    }

    return {
      fallback: [
        {
          source: "/:path*",
          destination: "/api/proxy/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;

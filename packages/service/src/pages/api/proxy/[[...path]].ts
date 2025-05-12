import { createProxyMiddleware } from "http-proxy-middleware";

/**
 * Local development proxy to redirect all calls to the staging server
 */
export default function proxyApiRoute(req: any, res: any, head: any) {
  if (!process.env.NEXT_PUBLIC_ZAPIER_ORIGIN) {
    throw Error("Please define process.env.NEXT_PUBLIC_ZAPIER_ORIGIN");
  }
  const Host = process.env.NEXT_PUBLIC_ZAPIER_ORIGIN.replace(
    "https://",
    "",
  ).replace("http://", "");

  let followRedirects = true;
  if (req.url.includes("switch-account") || req.url.includes("redirect")) {
    followRedirects = false;
  }
  // @ts-ignore
  return createProxyMiddleware({
    changeOrigin: true,
    cookieDomainRewrite: process.env.NEXT_PUBLIC_ZAPIER_ORIGIN,
    followRedirects,
    logLevel: "warn",
    headers: {
      // TODO: fix hardcoded values (should never go to production anyways but better to be consistent)
      Referer: process.env.NEXT_PUBLIC_ZAPIER_ORIGIN,
      Host,
      Origin: process.env.NEXT_PUBLIC_ZAPIER_ORIGIN,
      "X-Forwarded-Host": Host,
    },
    hostRewrite: process.env.NEXT_PUBLIC_ZAPIER_ORIGIN,
    onProxyRes: (proxyRes, onProxyResReq, _res) => {
      // log original request and proxied request info
      // @ts-ignore
      const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.url} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}`;

      // eslint-disable-next-line no-console
      console.log(exchange); // [GET] [200] / -> http://www.example.com

      if (proxyRes.headers["set-cookie"]) {
        // Make cookie not secure so we can change it without the
        // browser complaining
        proxyRes.headers["set-cookie"] = proxyRes.headers["set-cookie"].map(
          (cookie) => {
            // TODO: remove conditional when k8s labs are gone
            if (cookie) {
              const anotherCookie = cookie.replace(
                /; (domain|samesite)=[^;]*/gi,
                "",
              );
              const thirdCookie = anotherCookie.replace(/; secure/gi, "");
              return thirdCookie;
            } else {
              return "";
            }
          },
        );
      }

      if (proxyRes.headers["access-control-allow-origin"]) {
        // Set correct access control origin
        proxyRes.headers["access-control-allow-origin"] =
          // @ts-ignore
          onProxyResReq.headers.origin || "*";
      }
    },
    secure: true,
    target: process.env.NEXT_PUBLIC_ZAPIER_ORIGIN,
    xfwd: true,
  })(req, res, head);
}

export const config = {
  api: {
    bodyParser: false, // enable POST requests
    externalResolver: true, // hide warning message
  },
};

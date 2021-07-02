import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";

export const devFrontendProxy = (): RequestHandler => {
  // Used for proxy for cookies to work on certain endpoints

  const proxyMiddleware = createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  });

  return proxyMiddleware;
};

import type { NextConfig } from "next";

/**
 * Content-Security-Policy for the calibre-ui prototype.
 *
 * This is a UI-only, self-contained static app: no backend, no third-party
 * scripts, no external image/font origins, and no analytics. The policy is
 * therefore tight (`default-src 'self'`, `object-src 'none'`,
 * `frame-ancestors 'none'`) with only the relaxations the stack genuinely
 * requires — chosen so the policy produces ZERO console/CSP violations:
 *
 *  • script-src 'unsafe-inline' — Next.js App Router injects inline bootstrap /
 *    RSC-payload <script> tags (`self.__next_f.push(...)`). Without a
 *    nonce/hash middleware these are inline scripts, so 'unsafe-inline' is
 *    required for them to execute. (No 'unsafe-eval': the production client does
 *    not eval, and Shiki highlighting runs server-side only.)
 *  • style-src 'unsafe-inline' — required for next/font's injected @font-face
 *    <style>, Next/styled-jsx inline styles, and the app's computed inline
 *    `style={{…}}` values (e.g. generated-cover gradients, the margins slider).
 *  • img-src 'self' data: blob: — generated placeholder covers are inline
 *    `data:image/svg+xml,…` URIs (never real/remote art); blob:/self cover the
 *    favicon and any client-generated object URLs.
 *  • font-src 'self' data: — Inter is self-hosted by next/font under /_next.
 *
 * Mirrors the deny posture of X-Frame-Options via `frame-ancestors 'none'`.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ");

/**
 * Common HTTP hardening headers applied to every response. These satisfy the
 * standard security-header baseline (CSP, MIME-sniffing protection, clickjacking
 * protection, referrer minimization, and powerful-feature lockdown) for a
 * public deployment, even though the app is UI-only.
 */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Remove the framework-disclosing `X-Powered-By: Next.js` response header.
  poweredByHeader: false,
  // Apply the hardening header set to all routes.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;

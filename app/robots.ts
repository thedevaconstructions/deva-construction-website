import type { MetadataRoute } from "next";

/**
 * Served at /robots.txt, which previously 404'd.
 *
 * Everything here is public marketing content, so nothing is disallowed. The
 * value is the sitemap pointer: it is how a crawler finds the project pages,
 * which are otherwise only reachable by following cards through the gallery.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://devaconstructions.in/sitemap.xml",
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Project photographs uploaded through the admin app live in the Supabase
    // `project-images` bucket, so next/image has to be told that host is
    // allowed. Scoped to the storage path rather than the whole domain: this
    // permits exactly the public bucket and nothing else the project serves.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iaypfgmovbfmrjumgbpu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

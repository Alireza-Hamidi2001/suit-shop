// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "dclaevazetcjjkrzczpc.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/cabin-images/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        cacheComponents: true,
    },
};

module.exports = nextConfig;

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
                hostname: "fuywdytjshcmnajjiieu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/suit-images/**",
            },
            {
                protocol: "https",
                hostname: "fuywdytjshcmnajjiieu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/avatars/**",
            },
        ],
    },
    cacheComponents: true,
};

export default nextConfig;

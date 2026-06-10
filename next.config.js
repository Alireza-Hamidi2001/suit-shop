/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [75, 100],
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
            {
                protocol: "https",
                hostname: "fuywdytjshcmnajjiieu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/user-images/**",
            },
            // ✅ اضافه کردن مسیر گالری
            {
                protocol: "https",
                hostname: "fuywdytjshcmnajjiieu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/gallery/**", // <-- این خط جدید
            },
        ],
    },
    cacheComponents: true,
};

export default nextConfig;

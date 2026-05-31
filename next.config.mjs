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
            // ✅ اضافه کردن میزبان تصاویر Google Avatar
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**", // اجازه همه مسیرها
            },
            // ✅ (اختیاری) برای تصاویر GitHub
            // {
            //     protocol: "https",
            //     hostname: "avatars.githubusercontent.com",
            //     port: "",
            //     pathname: "/**",
            // },
        ],
    },
    experimental: {
        cacheComponents: true,
    },
};

export default nextConfig;

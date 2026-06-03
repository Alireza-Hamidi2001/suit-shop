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
        ],
    },

    cacheComponents: true,
};

export default nextConfig;

// const path = require("path");

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // در Next.js 16، turbopack یک کلید سطح بالاست (نه داخل experimental)
//     turbopack: {
//         root: path.join(__dirname),
//     },

//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "dclaevazetcjjkrzczpc.supabase.co",
//                 port: "",
//                 pathname: "/storage/v1/object/public/cabin-images/**",
//             },
//             {
//                 protocol: "https",
//                 hostname: "lh3.googleusercontent.com",
//                 port: "",
//                 pathname: "/**",
//             },
//         ],
//     },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/ingress-video',
                permanent: true, // Set to true for a permanent redirect (HTTP 308)
            },
        ];
    },
};

export default nextConfig;

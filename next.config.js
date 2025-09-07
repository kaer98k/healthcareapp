/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 설정
  images: {
    domains: ['localhost'],
    unoptimized: true // Vercel에서 정적 내보내기 시 필요
  },
  
  
  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 오류를 경고로만 처리
    ignoreDuringBuilds: false,
  },
  
  // TypeScript 설정
  typescript: {
    // 빌드 시 TypeScript 오류를 경고로만 처리
    ignoreBuildErrors: false,
  },
  
  // 환경변수 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // 정적 내보내기 설정 (필요시)
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig
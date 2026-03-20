module.exports = {
  apps: [{
    name: 'krpic',
    script: 'node',
    args: '.next/standalone/server.js',
    cwd: '/var/www/krpic',
    env: {
      PORT: 3006,
      NODE_ENV: 'production',
      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: 'https://janbisapzgazpadjiniv.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbmJpc2FwemdhenBhZGppbml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMjQ3NDIsImV4cCI6MjA4NDkwMDc0Mn0.Ur5rr5bCkrDvyLH5GO1bFahJmvye76XDLM-a9mQLK1o',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbmJpc2FwemdhenBhZGppbml2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTMyNDc0MiwiZXhwIjoyMDg0OTAwNzQyfQ.n-YL4PQBO7sb3CT3-5Zulaqw3YW3inCUD2t8mROn-h0',
      NEXT_PUBLIC_SITE_URL: 'https://krpic.co.kr',
      // 공통 교육 영상 URL
      CBT_VIDEO_URL: '/videos/cognitive.mp4',
      LAW_COMPLIANCE_VIDEO_URL: '/videos/law-compliance.mp4',
      // 네이버 소셜 로그인
      NAVER_CLIENT_ID: '4tEcYTPz77XgSSaToz0i',
      NAVER_CLIENT_SECRET: 'bS__QFQgSZ',
      // 카카오 소셜 로그인
      KAKAO_REST_API_KEY: 'ec8f127d5468a1941eb0512f5a908127',
      // 토스페이먼츠 결제
      NEXT_PUBLIC_TOSS_CLIENT_KEY: 'live_gck_E92LAa5PVbb9gkjnXO9PV7YmpXyJ',
      TOSS_SECRET_KEY: 'live_gsk_oEjb0gm23PNj2RpKo5Y6rpGwBJn5',
      // 이메일 알림 (Resend)
      RESEND_API_KEY: 're_h8EDmbkp_8bzKRrpituX5anmgUgtxwLnf'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};

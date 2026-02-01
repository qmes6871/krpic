// certificate_verifications 테이블 생성 스크립트
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// .env.local 파일 직접 파싱
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  console.log('certificate_verifications 테이블 생성 중...');

  // Supabase에서 SQL 실행
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS certificate_verifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        enrollment_id UUID REFERENCES enrollments(id),
        certificate_id VARCHAR(100) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        certificate_name VARCHAR(200) NOT NULL,
        completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        verified_count INTEGER DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_certificate_verifications_code ON certificate_verifications(code);
    `
  });

  if (error) {
    console.error('RPC 오류 (무시하고 직접 테스트):', error.message);

    // 테이블이 이미 존재하는지 확인
    const { data, error: selectError } = await supabase
      .from('certificate_verifications')
      .select('id')
      .limit(1);

    if (selectError && selectError.code === '42P01') {
      console.log('테이블이 존재하지 않습니다. Supabase 대시보드에서 직접 생성해주세요.');
      console.log(`
SQL:
CREATE TABLE certificate_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id),
  certificate_id VARCHAR(100) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  certificate_name VARCHAR(200) NOT NULL,
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_count INTEGER DEFAULT 0
);

CREATE INDEX idx_certificate_verifications_code ON certificate_verifications(code);
      `);
    } else if (!selectError) {
      console.log('✓ 테이블이 이미 존재합니다.');
    } else {
      console.error('테이블 확인 오류:', selectError);
    }
  } else {
    console.log('✓ 테이블 생성 완료!');
  }
}

createTable();

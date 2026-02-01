const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://janbisapzgazpadjiniv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEnrollments() {
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (enrollments.length > 0) {
    console.log('=== Enrollments 테이블 컬럼 ===');
    console.log(Object.keys(enrollments[0]));
    console.log('\n=== 샘플 데이터 ===');
    console.log(JSON.stringify(enrollments[0], null, 2));
  }
}

checkEnrollments().catch(console.error);

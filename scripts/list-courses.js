const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://janbisapzgazpadjiniv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listCourses() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .neq('category', 'detention')
    .order('category')
    .limit(3);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== 코스 컬럼 구조 ===\n');
  if (courses.length > 0) {
    console.log('컬럼들:', Object.keys(courses[0]));
    console.log('\n샘플 데이터:');
    console.log(JSON.stringify(courses[0], null, 2));
  }
}

listCourses().catch(console.error);

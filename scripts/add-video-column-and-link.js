const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://janbisapzgazpadjiniv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 영상 파일과 카테고리 매핑
const videoMapping = {
  'drunk-driving': '/videos/음주운전 재범방지교육.mp4',
  'drug': '/videos/마약범죄 재범방지교육.mp4',
  'violence': '/videos/폭력범죄 재범방지교육.mp4',
  'theft': '/videos/재산범죄 재범방지교육.mp4',
  'fraud': '/videos/재산범죄 재범방지교육.mp4',
  'sexual-offense': '/videos/성범죄 재범방지교육.mp4',
  'digital': '/videos/디지털범죄 재범방지교육.mp4',
  'gambling': '/videos/도박중독 재범방지교육.mp4',
};

async function addColumnAndLinkVideos() {
  // 1. video_url 컬럼 추가 (SQL 직접 실행)
  console.log('1. video_url 컬럼 추가 시도...');

  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE courses ADD COLUMN IF NOT EXISTS video_url TEXT;'
  });

  if (alterError) {
    console.log('RPC를 통한 컬럼 추가 실패 (이미 있거나 권한 없음):', alterError.message);
    console.log('Supabase 대시보드에서 직접 컬럼을 추가해주세요:');
    console.log('  테이블: courses');
    console.log('  컬럼명: video_url');
    console.log('  타입: text');
    console.log('  NULL 허용: 예\n');
  } else {
    console.log('video_url 컬럼 추가 성공!\n');
  }

  // 2. 코스 목록 가져오기
  console.log('2. 코스 목록 가져오는 중...');
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, category')
    .neq('category', 'detention');

  if (coursesError) {
    console.error('코스 목록 가져오기 실패:', coursesError);
    return;
  }

  console.log(`총 ${courses.length}개 코스 확인\n`);

  // 3. 각 코스에 video_url 설정
  console.log('3. video_url 설정 중...\n');

  let successCount = 0;
  let failCount = 0;

  for (const course of courses) {
    const videoUrl = videoMapping[course.category];

    if (!videoUrl) {
      console.log(`  매핑 없음: ${course.title} (${course.category})`);
      failCount++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('courses')
      .update({ video_url: videoUrl })
      .eq('id', course.id);

    if (updateError) {
      console.error(`  실패: ${course.title} - ${updateError.message}`);
      failCount++;
    } else {
      console.log(`  성공: ${course.title} → ${videoUrl}`);
      successCount++;
    }
  }

  console.log(`\n완료!`);
  console.log(`- 성공: ${successCount}개`);
  console.log(`- 실패/매핑없음: ${failCount}개`);
}

addColumnAndLinkVideos().catch(console.error);

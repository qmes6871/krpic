const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://janbisapzgazpadjiniv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 영상 파일과 카테고리 매핑 (실제 DB 카테고리명 기준)
const videoMapping = {
  'drunk-driving': '/videos/음주운전 재범방지교육.mp4',
  'drugs': '/videos/마약범죄 재범방지교육.mp4',
  'violence': '/videos/폭력범죄 재범방지교육.mp4',
  'property': '/videos/재산범죄 재범방지교육.mp4',
  'sexual': '/videos/성범죄 재범방지교육.mp4',
  'digital': '/videos/디지털범죄 재범방지교육.mp4',
  'gambling': '/videos/도박중독 재범방지교육.mp4',
  'law-compliance': '/videos/준법의식교육.mp4',
};

async function linkVideos() {
  console.log('코스 목록 가져오는 중...\n');

  // detention 카테고리 제외한 모든 코스 가져오기
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, category')
    .neq('category', 'detention');

  if (coursesError) {
    console.error('코스 목록을 가져올 수 없습니다:', coursesError);
    return;
  }

  console.log(`총 ${courses.length}개 코스\n`);

  let successCount = 0;
  let failCount = 0;

  for (const course of courses) {
    const videoUrl = videoMapping[course.category];

    if (!videoUrl) {
      console.log(`매핑 없음: ${course.title} (${course.category})`);
      failCount++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('courses')
      .update({ video_url: videoUrl })
      .eq('id', course.id);

    if (updateError) {
      console.error(`실패: ${course.title} - ${updateError.message}`);
      failCount++;
    } else {
      console.log(`성공: ${course.title} → ${videoUrl}`);
      successCount++;
    }
  }

  console.log(`\n완료!`);
  console.log(`- 성공: ${successCount}개`);
  console.log(`- 실패: ${failCount}개`);
}

linkVideos().catch(console.error);

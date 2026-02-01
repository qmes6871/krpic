const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://janbisapzgazpadjiniv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// basePath 포함한 영상 파일 경로
const videoMapping = {
  'drunk-driving': '/krpic/videos/drunk-driving.mp4',
  'drugs': '/krpic/videos/drugs.mp4',
  'violence': '/krpic/videos/violence.mp4',
  'property': '/krpic/videos/property.mp4',
  'sexual': '/krpic/videos/sexual.mp4',
  'digital': '/krpic/videos/digital.mp4',
  'gambling': '/krpic/videos/gambling.mp4',
  'law-compliance': '/krpic/videos/law-compliance.mp4',
};

async function updateVideoUrls() {
  console.log('video_url 업데이트 중...\n');

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, category')
    .neq('category', 'detention');

  if (coursesError) {
    console.error('코스 목록 가져오기 실패:', coursesError);
    return;
  }

  let successCount = 0;

  for (const course of courses) {
    const videoUrl = videoMapping[course.category];
    if (!videoUrl) continue;

    const { error } = await supabase
      .from('courses')
      .update({ video_url: videoUrl })
      .eq('id', course.id);

    if (!error) {
      console.log(`${course.title} → ${videoUrl}`);
      successCount++;
    }
  }

  console.log(`\n완료! ${successCount}개 업데이트`);
}

updateVideoUrls().catch(console.error);

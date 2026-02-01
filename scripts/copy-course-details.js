const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://janbisapzgazpadjiniv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function copyCourseDetails() {
  const sourceCourseId = '1f8065fd-4937-489c-98ce-47e4098ecdce';

  // 1. 소스 코스 정보 가져오기
  console.log('소스 코스 정보 가져오는 중...');
  const { data: sourceCourse, error: sourceError } = await supabase
    .from('courses')
    .select('detail_images')
    .eq('id', sourceCourseId)
    .single();

  if (sourceError) {
    console.error('소스 코스를 찾을 수 없습니다:', sourceError);
    return;
  }

  console.log('소스 코스 정보:');
  console.log('- detail_images:', sourceCourse.detail_images);

  // 2. detention 카테고리를 제외한 모든 코스 가져오기
  console.log('\n업데이트할 코스 목록 가져오는 중...');
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, category')
    .neq('category', 'detention')
    .neq('id', sourceCourseId);

  if (coursesError) {
    console.error('코스 목록을 가져올 수 없습니다:', coursesError);
    return;
  }

  console.log(`업데이트할 코스 수: ${courses.length}개`);

  // 3. 각 코스 업데이트
  let successCount = 0;
  let failCount = 0;

  for (const course of courses) {
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        detail_images: sourceCourse.detail_images
      })
      .eq('id', course.id);

    if (updateError) {
      console.error(`실패: ${course.title} (${course.category}) - ${updateError.message}`);
      failCount++;
    } else {
      console.log(`성공: ${course.title} (${course.category})`);
      successCount++;
    }
  }

  console.log(`\n완료! 성공: ${successCount}개, 실패: ${failCount}개`);
}

copyCourseDetails().catch(console.error);

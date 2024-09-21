'use client';

import { use, memo } from 'react';
import { apiSearch } from '@/lib/api/calls/course';

import CoursePreview from '@/components/view/CoursePreview';
import { Box } from './aux';

export default memo(
  function SearchResults({ keyword, order, page }: ReqSearchCourse) {
    const response = use(apiSearch({ keyword, order, page }));

    if (response.status !== 'SUCCESS') {
      return <Box>오류가 발생했습니다.</Box>;
    }

    return (
      <>
        {response.data.map((course) => (
          <div key={course.course_id} className="animate-fade">
            <CoursePreview key={course.course_id} course={course} />
          </div>
        ))}
      </>
    );
  },
  (prev, next) =>
    prev != undefined &&
    next != undefined &&
    prev.keyword === next.keyword &&
    prev.order === next.order &&
    prev.page === next.page,
);

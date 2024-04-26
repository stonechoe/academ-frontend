import { useEffect, useState } from 'react';

import { Course, sampleCourse } from '../../models/course';
import GlobalStyles from '../../Global.module.css';
import { SearchForm } from '../../components/composite';
import { HStack, VStack, Typography } from '../../components';

import SingleSearchResultView from './SingleSearchResultView';
import lecturesStyles from './Lectures.module.css';
import styles from './common.module.css';

const SearchTopView = ({ query }: { query: string }) => {
  return query ? (
    <VStack
      gap="20px"
      className={styles.borderBottom}
      style={{
        padding: '110px 40px 110px 40px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="t3" style={{ wordBreak: 'break-word' }}>
        <Typography variant="t1" children={`"${query}"`}></Typography> 강의 검색 결과
      </Typography>

      <SearchForm className={lecturesStyles.searchForm} defaultValue={query} />
    </VStack>
  ) : (
    <VStack
      className={styles.borderBottom}
      style={{
        padding: '110px 40px 110px 40px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <SearchForm className={lecturesStyles.searchForm} defaultValue={query} />
    </VStack>
  );
};

const SearchResultsView = ({ results }: { results: Course[] | null }) => {
  return results && results.length ? (
    <HStack className={`${styles.results} ${GlobalStyles.metacontainer}`}>
      <div className={lecturesStyles.container}>
        {results.map((course) => (
          <SingleSearchResultView course={course} />
        ))}
      </div>
    </HStack>
  ) : (
    <HStack className={styles.results} style={{ padding: '40px', flexGrow: 1, textAlign: 'center' }}>
      <Typography variant="t2">{results === null ? '검색을 처리 중입니다' : '검색 결과가 없습니다'}</Typography>
    </HStack>
  );
};

export function LecturesPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';

  const [searchResult, setSearchResult] = useState<Course[] | null>(null);

  useEffect(() => {
    setTimeout(() => setSearchResult(sampleCourse), 10);
  }, []);

  return (
    <HStack style={{ height: '100%' }}>
      <SearchTopView query={query} />
      <SearchResultsView results={searchResult} />
    </HStack>
  );
}

"use client";

import { useSessionId } from '../../context/SessionIdContext';
import { useApiMyComments } from '@/lib/api/course';

import CommentsView from "../lecture/[id]/components/comments";
import { UserProfile } from '@/lib/models/user';

function NoSessionIdFallback() {
  return <div>이 기능을 사용하려면 로그인해야 합니다.</div>
}

function UserData({ userprofile }: { userprofile: UserProfile }) {
  return <div className='p-8 text-xl col-auto'>
    <div className='text-3xl pb-4'>내 정보</div>
    <div><span className='font-bold'>이름</span> {userprofile.username}</div>
    <div><span className='font-bold'>학번</span> {userprofile.student_id}</div>
    <div><span className='font-bold'>과정</span> {userprofile.degree}</div>
    <div><span className='font-bold'>학과</span> {userprofile.department}</div>
    <div><span className='font-bold'>포인트</span> {userprofile.point}</div>
  </div>;
}

export default function MyPage() {

  const { sessionId } = useSessionId();
  const comments = useApiMyComments({});

  if (sessionId === null) {
    return <NoSessionIdFallback />
  }

  if (comments === null) {
    return <div>강의평 로딩중</div>
  }

  if (comments.status === "SUCCESS") {
    return <main className='w-full h-full'>
      <UserData userprofile={sessionId} />
      <CommentsView comments={comments.data} />
    </main>;
  }
  else {
      return <div>오류</div>
  }
}
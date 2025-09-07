'use client'

import React, { useState } from 'react';

interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  createdAt: Date; // 게시물 생성 시간 추가
  showComments?: boolean;
  showMoreMenu?: boolean;
  likedByUser?: boolean; // 사용자가 좋아요를 눌렀는지 추적
  reactions: {
    thumbsUp: number;    // 따봉 👍
    heart: number;        // 하트 ❤️
    cry: number;          // 우는 이모지 😢
    laugh: number;        // 웃는 이모지 😂
  };
  userReactions: {
    thumbsUp: boolean;
    heart: boolean;
    cry: boolean;
    laugh: boolean;
  };
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: '운동마스터',
      title: '벤치프레스 자세 교정 팁 공유합니다!',
      content: '오늘 PT 선생님께 배운 벤치프레스 자세 교정 방법을 공유해요. 어깨를 고정하고 발을 바닥에 단단히 밀어붙이는 것이 핵심입니다.',
      category: '자세교정',
      likes: 24,
      comments: [
        { id: '1', author: '운동초보', content: '정말 도움이 되는 팁이에요!', timestamp: '1시간 전' },
        { id: '2', author: '헬스러버', content: '저도 이 방법으로 연습해보겠습니다.', timestamp: '30분 전' }
      ],
      timestamp: '2시간 전',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      showComments: false,
      showMoreMenu: false,
      likedByUser: false,
      reactions: {
        thumbsUp: 45,
        heart: 32,
        cry: 8,
        laugh: 15
      },
      userReactions: {
        thumbsUp: false,
        heart: false,
        cry: false,
        laugh: false
      }
    },
    {
      id: '2',
      author: '요가러버',
      title: '집에서 할 수 있는 요가 루틴 추천',
      content: '헬스장에 가지 못하는 날을 위한 20분 홈 요가 루틴을 만들어봤어요. 스트레스 해소와 유연성 향상에 도움이 됩니다.',
      category: '홈트레이닝',
      likes: 18,
      comments: [
        { id: '3', author: '요가초보', content: '어떤 동작들이 포함되어 있나요?', timestamp: '2시간 전' }
      ],
      timestamp: '5시간 전',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
      showComments: false,
      showMoreMenu: false,
      likedByUser: false,
      reactions: {
        thumbsUp: 28,
        heart: 15,
        cry: 3,
        laugh: 8
      },
      userReactions: {
        thumbsUp: false,
        heart: false,
        cry: false,
        laugh: false
      }
    },
    {
      id: '3',
      author: '다이어트성공',
      title: '3개월 만에 15kg 감량 후기',
      content: '규칙적인 운동과 식단 조절로 3개월 만에 목표 체중을 달성했습니다. 구체적인 방법과 팁을 공유해드려요!',
      category: '다이어트',
      likes: 45,
      comments: [
        { id: '4', author: '다이어트중', content: '정말 대단해요! 동기부여가 됩니다.', timestamp: '3시간 전' },
        { id: '5', author: '건강관리', content: '식단도 함께 공유해주실 수 있나요?', timestamp: '1시간 전' }
      ],
      timestamp: '1일 전',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
      showComments: false,
      showMoreMenu: false,
      likedByUser: false,
      reactions: {
        thumbsUp: 120,
        heart: 85,
        cry: 12,
        laugh: 25
      },
      userReactions: {
        thumbsUp: false,
        heart: false,
        cry: false,
        laugh: false
      }
    },
    {
      id: '4',
      author: '크로스핏초보',
      title: '크로스핏 처음 시작하는 분들을 위한 가이드',
      content: '크로스핏을 처음 시작하는 분들을 위한 기본 동작과 주의사항을 정리해봤어요. 천천히 시작하는 것이 중요합니다.',
      category: '크로스핏',
      likes: 32,
      comments: [
        { id: '6', author: '크로스핏러버', content: '초보자도 쉽게 따라할 수 있나요?', timestamp: '4시간 전' }
      ],
      timestamp: '2일 전',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
      showComments: false,
      showMoreMenu: false,
      likedByUser: false,
      reactions: {
        thumbsUp: 55,
        heart: 42,
        cry: 5,
        laugh: 18
      },
      userReactions: {
        thumbsUp: false,
        heart: false,
        cry: false,
        laugh: false
      }
    },
    {
      id: '5',
      author: '근육증가중',
      title: '프로틴 섭취 타이밍과 양에 대해',
      content: '운동 후 프로틴 섭취 타이밍과 적정량에 대해 궁금한 점이 있어요. 경험 많은 분들의 조언을 듣고 싶습니다.',
      category: '영양',
      likes: 12,
      comments: [
        { id: '7', author: '영양전문가', content: '운동 후 30분 내에 섭취하는 것이 좋습니다.', timestamp: '5시간 전' },
        { id: '8', author: '건강관리', content: '체중 1kg당 1.6-2.2g 정도가 적당해요.', timestamp: '2시간 전' }
      ],
      timestamp: '3일 전',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
      showComments: false,
      showMoreMenu: false,
      likedByUser: false,
      reactions: {
        thumbsUp: 18,
        heart: 12,
        cry: 2,
        laugh: 6
      },
      userReactions: {
        thumbsUp: false,
        heart: false,
        cry: false,
        laugh: false
      }
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '일반'
  });
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const categories = [
    '전체', 
    '자세교정', 
    '홈트레이닝', 
    '다이어트', 
    '크로스핏', 
    '영양', 
    '일반',
    '10대',
    '20대',
    '30대',
    '40대',
    '50대',
    '60대~'
  ];

  const handleLike = (postId: string) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId 
          ? { 
              ...post, 
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser
            } 
          : post
      )
    );
  };

  const handleReaction = (postId: string, reactionType: 'thumbsUp' | 'heart' | 'cry' | 'laugh') => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId 
          ? { 
              ...post, 
              reactions: {
                ...post.reactions,
                [reactionType]: post.userReactions[reactionType] 
                  ? post.reactions[reactionType] - 1 
                  : post.reactions[reactionType] + 1
              },
              userReactions: {
                ...post.userReactions,
                [reactionType]: !post.userReactions[reactionType]
              }
            } 
          : post
      )
    );
  };

  const getTotalReactions = (post: CommunityPost) => {
    return post.reactions.thumbsUp + post.reactions.heart + post.reactions.cry + post.reactions.laugh;
  };

  const isHotPost = (post: CommunityPost) => {
    const now = new Date();
    const postAge = now.getTime() - post.createdAt.getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    // 하루가 지났으면 핫게시물에서 제외
    if (postAge > oneDayInMs) {
      return false;
    }
    
    // 총 반응 수가 100개 이상이어야 핫게시물
    return getTotalReactions(post) >= 100;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return `${diffInDays}일 전`;
    }
  };

  const toggleComments = (postId: string) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
    // 댓글 섹션을 열 때 답글 모드 초기화
    if (replyingTo) {
      setReplyingTo(null);
    }
  };

  const toggleMoreMenu = (postId: string) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, showMoreMenu: !post.showMoreMenu } : { ...post, showMoreMenu: false }
      )
    );
  };

  const handleReport = (postId: string) => {
    alert('신고가 접수되었습니다. 24시간 내에 검토 후 조치하겠습니다.');
    toggleMoreMenu(postId);
  };



  const handleSubmitPost = () => {
    console.log('handleSubmitPost 호출됨');
    console.log('newPost 상태:', newPost);
    console.log('제목 길이:', newPost.title.length);
    console.log('내용 길이:', newPost.content.length);
    
    if (newPost.title && newPost.content) {
      console.log('게시물 생성 시작');
      const post: CommunityPost = {
        id: Date.now().toString(),
        author: '나',
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        likes: 0,
        comments: [],
        timestamp: '방금 전',
        createdAt: new Date(), // 현재 시간 설정
        showComments: false,
        showMoreMenu: false,
        likedByUser: false,
        reactions: {
          thumbsUp: 0,
          heart: 0,
          cry: 0,
          laugh: 0
        },
        userReactions: {
          thumbsUp: false,
          heart: false,
          cry: false,
          laugh: false
        }
      };
      console.log('생성된 게시물:', post);
      setCommunityPosts([post, ...communityPosts]);
      setShowNewPostForm(false);
      setNewPost({ title: '', content: '', category: '일반' });
      console.log('게시물 등록 완료');
    } else {
      console.log('게시물 등록 실패: 제목 또는 내용이 비어있음');
      if (!newPost.title) console.log('제목이 비어있음');
      if (!newPost.content) console.log('내용이 비어있음');
    }
  };

  const handleAddComment = (postId: string) => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: '나',
        content: newComment,
        timestamp: '방금 전'
      };

      setCommunityPosts(posts =>
        posts.map(post =>
          post.id === postId 
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );

      setNewComment('');
      setReplyingTo(null);
    }
  };

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  // 검색과 카테고리 필터링을 결합
  const filteredPosts = communityPosts.filter(post => {
    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(query);
      const contentMatch = post.content.toLowerCase().includes(query);
      const authorMatch = post.author.toLowerCase().includes(query);
      const categoryMatch = post.category.toLowerCase().includes(query);
      
      if (!titleMatch && !contentMatch && !authorMatch && !categoryMatch) {
        return false;
      }
    }
    
    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      return post.category === selectedCategory;
    }
    
    return true;
  });

  // 핫게시물과 일반게시물 분리
  const hotPosts = filteredPosts.filter(post => isHotPost(post));
  const normalPosts = filteredPosts.filter(post => !isHotPost(post));
  const sortedPosts = [...hotPosts, ...normalPosts];

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 bg-black min-h-screen">
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 flex items-center">
          🏋️ 커뮤니티
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">운동 동료들과 정보를 공유하고 소통하세요</p>
      </div>

      {/* 커뮤니티 경고 배너 */}
      <div className="bg-red-900/30 border-l-4 border-red-500/50 p-4 mb-6 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="text-red-400 text-xl">⚠️</div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-300">커뮤니티 운영 정책</h3>
            <div className="mt-2 text-sm text-red-200">
              <p>• 모든 게시글은 사전 검토 후 게시됩니다</p>
              <p>• 규정 위반 시 즉시 삭제 및 계정 제재 조치</p>
              <p>• 신고된 게시글은 24시간 내 검토 및 조치</p>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        {/* 운동 카테고리 (첫 번째 행) */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-400 mb-2">운동 카테고리</h3>
          <div className="flex flex-wrap gap-2">
            {['전체', '자세교정', '홈트레이닝', '다이어트', '크로스핏', '영양', '일반'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* 연령대별 카테고리 (두 번째 행) */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">연령대별</h3>
          <div className="flex flex-wrap gap-2">
            {['10대', '20대', '30대', '40대', '50대', '60대~'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 글쓰기 및 검색 기능 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewPostForm(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            ✏️ 글쓰기
          </button>
        </div>
        
        {/* 검색 기능 */}
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="제목이나 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-8 sm:pl-10 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 새 글 작성 폼 */}
      {showNewPostForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 sm:p-6 mb-8 shadow-2xl shadow-purple-500/10">
          <h2 className="text-xl font-semibold text-white mb-4">새 글 작성</h2>
          
          {/* 글 작성 주의사항 */}
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="text-yellow-400 text-lg">📝</div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-300">글 작성 전 필독사항</h4>
                <ul className="mt-2 text-sm text-yellow-200 space-y-1">
                  <li>• 허위 정보, 과장된 표현 금지</li>
                  <li>• 개인정보 노출 금지 (이름, 연락처, 주소 등)</li>
                  <li>• 상업적 홍보, 스팸성 내용 금지</li>
                  <li>• 타인 비방, 차별적 표현 금지</li>
                  <li>• 의료진 상담이 필요한 질문 금지</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">카테고리</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800/50 text-white"
            >
              <optgroup label="운동 카테고리">
                <option value="일반">일반</option>
                <option value="자세교정">자세교정</option>
                <option value="홈트레이닝">홈트레이닝</option>
                <option value="다이어트">다이어트</option>
                <option value="크로스핏">크로스핏</option>
                <option value="영양">영양</option>
              </optgroup>
              <optgroup label="연령대별">
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대~">60대~</option>
              </optgroup>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">제목</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => {
                console.log('제목 입력:', e.target.value);
                setNewPost({...newPost, title: e.target.value});
              }}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400"
              placeholder="제목을 입력하세요 (최대 50자)"
              maxLength={50}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">내용</label>
            <textarea
              value={newPost.content}
              onChange={(e) => {
                console.log('내용 입력:', e.target.value);
                setNewPost({...newPost, content: e.target.value});
              }}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400"
              rows={5}
              placeholder="운동 관련 정보나 경험을 공유해보세요... (최소 20자, 최대 1000자)"
              maxLength={1000}
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${newPost.content.length > 900 ? 'text-red-400' : 'text-gray-400'}`}>
                {newPost.content.length}/1000
              </span>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeTerms"
                className="mt-1 w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                required
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                <span className="font-medium">커뮤니티 이용약관</span>에 동의합니다. 
                <span className="text-red-400">*</span>
                <br />
                <span className="text-xs text-gray-400">
                  • 게시된 내용에 대한 법적 책임은 작성자에게 있습니다<br />
                  • 운영진의 검토 후 게시되며, 규정 위반 시 삭제됩니다<br />
                  • 신고된 게시글은 즉시 검토 및 조치됩니다
                </span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmitPost}
              disabled={!newPost.title || newPost.content.length < 20}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              글 등록
              {(!newPost.title || newPost.content.length < 20) && (
                <span className="ml-2 text-xs opacity-75">
                  {!newPost.title ? '(제목 필요)' : `(내용 ${newPost.content.length}/20자)`}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="px-6 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors border border-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 커뮤니티 글 목록 */}
      
      {/* 핫게시물 섹션 */}
      {hotPosts.length > 0 && (
        <div className="mb-8">
          <div className="space-y-4">
            {hotPosts.map((post) => (
              <div key={post.id} className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-lg p-6 relative shadow-lg shadow-red-500/20">
                {/* 핫게시물 배지 - 제목 위에 배치 */}
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-md">
                    🔥 핫게시물
                  </span>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-white text-base">{post.author}</div>
                      <div className="text-sm text-gray-300">{getTimeAgo(post.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full font-medium shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 leading-tight">{post.title}</h3>
                <p className="text-gray-200 mb-4 line-clamp-3 leading-relaxed text-base">{post.content}</p>

                {/* 이모지 반응 버튼들 */}
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => handleReaction(post.id, 'thumbsUp')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      post.userReactions.thumbsUp
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-blue-900/40 text-blue-200 hover:bg-blue-800/60 shadow-sm'
                    }`}
                  >
                    <span className="text-lg">👍</span>
                    <span className="text-sm font-bold text-inherit">{post.reactions.thumbsUp}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction(post.id, 'heart')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      post.userReactions.heart
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-red-900/40 text-red-200 hover:bg-red-800/60 shadow-sm'
                    }`}
                  >
                    <span className="text-lg">❤️</span>
                    <span className="text-sm font-bold text-inherit">{post.reactions.heart}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction(post.id, 'cry')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      post.userReactions.cry
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 shadow-sm'
                    }`}
                  >
                    <span className="text-lg">😢</span>
                    <span className="text-sm font-bold text-inherit">{post.reactions.cry}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction(post.id, 'laugh')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      post.userReactions.laugh
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-900/40 text-yellow-200 hover:bg-yellow-800/60 shadow-sm'
                    }`}
                  >
                    <span className="text-lg">😂</span>
                    <span className="text-sm font-bold text-inherit">{post.reactions.laugh}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <span className="text-lg">💬</span>
                    <span className="text-sm font-bold text-inherit">{post.comments.length}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* 더보기 메뉴 */}
                    <div className="relative">
                      <button
                        onClick={() => toggleMoreMenu(post.id)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        ⋯
                      </button>
                      
                      {post.showMoreMenu && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-10">
                          <button
                            onClick={() => handleReport(post.id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            🚨 신고하기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 댓글 섹션 */}
                {post.showComments && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">댓글 ({post.comments.length})</h4>
                    
                    {/* 댓글 작성 폼 */}
                    <div className="mb-4 p-3 bg-secondary rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold">
                          나
                        </div>
                        <div className="flex-1">
                          {replyingTo && (
                            <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-400 rounded-lg shadow-sm">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                💬 답글 작성 중... 
                                <button
                                  onClick={cancelReply}
                                  className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 underline font-medium"
                                >
                                  취소
                                </button>
                              </p>
                            </div>
                          )}
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={replyingTo ? "답글을 작성하세요..." : "댓글을 작성하세요..."}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900/50 text-white resize-none placeholder-gray-400"
                            rows={2}
                            maxLength={500}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {newComment.length}/500
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComment.trim()}
                                className="px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {replyingTo ? '답글 작성' : '댓글 작성'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-white text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-400">{comment.timestamp}</span>
                              <button
                                onClick={() => handleReplyToComment(comment.id)}
                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                              >
                                답글
                              </button>
                            </div>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반 게시물 섹션 */}
      <div className="space-y-4">
        {normalPosts.map((post) => (
          <div key={post.id} className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 shadow-lg shadow-purple-500/10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{post.author}</div>
                  <div className="text-sm text-gray-400">{getTimeAgo(post.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isHotPost(post) && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">인기🔥</span>
                )}
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                  {post.category}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
            <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* 이모지 반응 버튼들 */}
                <button
                  onClick={() => handleReaction(post.id, 'thumbsUp')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    post.userReactions.thumbsUp
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/50'
                  }`}
                >
                  <span>👍</span>
                  <span className="text-sm font-medium">{post.reactions.thumbsUp}</span>
                </button>
                
                <button
                  onClick={() => handleReaction(post.id, 'heart')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    post.userReactions.heart
                      ? 'bg-red-500 text-white'
                      : 'bg-red-900/30 text-red-300 hover:bg-red-800/50'
                  }`}
                >
                  <span>❤️</span>
                  <span className="text-sm font-medium">{post.reactions.heart}</span>
                </button>
                
                <button
                  onClick={() => handleReaction(post.id, 'cry')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    post.userReactions.cry
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'
                  }`}
                >
                  <span>😢</span>
                  <span className="text-sm font-medium">{post.reactions.cry}</span>
                </button>
                
                <button
                  onClick={() => handleReaction(post.id, 'laugh')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    post.userReactions.laugh
                      ? 'bg-yellow-500 text-white'
                      : 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/50'
                  }`}
                >
                  <span>😂</span>
                  <span className="text-sm font-medium">{post.reactions.laugh}</span>
                </button>
                
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors border border-gray-600"
                >
                  <span>💬</span>
                  <span className="text-white">{post.comments.length}</span>
                </button>
              </div>
              
              {/* 더보기 메뉴 */}
              <div className="relative">
                <button
                  onClick={() => toggleMoreMenu(post.id)}
                  className="text-gray-400 hover:text-white transition-colors px-2 py-1 hover:bg-gray-800/50 rounded"
                >
                  ⋯
                </button>
                
                {post.showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10">
                    <button
                      onClick={() => handleReport(post.id)}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      🚨 신고하기
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 댓글 섹션 */}
            {post.showComments && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="font-medium text-white mb-3">댓글 ({post.comments.length})</h4>
                
                {/* 댓글 작성 폼 */}
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      나
                    </div>
                    <div className="flex-1">
                      {replyingTo && (
                        <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-400 rounded-lg shadow-sm">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            💬 답글 작성 중... 
                            <button
                              onClick={cancelReply}
                              className="ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 underline font-medium"
                            >
                              취소
                            </button>
                          </p>
                        </div>
                      )}
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? "답글을 작성하세요..." : "댓글을 작성하세요..."}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                        rows={2}
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {newComment.length}/500
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComment.trim()}
                            className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {replyingTo ? '답글 작성' : '댓글 작성'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          <button
                            onClick={() => handleReplyToComment(comment.id)}
                            className="text-xs text-accent hover:text-accent-foreground transition-colors hover:underline"
                          >
                            답글
                          </button>
                        </div>
                        <p className="text-foreground text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 검색 결과가 없을 때 표시할 메시지 */}
      {searchQuery.trim() && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            <span className="font-medium">&quot;{searchQuery}&quot;</span>와(과) 일치하는 게시글을 찾을 수 없습니다.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• 다른 검색어를 시도해보세요</p>
            <p>• 제목, 내용, 작성자, 카테고리에서 검색됩니다</p>
            <p>• 대소문자를 구분하지 않습니다</p>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-6 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
          >
            검색 초기화
          </button>
        </div>
      )}

      {/* 검색 중일 때 표시할 메시지 */}
      {searchQuery.trim() && filteredPosts.length > 0 && (
        <div className="text-center py-6 bg-secondary rounded-lg">
          <p className="text-muted-foreground">
            <span className="font-medium">&quot;{searchQuery}&quot;</span> 검색 결과: 
            <span className="font-medium text-foreground ml-2">
              총 {filteredPosts.length}개의 게시글
            </span>
          </p>
        </div>
      )}

    </div>
  );
};

export default Dashboard;

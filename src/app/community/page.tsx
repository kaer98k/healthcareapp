'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NavigationBar from '@/components/NavigationBar'
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Search,
  TrendingUp,
  Star,
  Clock,
  Send,
  X
} from 'lucide-react'
import { getCommunityPosts, createCommunityPost, togglePostLike } from '@/lib/communityApi'
import { CommunityPost } from '@/types/community'
import { useAuth } from '@/contexts/AuthContext'

// 댓글 타입 정의
interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
}

// 기존 CommunityPost 타입은 @/types/community에서 import

// 샘플 데이터는 제거하고 실제 데이터베이스에서 로드

const categories = ['전체', '운동', '식단', '정신건강', '질문', '후기']

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('전체')
  const [showNewPost, setShowNewPost] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({})
  const [activeTab, setActiveTab] = useState<'all' | 'scrapped'>('all')

  // 게시글 로드
  const loadPosts = async () => {
    try {
      setLoading(true)
      const category = selectedCategory === '전체' ? undefined : selectedCategory
      const { data, error } = await getCommunityPosts(category)
      
      if (error) {
        console.error('게시글 로드 오류:', error)
        return
      }
      
      setPosts(data || [])
    } catch (error) {
      console.error('게시글 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 좋아요 토글
  const toggleLike = async (postId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const { data, error } = await togglePostLike(postId)
      
      if (error) {
        console.error('좋아요 토글 오류:', error)
        return
      }

      // 로컬 상태 업데이트
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: data?.is_liked || false,
              likes_count: (post.likes_count || 0) + (data?.is_liked ? 1 : -1)
            }
          : post
      ))
    } catch (error) {
      console.error('좋아요 토글 오류:', error)
    }
  }

  // 컴포넌트 마운트 시 게시글 로드
  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  // 스크랩 토글
  const toggleScrap = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isScrapped: !post.isScrapped
          }
        : post
    ))
  }

  // 댓글 토글
  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedComments(newExpanded)
  }

  // 댓글 추가
  const addComment = (postId: string) => {
    const commentText = newComment[postId]?.trim()
    if (!commentText) return

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: '나',
      avatar: '👤',
      content: commentText,
      timestamp: '방금 전'
    }

    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            commentList: [...post.commentList, newCommentObj],
            comments: post.comments + 1
          }
        : post
    ))

    setNewComment(prev => ({ ...prev, [postId]: '' }))
  }

  // 새 게시글 작성
  const handleSubmitPost = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('게시하기 버튼 클릭됨')
      console.log('제목:', newPostTitle)
      console.log('내용:', newPostContent)
      console.log('카테고리:', newPostCategory)
    }
    
    if (isSubmitting) return // 중복 제출 방지
    
    if (newPostTitle.trim() && newPostContent.trim()) {
      setIsSubmitting(true)
      
      try {
        const newPost: CommunityPost = {
          id: Date.now().toString(),
          author: '나',
          avatar: '👤',
          title: newPostTitle,
          content: newPostContent,
          likes: 0,
          comments: 0,
          shares: 0,
          timestamp: '방금 전',
          category: newPostCategory === '전체' ? '일반' : newPostCategory,
          isLiked: false,
          isScrapped: false,
          commentList: []
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('새 게시글 생성:', newPost)
        }
        
        // 상태 업데이트
        setPosts(prevPosts => [newPost, ...prevPosts])
        
        // 폼 초기화
        setNewPostTitle('')
        setNewPostContent('')
        setNewPostCategory('전체')
        setShowNewPost(false)
        
        if (process.env.NODE_ENV === 'development') {
          console.log('게시글 추가 완료')
        }
        
        
        // 성공 메시지 (선택사항)
        alert('게시글이 성공적으로 작성되었습니다!')
        
      } catch (error) {
        console.error('게시글 작성 중 오류:', error)
        alert('게시글 작성 중 오류가 발생했습니다.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('제목 또는 내용이 비어있음')
      }
      alert('제목과 내용을 모두 입력해주세요.')
    }
  }

  // 카테고리별 필터링
  const filteredPosts = posts.filter(post => {
    // 탭별 필터링
    if (activeTab === 'scrapped' && !post.isScrapped) return false
    if (activeTab === 'all' && post.isScrapped) return true
    
    // 카테고리 필터링
    const categoryMatch = selectedCategory === '전체' || post.category === selectedCategory
    
    // 검색어 필터링
    const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-20">
      {/* 네비게이션 바 */}
      <NavigationBar />
      
      {/* 헤더 - 모바일 친화적 */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-cyan-500/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                커뮤니티
              </h1>
              <p className="text-cyan-200 mt-1 text-sm sm:text-base hidden sm:block">건강한 삶을 함께 나누는 공간</p>
            </div>
            <Button 
              onClick={() => setShowNewPost(!showNewPost)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black shadow-lg shadow-cyan-500/25 text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">새 글 작성</span>
              <span className="sm:hidden">글쓰기</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* 검색 및 필터 - 모바일 최적화 */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
              <Input
                placeholder="게시글 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 backdrop-blur-sm border-cyan-500/30 text-white placeholder-cyan-300 text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          {/* 카테고리 필터 - 모바일에서 스크롤 가능 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap text-sm sm:text-base ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-black/40 backdrop-blur-sm border-cyan-500/30 text-white hover:bg-cyan-500/20 hover:text-white'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* 새 게시글 작성 폼 - 모바일 최적화 */}
        {showNewPost && (
          <Card className="mb-4 sm:mb-6 bg-gray-900/80 backdrop-blur-sm border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <CardHeader className="pb-3 bg-gray-800/50 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-semibold text-cyan-200">새 게시글 작성</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowNewPost(false)}
                  className="p-1 text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 bg-gray-900/50">
              <Input
                placeholder="제목을 입력하세요"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="bg-gray-800/50 backdrop-blur-sm border-cyan-500/30 text-white placeholder-cyan-300 text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              
              {/* 카테고리 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-200">카테고리</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={newPostCategory === category ? "default" : "outline"}
                      onClick={() => setNewPostCategory(category)}
                      className={`whitespace-nowrap text-xs sm:text-sm ${
                        newPostCategory === category
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/25'
                          : 'bg-gray-800/50 backdrop-blur-sm border-cyan-500/30 text-white hover:bg-cyan-500/20 hover:text-white'
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="내용을 입력하세요"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-3 border border-cyan-500/30 rounded-md bg-gray-800/50 backdrop-blur-sm resize-none h-24 sm:h-32 text-white placeholder-cyan-300 text-sm sm:text-base focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitPost}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black shadow-lg shadow-cyan-500/25 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '게시 중...' : '게시하기'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewPost(false)}
                  className="bg-gray-800/50 backdrop-blur-sm border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 sm:px-6"
                >
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 탭 메뉴 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex space-x-1 bg-black/40 backdrop-blur-sm rounded-lg p-1 border border-cyan-500/30">
            <Button
              onClick={() => setActiveTab('all')}
              className={`flex-1 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/25'
                  : 'bg-transparent text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20'
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              전체 게시글
            </Button>
            <Button
              onClick={() => setActiveTab('scrapped')}
              className={`flex-1 ${
                activeTab === 'scrapped'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/25'
                  : 'bg-transparent text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20'
              }`}
            >
              <Star className="w-4 h-4 mr-2" />
              스크랩한 글
            </Button>
          </div>
        </div>


        {/* 게시글 목록 */}
        <div className="space-y-3 sm:space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-gray-900 border-purple-500/30 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <CardHeader className="pb-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm sm:text-lg flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{post.author}</h3>
                      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-300">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{post.timestamp}</span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs flex-shrink-0 border border-purple-500/30">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => toggleScrap(post.id)}
                    className={`flex-shrink-0 ${
                      post.isScrapped 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${post.isScrapped ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-gray-900">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-gray-200 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">{post.content}</p>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-purple-500/20">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-1 text-xs sm:text-sm ${
                        post.isLiked 
                          ? 'text-pink-400 hover:text-pink-300' 
                          : 'text-gray-300 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-1 text-xs sm:text-sm text-gray-300 hover:text-white"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="outline"  className="flex items-center space-x-1 text-xs sm:text-sm text-gray-300 hover:text-purple-400">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{post.shares}</span>
                    </Button>
                  </div>
                </div>

                {/* 댓글 섹션 */}
                {expandedComments.has(post.id) && (
                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    {/* 기존 댓글들 */}
                    <div className="space-y-3 mb-4">
                      {post.commentList.map((comment) => (
                        <div key={comment.id} className="flex space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0">
                            {comment.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-white text-xs sm:text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-300">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 새 댓글 작성 */}
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <Input
                          placeholder="댓글을 입력하세요..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="flex-1 text-xs sm:text-sm bg-gray-800/50 backdrop-blur-sm border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                          onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                        />
                        <Button
                          onClick={() => addComment(post.id)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 px-3 sm:px-4"
                        >
                          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 게시글이 없을 때 */}
        {filteredPosts.length === 0 && (
          <Card className="bg-gray-900/80 backdrop-blur-sm border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <CardContent className="p-8 sm:p-12 text-center">
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-cyan-200 mb-2">게시글이 없습니다</h3>
              <p className="text-cyan-300 mb-4 sm:mb-6 text-sm sm:text-base">첫 번째 게시글을 작성해보세요!</p>
              <Button 
                onClick={() => setShowNewPost(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black shadow-lg shadow-cyan-500/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                새 글 작성하기
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
    </div>
  )
}

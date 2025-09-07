// 커뮤니티 게시글 타입 정의
export interface CommunityPost {
  id?: string
  user_id?: string
  title: string
  content: string
  category: '운동' | '식단' | '정신건강' | '질문' | '후기'
  likes_count?: number
  comments_count?: number
  is_public?: boolean
  created_at?: string
  updated_at?: string
  // 조인된 사용자 정보
  user?: {
    id: string
    email: string
    user_metadata?: {
      name?: string
      avatar_url?: string
    }
  }
  // 현재 사용자가 좋아요를 눌렀는지 여부
  is_liked?: boolean
}

// 게시글 생성 타입
export interface CreateCommunityPost {
  title: string
  content: string
  category: '운동' | '식단' | '정신건강' | '질문' | '후기'
  is_public?: boolean
}

// 게시글 업데이트 타입
export interface UpdateCommunityPost {
  title?: string
  content?: string
  category?: '운동' | '식단' | '정신건강' | '질문' | '후기'
  is_public?: boolean
}

// 좋아요 타입
export interface PostLike {
  id?: string
  post_id: string
  user_id?: string
  created_at?: string
}

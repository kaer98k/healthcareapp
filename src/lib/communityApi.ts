import { supabase } from './supabase'
import { CommunityPost, CreateCommunityPost, UpdateCommunityPost, PostLike } from '@/types/community'

// 모든 공개 게시글 조회
export const getCommunityPosts = async (category?: string): Promise<{ data: CommunityPost[] | null; error: any }> => {
  try {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    // 현재 사용자가 좋아요를 눌렀는지 확인
    const postsWithLikes = await Promise.all(
      (data || []).map(async (post) => {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single()

        return {
          ...post,
          is_liked: !!likeData
        }
      })
    )

    return { data: postsWithLikes, error: null }
  } catch (error) {
    console.error('커뮤니티 게시글 조회 오류:', error)
    return { data: null, error }
  }
}

// 게시글 작성
export const createCommunityPost = async (post: CreateCommunityPost): Promise<{ data: CommunityPost | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([post])
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('게시글 작성 오류:', error)
    return { data: null, error }
  }
}

// 게시글 상세 조회
export const getCommunityPost = async (id: string): Promise<{ data: CommunityPost | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // 현재 사용자가 좋아요를 눌렀는지 확인
    const { data: likeData } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    const postWithLike = {
      ...data,
      is_liked: !!likeData
    }

    return { data: postWithLike, error: null }
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error)
    return { data: null, error }
  }
}

// 게시글 업데이트
export const updateCommunityPost = async (id: string, updates: UpdateCommunityPost): Promise<{ data: CommunityPost | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('게시글 업데이트 오류:', error)
    return { data: null, error }
  }
}

// 게시글 삭제
export const deleteCommunityPost = async (id: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('게시글 삭제 오류:', error)
    return { error }
  }
}

// 좋아요 토글
export const togglePostLike = async (postId: string): Promise<{ data: { is_liked: boolean; likes_count: number } | null; error: any }> => {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('로그인이 필요합니다')

    // 현재 좋아요 상태 확인
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.user.id)
      .single()

    if (existingLike) {
      // 좋아요 취소
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.user.id)

      if (deleteError) throw deleteError

      // 좋아요 수 감소
      const { error: updateError } = await supabase
        .from('community_posts')
        .update({ likes_count: supabase.raw('likes_count - 1') })
        .eq('id', postId)

      if (updateError) throw updateError

      return { data: { is_liked: false, likes_count: 0 }, error: null }
    } else {
      // 좋아요 추가
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: user.user.id }])

      if (insertError) throw insertError

      // 좋아요 수 증가
      const { error: updateError } = await supabase
        .from('community_posts')
        .update({ likes_count: supabase.raw('likes_count + 1') })
        .eq('id', postId)

      if (updateError) throw updateError

      return { data: { is_liked: true, likes_count: 1 }, error: null }
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error)
    return { data: null, error }
  }
}

// 사용자의 게시글 조회
export const getUserPosts = async (): Promise<{ data: CommunityPost[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('사용자 게시글 조회 오류:', error)
    return { data: null, error }
  }
}

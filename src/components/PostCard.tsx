import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Repeat2, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';
import { GlassCard } from './GlassCard';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const formattedDate = typeof post.createdAt === 'string' 
    ? post.createdAt 
    : post.createdAt?.seconds 
      ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
      : 'Just now';

  return (
    <GlassCard className="!p-5 mb-4 hover:bg-white/[0.07] transition-colors cursor-pointer border-transparent">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={post.author.avatar} 
            alt={post.author.username} 
            className="w-12 h-12 rounded-full border border-white/10 object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-bold text-white truncate">{post.author.displayName}</span>
              <span className="text-[#A0A0B0] text-sm truncate">@{post.author.username}</span>
              <span className="text-[#6B6B7B] text-sm">• {formattedDate}</span>
            </div>
            <button className="text-[#6B6B7B] hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="text-white/90 mb-3 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>

          {post.image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-white/10">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )}

          {post.animeTag && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-medium mb-3">
              <span>📺</span>
              {post.animeTag.title}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-2 text-[#A0A0B0]">
            <button className="flex items-center gap-2 hover:text-[#4ECDC4] group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#4ECDC4]/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{post.repliesCount}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-[#00D26A] group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#00D26A]/10">
                <Repeat2 size={18} />
              </div>
              <span className="text-sm">{post.repostsCount}</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 group transition-colors ${liked ? 'text-[#EF4444]' : 'hover:text-[#EF4444]'}`}
            >
              <div className="p-2 rounded-full group-hover:bg-[#EF4444]/10">
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-[#FF6B35] group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-[#FF6B35]/10">
                <Share2 size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const authModal = useAuthModal();
  const { user } = useUser();
  const [isliked, setIsLiked] = useState(false);
  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const fetchdata = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };
    fetchdata();
  }, [songId, supabaseClient, user?.id]);
  const Icon = isliked ? AiFillHeart : AiOutlineHeart;
  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }
    if (isliked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);
      if (error) {
        toast.error(error.message);
        return;
      } else {
        setIsLiked(false);
        toast.success("Unliked!");
      }
    } else {
      const { error } = await supabaseClient
        .from("liked_songs")
        .insert({ user_id: user.id, song_id: songId });
      if (error) {
        toast.error(error.message);
        return;
      } else {
        setIsLiked(true);
        toast.success("Liked!");
      }
    }
    router.refresh();
  };
  return (
    <button
      className="cursor-pointer hover:opacity-75 transition"
      onClick={handleLike}
    >
      <Icon color={isliked ? "22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;

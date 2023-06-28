"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import React from "react";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  if (songs.length === 0)
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No songs found
      </div>
    );

  return (
    <div className="flex flex-col px-6 gap-y-2 w-full">
      {songs.map((item) => (
        <div key={item.id} className="flex items-center w-full gap-x-4">
          <div className="flex-1">
            <MediaItem data={item} onClick={(id: string) => onPlay(id)} />
          </div>
          {/* add like btn here */}
          <LikeButton songId={item.id} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;

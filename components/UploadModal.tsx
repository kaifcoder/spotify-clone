"use client";

import React, { useState } from "react";
import uniqid from "uniqid";
import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imagefile = values.image?.[0];
      const songfile = values.song?.[0];
      if (!imagefile || !songfile || !user) {
        toast.error("something went wrong");
        return;
      }
      const uniqueId = uniqid();
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueId}`, songfile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (songError) {
        setIsLoading(false);
        toast.error("song upload failed");
        return;
      }
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueId}`, imagefile, {
            cacheControl: "3600",
            upsert: false,
          });
      if (imageError) {
        setIsLoading(false);
        toast.error("image upload failed");
        return;
      }
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });
      if (supabaseError) {
        setIsLoading(false);
        toast.error("something went wrong uploading song");
      }
      setIsLoading(false);
      router.refresh();
      toast.success("song uploaded successfully");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("something went wrong error occured");
      reset;
      return;
    }
  };
  return (
    <Modal
      title="Upload Song"
      description="Upload your song to the cloud "
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", {
            required: true,
          })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", {
            required: true,
          })}
          placeholder="Author name"
        />
        <div>
          <div className="pb-1">Select a Song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", {
              required: true,
            })}
          />
        </div>
        <div>
          <div className="pb-1">Select a Image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", {
              required: true,
            })}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          Upload
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;

"use client";

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const searchParams = useSearchParams();
  const userid = searchParams.get("userid");
  const router = useRouter();
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (hasConfirmed) {
      try {
        await fetch(`api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const linkToFetch = () => {
        if (!userid) {
          return `/api/users/${session?.user.id}/posts`;
        } else return `/api/users/${userid}/posts`;
      };
      const response = await fetch(linkToFetch());
      const data = await response.json();
      setPosts(data);
      const getName = () => {
        if (!userid || session?.user.id === userid) {
          return "My";
        } else {
          return `${data[0].creator.username}'s`;
        }
      };

      const getDescription = () => {
        if (!userid || session?.user.id === userid) {
          return "Welcome to your personalized profile page";
        } else {
          return `Welcome to ${data[0].creator.username}'s personalized profile page. Explore ${data[0].creator.username}'s exceptional prompts and be inspired by the power of their imagination`;
        }
      };
      setName(getName());
      setDesc(getDescription());
    };

    if (session?.user.id) fetchPosts();
  }, [session]);
  return (
    <Profile
      name={name}
      desc={desc}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    ></Profile>
  );
};

export default MyProfile;

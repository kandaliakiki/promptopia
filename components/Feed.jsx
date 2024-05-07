"use client";

import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        ></PromptCard>
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [textToSearch, setTextToSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setTextToSearch(searchText), 500);

    //return is for calling cleanup function
    //The cleanup function is called when useEffect is called again or on unmount.
    //jadi sblm slesai set texttosearch dalem 500ms useeffect udh kepanggil lagi dan clear yg ngeset sblmnya
    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt", { cache: "no-store" });
      const data = await response.json();

      if (textToSearch !== "") {
        const regex = new RegExp(`.*${textToSearch}.*`, "i");
        const filteredData = data.filter(
          (post) =>
            regex.test(post.creator.username) ||
            regex.test(post.prompt) ||
            regex.test(post.tag)
        );
        setPosts(filteredData);
      } else setPosts(data);
    };

    fetchPosts();
  }, [textToSearch]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        ></input>
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={(tag) => {
          setSearchText(tag);
        }}
      ></PromptCardList>
    </section>
  );
};

export default Feed;

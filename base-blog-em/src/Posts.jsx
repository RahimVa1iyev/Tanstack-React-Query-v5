import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClinet = useQueryClient()

  useEffect(() => {
    const nextPage = currentPage +1
      queryClinet.prefetchQuery({
        queryKey: ['get-posts', nextPage],
        queryFn: () => fetchPosts(nextPage)
      })

  }, [currentPage, queryClinet])


  // replace with useQuery
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['get-posts', currentPage],
    queryFn: () => fetchPosts(currentPage)
  });

  const deleteMutation = useMutation({
    mutationFn : (id) =>deletePost(id),
  })

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (isError) {
    return (
      <>
        <p> {error.toString()} </p>
      </>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage === 0} onClick={() => { setCurrentPage(prev => prev - 1) }}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled={currentPage >= data?.length/currentPage} onClick={() => { setCurrentPage(prev => prev + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} deleteMutation= {deleteMutation} />}
    </>
  );
}

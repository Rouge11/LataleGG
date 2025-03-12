import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Comments from "../../components/Comments";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const postRef = doc(db, "posts", id);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setPost(postDoc.data());
      }
    } catch (error) {
      console.error("게시글 로딩 오류:", error);
    }
  };

  if (!post) return <div>게시글을 불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-12 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
      <small className="text-gray-500">{new Date(post.createdAt.toDate()).toLocaleString()}</small>

      {/* ✅ 댓글 추가 */}
      <Comments postId={id} />
    </div>
  );
}

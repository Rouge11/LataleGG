// components/PostModal.js
import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Comments from "./Comments";

export default function PostModal({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (postId) {
      const postRef = doc(db, "posts", postId);
      const unsubscribe = onSnapshot(postRef, (docSnap) => {
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost({ id: docSnap.id, ...postData });
          setLikes(postData.likes || []);
        }
      });
      return () => unsubscribe();
    }
  }, [postId]);

  const handleLikePost = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postRef = doc(db, "posts", postId);
    const userLiked = likes.includes(user.uid);

    try {
      const updatedLikes = userLiked
        ? likes.filter((uid) => uid !== user.uid)
        : [...likes, user.uid];

      await updateDoc(postRef, { likes: updatedLikes });
      setLikes(updatedLikes);
    } catch (error) {
      console.error("추천 오류:", error);
    }
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold">{post.title}</h2>
        <div className="text-sm text-gray-500 flex justify-between">
          <p>{post.nickname}</p>
          <p>{post.createdAt?.toDate && new Date(post.createdAt.toDate()).toLocaleString()}</p>
        </div>
        <p className="mt-4 whitespace-pre-line">{post.content}</p>

        <div className="mt-4">
          <button
            onClick={handleLikePost}
            className={`mr-2 ${
              likes.includes(user?.uid) ? "text-red-500" : "text-gray-500"
            } transition`}
          >
            ❤️ {likes.length}
          </button>
        </div>

        {/* 댓글 */}
        <Comments postId={postId} />
      </div>
    </div>
  );
}

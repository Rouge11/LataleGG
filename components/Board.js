import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { format } from "date-fns"; // ✅ 올바른 방식
import { ko } from "date-fns/locale"; // ✅ 한국어 로케일 적용

export default function Board() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 자유게시판</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border-b border-gray-300 py-4 last:border-none">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {post.nickname}
              </span>
              <span className="text-sm text-gray-500">
                {post.createdAt
                  ? format(post.createdAt.toDate(), "yyyy-MM-dd HH:mm", { locale: ko })
                  : "날짜 없음"}
              </span>
            </div>
            <p className="text-gray-700 mt-2">{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

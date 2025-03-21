import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Comments from "../components/Comments";
import LoginModal from "../components/LoginModal";
import PostModal from "../components/PostModal"; // ✅ 추가

export default function Board({ user }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("nickname") || "" : ""
  );
  const [posts, setPosts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastPostTime, setLastPostTime] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null); // ✅ 모달용 상태

  useEffect(() => {
    fetchPostsWithCommentsCount();
  }, []);

  const fetchPostsWithCommentsCount = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate
          ? docSnap.data().createdAt.toDate()
          : new Date(docSnap.data().createdAt),
        commentsCount: docSnap.data().commentsCount ?? 0,
      }));

      setPosts(updatedPosts);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    if (user) fetchNickname();
  }, [user]);

  const fetchNickname = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const fetchedNickname = userDoc.data().nickname || "익명";
        setNickname(fetchedNickname);
      }
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes.includes(user.uid)
                ? p.likes.filter((uid) => uid !== user.uid)
                : [...p.likes, user.uid],
            }
          : p
      )
    );

    const postRef = doc(db, "posts", postId);
    const userLiked = posts.find((p) => p.id === postId)?.likes.includes(user.uid);

    try {
      const updatedLikes = userLiked
        ? posts.find((p) => p.id === postId)?.likes.filter((uid) => uid !== user.uid)
        : [...(posts.find((p) => p.id === postId)?.likes || []), user.uid];

      await updateDoc(postRef, { likes: updatedLikes });
    } catch (error) {
      console.error("추천 기능 오류:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const now = new Date();
    if (lastPostTime && now - lastPostTime < 3 * 60 * 1000) {
      const remaining = Math.ceil((3 * 60 * 1000 - (now - lastPostTime)) / 1000);
      alert(`게시글은 3분에 한 번만 작성할 수 있습니다. (${remaining}초 남음)`);
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        nickname,
        userId: user.uid,
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
      });

      setTitle("");
      setContent("");
      setIsWriting(false);
      setLastPostTime(now);
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📌 자유게시판</h2>

      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        {!isWriting ? (
          <div
            className="w-full p-2 text-gray-500 cursor-pointer border-b border-gray-300"
            onClick={() => {
              if (!user) {
                setShowLoginModal(true);
                return;
              }
              setIsWriting(true);
            }}
          >
            새 글을 작성해주세요!
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={4}
              className="w-full border p-2 rounded-lg resize-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsWriting(false)}
                className="cursor-pointer px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
              <button
                onClick={handleCreatePost}
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                게시
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-b py-4 cursor-pointer"
            onClick={() => setSelectedPostId(post.id)}
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.nickname}</p>
            </div>
            {/* ✅ 본문 3줄 초과 시 생략, 줄바꿈 유지 */}
            <p className="text-gray-700 whitespace-pre-line line-clamp-3">
              {post.content}
            </p>
            <small className="text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </small>

            <div className="flex items-center mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePost(post.id);
                }}
                className={`mr-2 ${
                  post.likes?.includes(user?.uid) ? "text-red-500" : "text-gray-500"
                } transition`}
              >
                ❤️ {post.likes?.length || 0}
              </button>
              <span className="ml-4 text-gray-500">💬 {post.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* ✅ 모달 항상 렌더링 + 애니메이션 위해 visible prop 전달 */}
      <PostModal
        postId={selectedPostId}
        visible={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
      />

    </div>
  );
}

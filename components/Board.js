import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";
import { getDocs } from "firebase/firestore"; // ✅ getDocs 추가
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Board() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState(""); // ✅ 제목 추가
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({}); // ✅ 댓글 개수 상태 추가
  const [lastPostTime, setLastPostTime] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchNickname();
    }

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (posts.length > 0) {
      fetchCommentsCount();
    }
  }, [posts]);

  // ✅ Firestore에서 로그인한 유저의 닉네임 가져오기
  const fetchNickname = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setNickname(userDoc.data().nickname || "익명");
      }
    }
  };

  // ✅ Firestore에서 각 게시글의 댓글 개수 가져오기
  const fetchCommentsCount = async () => {
    let counts = {};
    for (let post of posts) {
      const commentsRef = collection(db, "posts", post.id, "comments");
      const querySnapshot = await getDocs(commentsRef);
      counts[post.id] = querySnapshot.size;
    }
    setCommentsCount(counts);
  };

  // ✅ 게시글 작성
  const handlePostSubmit = async () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력하세요.");
    if (!user) return router.push("/login");

    const now = new Date();
    if (lastPostTime && now - lastPostTime < 60000) {
      alert("1분에 한 개의 게시글만 작성할 수 있습니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        createdAt: now,
        nickname,
        userId: user.uid,
        likes: [], // ✅ 추천한 유저 목록 추가
      });

      setTitle("");
      setContent("");
      setLastPostTime(now);
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  // ✅ 추천(좋아요) 기능
  const handleLikePost = async (postId, likes) => {
    if (!user) return router.push("/login");

    const postRef = doc(db, "posts", postId);
    const userLiked = likes.includes(user.uid);

    try {
      await updateDoc(postRef, {
        likes: userLiked ? likes.filter((uid) => uid !== user.uid) : [...likes, user.uid],
      });
    } catch (error) {
      console.error("추천 기능 오류:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📌 자유게시판</h2>

      {/* ✅ 게시글 작성 */}
      {user && (
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요..."
            className="w-full p-2 border rounded-lg mb-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            className="w-full p-2 border rounded-lg"
          />
          <button onClick={handlePostSubmit} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
            게시글 등록
          </button>
        </div>
      )}

      {/* ✅ 게시글 목록 + 추천 기능 + 댓글 개수 표시 */}
      <div>
        {posts.map((post) => (
          <div key={post.id} className="border-b py-3 relative cursor-pointer" onClick={() => router.push(`/post/${post.id}`)}>
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
            <small className="text-gray-500">{new Date(post.createdAt.toDate()).toLocaleString()}</small>

            {/* ✅ 추천 버튼 & 댓글 개수 추가 */}
            <div className="flex items-center mt-2">
              {/* ❤️ 추천 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePost(post.id, post.likes || []);
                }}
                className={`mr-2 ${(post.likes || []).includes(user?.uid) ? "text-red-500" : "text-gray-500"}`}
              >
                ❤️ {(post.likes || []).length}
              </button>

              {/* 💬 댓글 개수 */}
              <button className="text-gray-500">
                💬 {commentsCount[post.id] || 0}
              </button>

              {/* ✅ 본인 게시글 삭제 버튼 */}
              {user?.uid === post.userId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id, post.userId);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

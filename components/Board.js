import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

export default function Board({ user }) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [likes, setLikes] = useState({});
  const [lastPostTime, setLastPostTime] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);

      // 추천 상태 초기화
      let newLikes = {};
      postsData.forEach((post) => {
        newLikes[post.id] = post.likes || [];
      });
      setLikes(newLikes);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNickname();
    }
  }, [user]);

  useEffect(() => {
    if (posts.length > 0) {
      fetchCommentsCount();
    }
  }, [posts]);

  const fetchNickname = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setNickname(userDoc.data().nickname || "익명");
      }
    }
  };

  const fetchCommentsCount = async () => {
    let counts = {};
    for (let post of posts) {
      const commentsRef = collection(db, "posts", post.id, "comments");
      const querySnapshot = await getDocs(commentsRef);
      counts[post.id] = querySnapshot.size;
    }
    setCommentsCount(counts);
  };

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
        createdAt: new Date(),
        nickname,
        userId: user.uid,
        likes: [],
      });

      setTitle("");
      setContent("");
      setIsWriting(false);
      setLastPostTime(now);
    } catch (error) {
      console.error("게시글 작성 오류:", error);
    }
  };

  // ✅ 추천(좋아요) 기능
  const handleLikePost = async (postId) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const postLikes = postSnapshot.data().likes || [];
      const userLiked = postLikes.includes(user.uid);

      const updatedLikes = userLiked
        ? postLikes.filter((uid) => uid !== user.uid)
        : [...postLikes, user.uid];

      await updateDoc(postRef, { likes: updatedLikes });

      setLikes((prev) => ({
        ...prev,
        [postId]: updatedLikes,
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📌 자유게시판</h2>

      {user && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          {!isWriting ? (
            <div
              className="w-full p-2 text-gray-500 cursor-pointer border-b border-gray-300"
              onClick={() => setIsWriting(true)}
            >
              새 글을 작성해주세요!
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요..."
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요..."
                className="w-full p-2 border rounded-lg"
              />
              <button onClick={handlePostSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg self-end">
                게시하기
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        {posts.map((post) => (
          <div key={post.id} className="border-b py-4 cursor-pointer" onClick={() => router.push(`/post/${post.id}`)}>
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.nickname}</p>
            </div>
            <p className="text-gray-700">{post.content}</p>
            <small className="text-gray-500">{new Date(post.createdAt.toDate()).toLocaleString()}</small>

            <div className="flex items-center mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePost(post.id);
                }}
                className={`mr-2 ${
                  likes[post.id]?.includes(user?.uid) ? "text-red-500" : "text-gray-500"
                } transition`}
              >
                ❤️ {likes[post.id]?.length || 0}
              </button>
              <button className="text-gray-500">💬 {commentsCount[post.id] || 0}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage } from "../lib/firebase";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Comments from "../components/Comments";
import LoginModal from "../components/LoginModal";
import PostModal from "../components/PostModal";

async function checkInappropriateContent(file) {
  if (!file) return false;

  // 1) 브라우저에서 파일 → Base64 변환
  const base64Img = await toBase64(file);

  // 2) Vision API 호출용 Payload
  const requestBody = {
    requests: [
      {
        image: { content: base64Img },
        features: [{ type: "SAFE_SEARCH_DETECTION" }],
      },
    ],
  };

  // 3) 실제 API 키 (테스트 시 아래에 직접 key를 써둘 수 있지만, 배포 시엔 절대 노출 금지!)
  const API_KEY = process.env.NEXT_PUBLIC_GCLOUD_API_KEY || "YOUR_GCLOUD_API_KEY";
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

  // 4) Fetch로 Vision API 호출
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  const data = await res.json();

  // 5) SafeSearch 결과 파싱
  const safeSearch = data?.responses?.[0]?.safeSearchAnnotation;
  if (!safeSearch) {
    // 감지 정보 없으면 부적절 아니라고 가정
    return false;
  }

  // ADULT / SPOOF / MEDICAL / VIOLENCE / RACY = "UNKNOWN", "VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "LIKELY", "VERY_LIKELY"
  const isAdult =
    ["POSSIBLE", "LIKELY", "VERY_LIKELY"].includes(safeSearch.adult);
  const isViolent =
    ["POSSIBLE", "LIKELY", "VERY_LIKELY"].includes(safeSearch.violence);
  const isRacy =
    ["POSSIBLE", "LIKELY", "VERY_LIKELY"].includes(safeSearch.racy);

  // 예시로 성인(Adult), 폭력(Violence), 선정적(Racy) 중 하나라도 가능 이상이면 부적절하다고 처리
  return isAdult || isViolent || isRacy;
}

// 파일 → Base64 변환
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // "data:image/png;base64,iVBORw0K..." 형태이므로 앞부분(data:...) 제거
      const base64 = result.replace(/^data:.*;base64,/, "");
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

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
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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
    const userLiked = posts
      .find((p) => p.id === postId)
      ?.likes.includes(user.uid);

    try {
      const updatedLikes = userLiked
        ? posts
            .find((p) => p.id === postId)
            ?.likes.filter((uid) => uid !== user.uid)
        : [...(posts.find((p) => p.id === postId)?.likes || []), user.uid];

      await updateDoc(postRef, { likes: updatedLikes });
    } catch (error) {
      console.error("추천 기능 오류:", error);
    }
  };

  // 게시글 작성
  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 3분 쿨타임
    const now = new Date();
    if (lastPostTime && now - lastPostTime < 3 * 60 * 1000) {
      const remaining = Math.ceil((3 * 60 * 1000 - (now - lastPostTime)) / 1000);
      alert(`게시글은 3분에 한 번만 작성할 수 있습니다. (${remaining}초 남음)`);
      return;
    }

    try {

      let finalNickname = nickname || "익명";

      // 4) Firestore에 문서 추가
      await addDoc(collection(db, "posts"), {
        title,
        content,
        nickname: finalNickname,
        userId: user.uid,
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
      });

      // 5) 폼 초기화
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

      <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {!isWriting ? (
          <div
            className="w-full p-3 text-gray-400 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-dashed border-gray-300 text-center"
            onClick={() => {
              if (!user) {
                setShowLoginModal(true);
                return;
              }
              setIsWriting(true);
            }}
          >
            ✍️ 새 게시글을 작성하려면 여기를 클릭하세요!
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder-gray-400"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsWriting(false)}
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                취소
              </button>
              <button
                onClick={handleCreatePost}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                게시
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse border-b py-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border-b py-4 cursor-pointer"
              onClick={() => setSelectedPostId(post.id)}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.nickname}</p>
              </div>
              <p className="text-gray-700 whitespace-pre-line line-clamp-3">
                {post.content}
              </p>
              <small className="text-gray-500">
                {post.createdAt && new Date(post.createdAt).toLocaleString()}
              </small>

              <div className="flex items-center mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikePost(post.id);
                  }}
                  className={`mr-2 ${
                    post.likes?.includes(user?.uid)
                      ? "text-red-500"
                      : "text-gray-500"
                  } transition`}
                >
                  ❤️ {post.likes?.length || 0}
                </button>
                <span className="ml-4 text-gray-500">
                  💬 {post.commentsCount}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* 게시글 모달 */}
      <PostModal
        postId={selectedPostId}
        visible={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
      />
    </div>
  );
}
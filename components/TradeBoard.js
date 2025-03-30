import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import TradePostModal from "./TradePostModal";
import LoginModal from "./LoginModal";

export default function TradeBoard({ user }) {
  const [posts, setPosts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  // 거래 글 작성용 상태
  const [selectedTag, setSelectedTag] = useState("[삽니다]");
  const [characterName, setCharacterName] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 마지막 작성 시각
  const [lastTradePostTime, setLastTradePostTime] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "trade"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPosts(updatedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNewPostClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setIsWriting(true);
    setSelectedTag("[삽니다]");
    setCharacterName("");
    setItemName("");
    setPrice("");
  };

  // 🚀 20분 제한 로직
  const handleCreatePost = async () => {
    if (!characterName.trim() || !itemName.trim() || !price.trim()) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    // 1) 20분(=1200초=1,200,000ms) 체크
    const now = new Date();
    if (lastTradePostTime && now - lastTradePostTime < 20 * 60 * 1000) {
      const diff = 20 * 60 * 1000 - (now - lastTradePostTime);
      const remainSec = Math.ceil(diff / 1000);
      alert(`거래 게시글은 20분에 하나만 작성 가능합니다. (약 ${remainSec}초 남음)`);
      return;
    }

    try {
      // 닉네임 가져오기
      let finalNickname = "익명";
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          finalNickname = userSnap.data().nickname || "익명";
        }
      }

      // 제목 자동 생성
      const shortItem = itemName.split(" ")[0];
      const autoTitle = `${selectedTag} ${shortItem}`;
      const pureTag = selectedTag.replace("[", "").replace("]", "");

      await addDoc(collection(db, "trade"), {
        title: autoTitle,
        tag: pureTag,
        characterName,
        itemName,
        price,
        userId: user.uid,
        nickname: finalNickname,
        createdAt: serverTimestamp(),
      });

      // ✅ 작성 후 마지막 작성 시간 갱신
      setLastTradePostTime(now);

      setIsWriting(false);
    } catch (err) {
      console.error("거래 게시글 작성 오류:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">🛒 거래 게시판</h2>

      <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        {!isWriting ? (
          <div
            className="w-full p-3 text-gray-400 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-dashed border-gray-300 text-center"
            onClick={handleNewPostClick}
          >
            ✍️ 새 게시글을 작성하려면 여기를 클릭하세요!
          </div>
        ) : (
          <div className="space-y-3">
            {/* 태그 선택 */}
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-sm">거래 유형:</span>
              <button
                className={`px-2 py-1 rounded ${
                  selectedTag === "[삽니다]" ? "bg-red-400 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedTag("[삽니다]")}
              >
                삽니다
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  selectedTag === "[팝니다]" ? "bg-blue-400 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedTag("[팝니다]")}
              >
                팝니다
              </button>
            </div>

            {/* 캐릭터 닉네임 */}
            <div className="flex gap-2 items-center">
              <label className="font-semibold text-sm">우편/거래 캐릭터:</label>
              <input
                type="text"
                placeholder="ex) 라테일닉네임"
                className="border px-3 py-1 rounded w-52"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </div>

            {/* 아이템 이름 */}
            <div className="flex gap-2 items-center">
              <label className="font-semibold text-sm">아이템 이름:</label>
              <input
                type="text"
                placeholder="ex) 부활의 정수 100개"
                className="border px-3 py-1 rounded w-52"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            {/* 희망 가격 */}
            <div className="flex gap-2 items-center">
              <label className="font-semibold text-sm">희망 가격:</label>
              <input
                type="text"
                placeholder="ex) 26억 Ely"
                className="border px-3 py-1 rounded w-52"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsWriting(false)}
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                취소
              </button>
              <button
                onClick={handleCreatePost}
                className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                작성
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        [...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse border-b py-3 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-center py-8">거래 게시글이 없습니다.</p>
      ) : (
        posts.map((post) => {
          let tagColor = "";
          if (post.tag === "삽니다") tagColor = "text-red-500";
          else if (post.tag === "팝니다") tagColor = "text-blue-500";
          else if (post.tag === "구매완료" || post.tag === "판매완료") {
            tagColor = "text-gray-400";
          }
          return (
            <div
              key={post.id}
              className="border-b py-4 cursor-pointer"
              onClick={() => setSelectedPostId(post.id)}
            >
              <div className="flex justify-between">
                <h3 className={`text-lg font-bold ${tagColor}`}>{post.title}</h3>
                <p className="text-sm text-gray-500">{post.nickname}</p>
              </div>
              <p className="text-gray-700 line-clamp-3">
                캐릭터: {post.characterName}, 아이템: {post.itemName}, 가격:{" "}
                {post.price}
              </p>
              <small className="text-gray-500">
                {post.createdAt?.toDate?.().toLocaleString()}
              </small>
            </div>
          );
        })
      )}

      {/* 로그인 모달 */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* 거래글 모달 */}
      {selectedPostId && (
        <TradePostModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
      )}
    </div>
  );
}

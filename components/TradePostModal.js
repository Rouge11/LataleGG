import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";

export default function TradePostModal({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(auth.currentUser);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const postRef = doc(db, "trade", postId);
    const unsubscribe = onSnapshot(postRef, (snap) => {
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      }
    });
    return () => unsubscribe();
  }, [postId]);

  // 작성자 판별
  const isOwner = user && post && user.uid === post.userId;

  // 태그 색상
  const getTagColor = (tag) => {
    if (tag === "삽니다") return "text-red-500";
    if (tag === "팝니다") return "text-blue-500";
    if (tag === "구매완료" || tag === "판매완료") return "text-gray-400";
    return "";
  };

  const handleComplete = async () => {
    // 삽니다 → 구매완료, 팝니다 → 판매완료
    if (!isOwner) return;
    const docRef = doc(db, "trade", postId);
    let newTag = "";
    let newTitle = post.title;
    if (post.tag === "삽니다") {
      newTag = "구매완료";
      newTitle = post.title.replace("[삽니다]", "[구매완료]");
    } else if (post.tag === "팝니다") {
      newTag = "판매완료";
      newTitle = post.title.replace("[팝니다]", "[판매완료]");
    } else {
      // 이미 완료된 상태
      return;
    }
    await updateDoc(docRef, { tag: newTag, title: newTitle });
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    const confirmDel = confirm("정말 게시글을 삭제하시겠습니까?");
    if (!confirmDel) return;
    try {
      // 댓글 삭제
      const commentsRef = collection(db, "trade", postId, "comments");
      const snap = await getDocs(commentsRef);
      const promises = snap.docs.map((c) => deleteDoc(c.ref));
      await Promise.all(promises);

      // 본문 삭제
      await deleteDoc(doc(db, "trade", postId));
      onClose();
    } catch (err) {
      console.error("거래 게시글 삭제 오류:", err);
    }
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          key="trade-modal-bg"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="trade-modal-box"
            className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <button
              className="cursor-pointer absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={onClose}
            >
              ✖
            </button>

            <h2 className={`text-xl font-bold mb-2 ${getTagColor(post.tag)}`}>
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              작성자: {post.nickname}{" "}
              {post.createdAt?.toDate &&
                "/ " + new Date(post.createdAt.toDate()).toLocaleString()}
            </p>

            {/* 거래 정보 */}
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <strong>캐릭터:</strong> {post.characterName}
              </p>
              <p className="text-sm">
                <strong>아이템:</strong> {post.itemName}
              </p>
              <p className="text-sm">
                <strong>가격:</strong> {post.price}
              </p>
            </div>

            {isOwner && (post.tag === "삽니다" || post.tag === "팝니다") && (
              <button
                onClick={handleComplete}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded mr-2"
              >
                {post.tag === "삽니다" ? "구매완료" : "판매완료"}
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-300 hover:bg-red-400 text-sm text-white rounded"
              >
                삭제
              </button>
            )}
          </motion.div>
          {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

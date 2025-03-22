import { useState, useEffect } from "react";
import {
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export default function CommentItem({ comment, postId, currentUser }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [nickname, setNickname] = useState("익명");
  const [lastReplyTime, setLastReplyTime] = useState(null);
  const isReply = !!comment.parentId;

  useEffect(() => {
    const fetchNickname = async () => {
      if (currentUser?.uid) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || "익명");
        }
      }
    };
    fetchNickname();
  }, [currentUser]);

  const handleDelete = async () => {
    const confirmDelete = confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId, "comments", comment.id));
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentsCount: increment(-1) });
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  const handleReplySubmit = async () => {
    if (!currentUser) return;
    if (!replyText.trim()) return;

    const now = new Date();
    if (lastReplyTime && now - lastReplyTime < 60 * 1000) {
      const remaining = Math.ceil((60 * 1000 - (now - lastReplyTime)) / 1000);
      alert(`대댓글은 1분에 한 번만 작성할 수 있습니다. (${remaining}초 남음)`);
      return;
    }

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: replyText,
        nickname,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        parentId: comment.id,
      });

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
      });

      setReplyText("");
      setShowReplyForm(false);
      setLastReplyTime(now); // ✅ 마지막 작성 시간 갱신
    } catch (error) {
      console.error("대댓글 작성 오류:", error);
    }
  };

  const handleReplyKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  };

  return (
    <div
      className={`relative border border-gray-200 rounded-lg p-4 bg-gray-50 ${
        isReply ? "ml-6 mt-1" : "mb-1"
      }`}
    >
      <div className="flex justify-between mb-1">
        <p className="text-sm font-semibold text-gray-700">{comment.nickname}</p>
        <p className="text-xs text-gray-400">
          {comment.createdAt?.toDate &&
            new Date(comment.createdAt.toDate()).toLocaleString()}
        </p>
      </div>

      <p
        className={`whitespace-pre-line text-gray-800 text-sm ${
          !isReply ? "cursor-pointer hover:underline" : ""
        }`}
        onClick={() => {
          if (!isReply) setShowReplyForm((prev) => !prev);
        }}
      >
        {comment.text || comment.content || ""}
      </p>

      {!isReply && showReplyForm && (
        <div className="mt-2 ml-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleReplyKeyDown}
            rows={2}
            placeholder="대댓글을 입력하세요"
            className="w-full border p-2 rounded-md resize-none text-sm"
          />
          <div className="text-right mt-1">
            <button
              onClick={handleReplySubmit}
              className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              게시
            </button>
          </div>
        </div>
      )}

      {currentUser?.uid === comment.userId && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 cursor-pointer"
        >
          삭제
        </button>
      )}
    </div>
  );
}

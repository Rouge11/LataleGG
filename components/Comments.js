import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import LoginModal from "./LoginModal";
import CommentItem from "./CommentItem";

export default function Comments({ postId, initialComments = [] }) {
  const [user, setUser] = useState(auth.currentUser);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [nickname, setNickname] = useState("");
  const [lastCommentTime, setLastCommentTime] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!postId) return;
  
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  
    if (user) fetchNickname();
  
    return () => unsubscribe();
  }, [postId, user]);
  
  const fetchNickname = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setNickname(userDoc.data().nickname || "익명");
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!content.trim()) return alert("댓글을 입력하세요.");
    if (!user) return setShowLoginModal(true);

    const now = new Date();
    if (lastCommentTime && now - lastCommentTime < 60000) {
      alert("1분에 한 개의 댓글만 작성할 수 있습니다.");
      return;
    }

    // ✅ 즉시 입력창 비움 (지연 없이 깔끔)
    setContent("");

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        content,
        createdAt: now,
        nickname,
        userId: user.uid,
      });

      await updateDoc(doc(db, "posts", postId), {
        commentsCount: increment(1),
      });

      setLastCommentTime(now);
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleDelete = async (commentId, commentUserId) => {
    if (user?.uid !== commentUserId) return alert("본인 댓글만 삭제할 수 있습니다.");
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
      await updateDoc(doc(db, "posts", postId), {
        commentsCount: increment(-1),
      });
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <div className="mt-4">
      {/* 댓글 입력창 */}
      <div className="flex items-start border rounded-lg p-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글 달기..."
          rows={2}
          onKeyDown={handleKeyDown}
          className="w-full outline-none resize-none"
        />
        <button
          onClick={handleCommentSubmit}
          className="cursor-pointer text-blue-500 hover:text-blue-700 transition px-4 whitespace-nowrap"
        >
          게시
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            isOwner={user?.uid === comment.userId}
          />
        ))}
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

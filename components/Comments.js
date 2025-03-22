import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import CommentItem from "./CommentItem";
import LoginModal from "./LoginModal";

export default function Comments({ postId, initialComments = [], loading, postAuthorId }) {
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState("");
  const [nickname, setNickname] = useState("익명");
  const [user, setUser] = useState(auth.currentUser);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({}); // ✅ 댓글별 대댓글 펼침 상태

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (user) fetchNickname();
  }, [user]);

  const fetchNickname = async () => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const fetchedNickname = userDoc.data().nickname || "익명";
      setNickname(fetchedNickname);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!comment.trim()) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: comment,
        nickname,
        userId: user.uid,
        createdAt: serverTimestamp(),
        parentId: null,
      });

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
      });

      setComment("");
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleReplies = (parentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  return (
    <div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="댓글을 입력하세요"
        className="w-full border p-2 rounded-md resize-none"
      />
      <div className="text-right mt-1">
        <button
          onClick={handleSubmit}
          className="cursor-pointer px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          게시
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-2 mb-4">
              <div className="h-3 bg-gray-300 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-center pt-4">댓글이 없습니다.</p>
        ) : (
          comments
            .filter((c) => !c.parentId)
            .map((parent) => {
              const childReplies = comments.filter(
                (child) => child.parentId === parent.id
              );
              const isExpanded = expandedReplies[parent.id];

              return (
                <div key={parent.id} className="mb-3 space-y-1">
                  <CommentItem
                    comment={parent}
                    postId={postId}
                    currentUser={user}
                    postAuthorId={postAuthorId}
                  />

                  {childReplies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(parent.id)}
                      className="text-xs text-gray-400 hover:text-gray-600 ml-1 mb-1 cursor-pointer"
                    >
                      {isExpanded
                        ? "답글 숨기기"
                        : `답글 ${childReplies.length}개 보기`}
                    </button>
                  )}

                  {isExpanded &&
                    childReplies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        postId={postId}
                        currentUser={user}
                        postAuthorId={postAuthorId}
                      />
                    ))}
                </div>
              );
            })
        )}
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

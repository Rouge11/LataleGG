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

export default function Comments({ postId }) {
  const [user, setUser] = useState(auth.currentUser);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [nickname, setNickname] = useState("");
  const [lastCommentTime, setLastCommentTime] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    if (user) {
      fetchNickname();
    }

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
    if (!user) return router.push("/login");

    const now = new Date();
    if (lastCommentTime && now - lastCommentTime < 60000) {
      alert("1분에 한 개의 댓글만 작성할 수 있습니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        content,
        createdAt: now,
        nickname,
        userId: user.uid,
      });

      // ✅ 댓글 수 증가
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(1),
      });

      setContent("");
      setLastCommentTime(now);
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    if (user?.uid !== commentUserId) return alert("본인 댓글만 삭제할 수 있습니다.");

    const confirmDelete = confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));

      // ✅ 댓글 수 감소
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(-1),
      });
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  return (
    <div className="mt-4">
      {user && (
        <div className="flex items-center border rounded-lg p-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글 달기..."
            className="w-full outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            게시
          </button>
        </div>
      )}

      {/* ✅ 댓글 목록 */}
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b py-2 relative">
            <p className="font-semibold">{comment.nickname}</p>
            <p>{comment.content}</p>
            <small className="text-gray-500">
              {new Date(comment.createdAt.toDate()).toLocaleString()}
            </small>

            {/* 🔥 댓글 삭제 버튼 */}
            {user?.uid === comment.userId && (
              <button
                onClick={() => handleDeleteComment(comment.id, comment.userId)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

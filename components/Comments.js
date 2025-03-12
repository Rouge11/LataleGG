import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, deleteDoc } from "firebase/firestore";

export default function Comments({ postId }) {
  const [user, setUser] = useState(auth.currentUser);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [nickname, setNickname] = useState(""); // ✅ 닉네임 상태 추가
  const [lastCommentTime, setLastCommentTime] = useState(null); // ✅ 마지막 댓글 시간 저장

  useEffect(() => {
    // Firestore에서 해당 게시글의 댓글 실시간 가져오기
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    if (user) {
      fetchNickname(); // ✅ 로그인된 유저의 닉네임 가져오기
    }

    return () => unsubscribe();
  }, [postId, user]);

  // ✅ Firestore에서 로그인한 사용자의 닉네임 가져오기
  const fetchNickname = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setNickname(userDoc.data().nickname || "익명");
      }
    }
  };

  // ✅ 댓글 작성
  const handleCommentSubmit = async () => {
    if (!content.trim()) return alert("댓글을 입력하세요.");
    if (!user) return router.push("/login");

    const now = new Date();
    
    // ✅ 도배 방지: 마지막 댓글 작성 후 1분이 지나지 않으면 작성 불가
    if (lastCommentTime && now - lastCommentTime < 60000) {
      alert("1분에 한 개의 댓글만 작성할 수 있습니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        content,
        createdAt: now,
        nickname, // ✅ 실제 닉네임 저장
        userId: user.uid,
      });

      setContent(""); // 입력 필드 초기화
      setLastCommentTime(now); // ✅ 마지막 댓글 작성 시간 업데이트
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  // ✅ 댓글 삭제 기능
  const handleDeleteComment = async (commentId, commentUserId) => {
    if (user?.uid !== commentUserId) return alert("본인 댓글만 삭제할 수 있습니다.");

    const confirmDelete = confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  return (
    <div className="mt-4">
      {user && (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full p-2 border rounded-lg"
          />
          <button onClick={handleCommentSubmit} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
            댓글 등록
          </button>
        </div>
      )}

      {/* ✅ 댓글 목록 + 삭제 기능 */}
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b py-2 relative">
            <p className="font-semibold">{comment.nickname}</p>
            <p>{comment.content}</p>
            <small className="text-gray-500">{new Date(comment.createdAt.toDate()).toLocaleString()}</small>

            {/* ✅ 본인 댓글 삭제 버튼 */}
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

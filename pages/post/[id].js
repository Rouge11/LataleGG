import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, deleteDoc, collection, query, orderBy, onSnapshot, getDocs, updateDoc, writeBatch } from "firebase/firestore";
import Comments from "../../components/Comments";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(auth.currentUser);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  // ✅ Firestore에서 게시글 데이터 가져오기 (실시간 업데이트)
  const fetchPost = () => {
    const postRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost({ id: docSnap.id, ...postData });
        setLikes(postData.likes || []); // ✅ 좋아요 목록 업데이트
      } else {
        router.push("/"); // 존재하지 않는 게시글이면 메인으로 이동
      }
    });
    return unsubscribe;
  };

  // ✅ Firestore에서 해당 게시글의 댓글 실시간 가져오기
  const fetchComments = () => {
    const q = query(collection(db, "posts", id, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  };

  // ✅ 게시글 삭제 기능 (댓글도 함께 삭제)
  const handleDeletePost = async () => {
    const confirmDelete = confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const batch = writeBatch(db); // 🔥 Firestore 배치 삭제 시작

      // 🔹 1️⃣ 해당 게시글의 모든 댓글 가져오기
      const commentsQuery = collection(db, "posts", id, "comments");
      const commentsSnapshot = await getDocs(commentsQuery);

      // 🔹 2️⃣ 댓글들 삭제 요청 추가
      commentsSnapshot.forEach((doc) => {
        batch.delete(doc.ref); // Firestore 댓글 삭제
      });

      // 🔹 3️⃣ 게시글 삭제 요청 추가
      batch.delete(doc(db, "posts", id));

      // 🔹 4️⃣ Firestore에서 배치 삭제 실행
      await batch.commit();

      router.push("/"); // 삭제 후 메인 페이지로 이동
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
    }
  };

  // ✅ 게시글 추천(좋아요) 기능
  const handleLikePost = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postRef = doc(db, "posts", id);
    const userLiked = likes.includes(user.uid);

    try {
      const updatedLikes = userLiked
        ? likes.filter((uid) => uid !== user.uid) // 좋아요 취소
        : [...likes, user.uid]; // 좋아요 추가

      await updateDoc(postRef, { likes: updatedLikes });

      setLikes(updatedLikes); // ✅ UI에 즉시 반영
    } catch (error) {
      console.error("추천 기능 오류:", error);
    }
  };

  if (!post) return <div className="flex items-center justify-center h-screen">게시글을 불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      {/* ✅ 게시글 정보 */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="flex justify-between text-gray-500 text-sm">
          <p>{post.nickname}</p>
          <p>{new Date(post.createdAt.toDate()).toLocaleString()}</p>
        </div>
        <p className="mt-4">{post.content}</p>

        {/* ✅ 추천(좋아요) 버튼 */}
        <div className="flex items-center mt-2">
          <button
            onClick={handleLikePost}
            className={`mr-2 ${
              likes.includes(user?.uid) ? "text-red-500" : "text-gray-500"
            } transition`}
          >
            ❤️ {likes.length}
          </button>
        </div>

        {/* ✅ 본인 게시글 삭제 버튼 */}
        {user?.uid === post.userId && (
          <button
            onClick={handleDeletePost}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            게시글 삭제
          </button>
        )}
      </div>

      {/* ✅ 댓글 컴포넌트 */}
      <Comments postId={id} />
    </div>
  );
}

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import RightPanel from "../components/RightPanel";
import { collection, query, orderBy, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
import Comments from "../components/Comments";


export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("board");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // ✅ 팝업 상태 추가
  const [comments, setComments] = useState([]); // ✅ 댓글 상태 추가

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedUser) => {
      setUser(loggedUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // ✅ 게시글 클릭 시 팝업 열기 + 댓글 가져오기
  const handlePostClick = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      setSelectedPost({ id: postId, ...postSnapshot.data() });

      // 댓글 가져오기
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentsSnapshot = await getDocs(commentsRef);
      setComments(commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
  };

  // ✅ 팝업 닫기
  const closePopup = () => {
    setSelectedPost(null);
    setComments([]);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar user={user} />
      <div className="flex mt-12">
        <Sidebar setActivePage={setActivePage} />
        <Content activePage={activePage} user={user} onPostClick={handlePostClick} />
        <RightPanel setActivePage={setActivePage} />
      </div>

      {/* ✅ 게시글 상세 팝업 */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>

            <h3 className="text-lg font-bold">{selectedPost.title}</h3>
            <p className="text-sm text-gray-500">{selectedPost.nickname}</p>
            <p className="mt-4">{selectedPost.content}</p>

            {/* ❤️ 좋아요 버튼 */}
            <div className="flex items-center mt-4">
              <button
                onClick={() => handleLikePost(selectedPost.id)}
                className={`mr-2 ${
                  selectedPost.likes?.includes(user?.uid) ? "text-red-500" : "text-gray-500"
                } transition`}
              >
                ❤️ {selectedPost.likes?.length || 0}
              </button>
            </div>

            {/* 🔥 댓글 컴포넌트 */}
            <Comments postId={selectedPost.id} />
          </div>
        </div>
      )}
    </div>
  );
}

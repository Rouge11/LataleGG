// PostModal.js
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../lib/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Comments from "./Comments";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";

export default function PostModal({ postId, visible, onClose }) {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPostAndComments = async () => {
      const postRef = doc(db, "posts", postId);
      const unsubscribe = onSnapshot(postRef, (docSnap) => {
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost({ id: docSnap.id, ...postData });
          setLikes(postData.likes || []);
        }
      });

      const commentsQuery = query(
        collection(db, "posts", postId, "comments"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(commentsQuery);
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
      setCommentsLoading(false);
    };

    fetchPostAndComments();
  }, [postId]);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      );
      const maxHeight = lineHeight * 8;
      setIsOverflow(contentRef.current.scrollHeight > maxHeight + 2);
    }
  }, [post?.content]);

  const handleLikePost = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const postRef = doc(db, "posts", postId);
    const userLiked = likes.includes(user.uid);

    try {
      const updatedLikes = userLiked
        ? likes.filter((uid) => uid !== user.uid)
        : [...likes, user.uid];

      await updateDoc(postRef, { likes: updatedLikes });
      setLikes(updatedLikes);
    } catch (error) {
      console.error("추천 오류:", error);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      const commentSnapshots = await getDocs(commentsRef);
      const deletePromises = commentSnapshots.docs.map((docSnap) =>
        deleteDoc(docSnap.ref)
      );

      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "posts", postId));

      onClose();
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {visible && post && (
          <motion.div
            key="modal-bg"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal-box"
              className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative h-[700px] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <button
                onClick={onClose}
                className="cursor-pointer absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold">{post.title}</h2>
              <div className="text-sm text-gray-500 flex justify-between">
                <p>{post.nickname}</p>
                <p>
                  {post.createdAt?.toDate &&
                    new Date(post.createdAt.toDate()).toLocaleString()}
                </p>
              </div>

              <p
                ref={contentRef}
                className={`mt-4 whitespace-pre-line ${
                  expanded ? "" : "line-clamp-8"
                }`}
              >
                {post.content}
              </p>

              {isOverflow && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 text-sm mt-1 cursor-pointer"
                >
                  {expanded ? "닫기" : "... 더보기"}
                </button>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <button
                    onClick={handleLikePost}
                    className={`cursor-pointer mr-2 ${
                      likes.includes(user?.uid)
                        ? "text-red-500"
                        : "text-gray-500"
                    } transition`}
                  >
                    ❤️ {likes.length}
                  </button>
                </div>

                {user?.uid === post.userId && (
                  <button
                    onClick={handleDeletePost}
                    className="cursor-pointer text-red-500 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>

              <div className="mt-4 h-[calc(700px-230px)] overflow-y-auto pr-2">
                <Comments
                  postId={postId}
                  initialComments={comments}
                  loading={commentsLoading}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}

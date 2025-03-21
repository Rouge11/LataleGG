import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Navbar({ user }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nickname") || "";
    }
    return "";
  });

  useEffect(() => {
    if (user) {
      const fetchNickname = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const fetchedNickname = userDoc.data().nickname || "익명";
            setNickname(fetchedNickname);
            localStorage.setItem("nickname", fetchedNickname);
          }
        } catch (error) {
          console.error("닉네임 가져오기 오류:", error);
          setNickname("익명");
        }
      };

      fetchNickname();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("nickname");

    // ✅ 로그아웃 후 페이지 새로고침
    location.reload();
  };

  const handleLogin = () => {
    setTimeout(() => {
      router.push("/login");
    }, 150);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-700 text-white py-3 px-8 flex justify-between items-center shadow-md z-50">
      <div
        className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition"
        onClick={() => router.push("/")}
      >
        LataleGG
      </div>

      <input
        type="text"
        placeholder="검색어 입력..."
        className="w-1/3 px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800"
      />

      <div>
        {user ? (
          <>
            <span className="mr-4">
              {nickname ? `${nickname}님 환영합니다.` : "닉네임 로딩 중..."}
            </span>
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg shadow-md transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg shadow-md transition"
          >
            로그인
          </motion.button>
        )}
      </div>
    </nav>
  );
}

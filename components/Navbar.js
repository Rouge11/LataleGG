import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Navbar({ user }) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (user) {
      fetchNickname(user.uid);
    }
  }, [user]);

  // ✅ Firestore에서 닉네임 가져오기
  const fetchNickname = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setNickname(userDoc.data().nickname || "익명");
      }
    } catch (error) {
      console.error("닉네임 가져오기 오류:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-700 text-white py-3 px-8 flex justify-between items-center shadow-md z-50">
      <div className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition" onClick={() => router.push("/")}>
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
            <span className="mr-4">{nickname}님 환영합니다.</span>
            <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg shadow-md transition">
              로그아웃
            </button>
          </>
        ) : (
          <button onClick={() => router.push("/login")} className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg shadow-md transition">
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}

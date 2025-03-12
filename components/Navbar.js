import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname || "");
        }
      }
    };

    fetchNickname();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setNickname("");
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-700 text-white py-3 px-8 flex justify-between items-center shadow-md z-50">
      {/* 좌측 - 로고 */}
      <div 
        className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition"
        onClick={() => router.push("/")}
      >
        LataleGG
      </div>

      {/* 중앙 - 검색창 */}
      <input
        type="text"
        placeholder="검색어 입력..."
        className="w-1/3 px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800"
      />

      {/* 우측 - 닉네임 & 로그인/로그아웃 버튼 */}
      <div className="flex items-center space-x-4">
        {user && nickname && <span className="text-lg font-semibold">{nickname}님 환영합니다.</span>}
        {user ? (
          <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg shadow-md transition">
            로그아웃
          </button>
        ) : (
          <button onClick={() => router.push("/login")} className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg shadow-md transition">
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}

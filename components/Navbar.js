import { useState } from "react";
import { auth } from "../lib/firebase"; // Firebase 인증
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white py-3 px-5 flex justify-between items-center shadow-md">
      {/* 좌측 - 로고 */}
      <div className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        LataleGG
      </div>

      {/* 중앙 - 검색창 */}
      <input
        type="text"
        placeholder="검색어 입력..."
        className="w-1/3 px-3 py-1 rounded border border-gray-500 text-black"
      />

      {/* 우측 - 로그인 / 로그아웃 버튼 */}
      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            로그아웃
          </button>
        ) : (
          <button onClick={() => router.push("/login")} className="bg-blue-500 px-4 py-2 rounded">
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}

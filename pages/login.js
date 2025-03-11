import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Firestore에서 닉네임 설정 여부 확인
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().nickname) {
        // 닉네임이 이미 설정된 경우 → 메인 페이지로 이동
        router.push("/");
      } else {
        // 닉네임이 없는 경우 → 닉네임 설정 페이지로 이동
        router.push("/nickname");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">로그인</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          구글 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import { auth, db, googleProvider, kakaoProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();

  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">로그인 선택</h2>

        <button
          onClick={() => handleLogin(googleProvider)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition mb-3 w-full"
        >
          구글 계정으로 로그인
        </button>

        <button
          onClick={() => handleLogin(kakaoProvider)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg shadow-md transition w-full"
        >
          카카오 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

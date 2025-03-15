import { useRouter } from "next/router";
import { auth, db, googleProvider, kakaoProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
        router.push("/");
      } else {
        router.push("/nickname");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* ✅ 로그인 박스 */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-700 w-[400px]">
        {/* ✅ 로그인 폼 상단에 이미지 추가 */}
        <img
          src="/assets/gifs/텐구.gif"
          alt="텐구"
          className="w-full h-60 object-contain mb-4 rounded-lg"
        />

        <h2 className="text-2xl font-bold text-white mb-6">🎮 라테일 GG 로그인</h2>

        <button
          onClick={() => handleLogin(googleProvider)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 mb-4"
        >
          구글 계정으로 로그인
        </button>

        <button
          onClick={() => handleLogin(kakaoProvider)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
        >
          카카오 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

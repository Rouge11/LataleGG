// components/LoginModal.js
import { useRouter } from "next/router";

export default function LoginModal({ onClose }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[320px] text-center shadow-lg relative">
        <img
          src="/assets/gifs/벚나무사령.gif"
          alt="벚나무사령"
          className="w-40 h-40 mx-auto mb-4 rounded-lg object-contain"
        />
        <p className="text-gray-800 text-lg font-semibold mb-4">로그인 후 이용 가능합니다.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-2 transition"
        >
          로그인 하러 가기
        </button>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

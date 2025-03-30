import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlFKylBBggHE2Ff2ujJk54azpvwx4TLac",
  authDomain: "latalegg.firebaseapp.com",
  projectId: "latalegg",
  storageBucket: "latalegg.firebasestorage.app",
  messagingSenderId: "151901183354",
  appId: "1:151901183354:web:dad4c69fd0aa8430250ac3",
  measurementId: "G-21FSN6TLY5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ 로그인 상태 유지 (세션 2시간)
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("세션 유지 설정 완료 (2시간)");
  })
  .catch((error) => {
    console.error("세션 유지 설정 오류:", error);
  });

export const googleProvider = new GoogleAuthProvider();
export const kakaoProvider = new OAuthProvider("oidc.kakao");
export const db = getFirestore(app);
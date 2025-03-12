import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Firestore 모듈 추가

const firebaseConfig = {
  apiKey: "AIzaSyDlFKylBBggHE2Ff2ujJk54azpvwx4TLac",
  authDomain: "latalegg.firebaseapp.com",
  projectId: "latalegg",
  storageBucket: "latalegg.firebasestorage.app",
  messagingSenderId: "151901183354",
  appId: "1:151901183354:web:dad4c69fd0aa8430250ac3",
  measurementId: "G-21FSN6TLY5"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // 구글 로그인
export const kakaoProvider = new OAuthProvider("oidc.kakao"); // 카카오 로그인
export const db = getFirestore(app); // Firestore 연결

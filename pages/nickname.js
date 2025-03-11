import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Nickname() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState("");

  const jobList = [
    "히어로", "검호", "세이버", "세피로트", "아크메이지", "파픈스타", "윈드스토커", "프라이쉬츠",
    "소디언", "소울리스 원", "아크마스터", "포스마스터", "흑영", "데미갓", "아그니", "다크체이서",
    "섀도우워커", "게이트키퍼", "검성", "하이랜더", "소드댄서", "테러나이트", "사이키커", "팬텀메이지",
    "마에스트로", "로그마스터", "저지먼트", "스타시커", "쥬얼스타", "윈디아", "레이니아"
  ];

  const handleSaveNickname = async () => {
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");
    if (!job) return alert("직업을 선택해주세요.");

    try {
      const user = auth.currentUser;
      if (!user) return alert("로그인 상태가 아닙니다.");

      // Firestore에 닉네임과 직업 저장
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { nickname, job }, { merge: true });

      // 닉네임 & 직업 저장 후 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("닉네임 저장 오류:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">닉네임 및 직업 설정</h2>

        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-lg w-full mb-3"
        />

        <select
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-lg w-full mb-3"
        >
          <option value="">직업 선택</option>
          {jobList.map((jobName, index) => (
            <option key={index} value={jobName}>
              {jobName}
            </option>
          ))}
        </select>

        <button
          onClick={handleSaveNickname}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          저장
        </button>
      </div>
    </div>
  );
}

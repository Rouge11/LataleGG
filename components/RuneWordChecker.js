import React, { useState } from "react";

const runes = [
  { id: 1, name: "혈통", score: 12, effect: "근력/마법력 1500 증가" },
  { id: 2, name: "강철", score: 5, effect: "체력 1500 증가" },
  { id: 3, name: "행운", score: 0, effect: "행운 1500 증가" },
  { id: 4, name: "서약", score: 0, effect: "퀘스트 보상 20%, 옵션 발생 확률 500%" },
  { id: 5, name: "분노", score: 30, effect: "무기공격력/속성력 70 증가" },
  { id: 6, name: "축복", score: 0, effect: "엘리 획득 50% 증가" },
  { id: 7, name: "헌신", score: 100, effect: "최소 대미지 50% 증가" },
  { id: 8, name: "풍요", score: 0, effect: "아이템 발생 확률 20% 증가" },
  { id: 9, name: "파괴", score: 100, effect: "최대 대미지 50% 증가" },
  { id: 10, name: "지혜", score: 0, effect: "조합 성공확률 5% 증가" },
  { id: 11, name: "파멸", score: 100, effect: "크리티컬 대미지 50% 증가" },
  { id: 12, name: "신뢰", score: 0, effect: "명중률 20% 증가" },
  { id: 13, name: "열정", score: 0, effect: "고정대미지 1500 증가" },
  { id: 14, name: "인내", score: 0, effect: "경험치 획득량 10% 증가" },
  { id: 15, name: "격노", score: 40, effect: "무기공격력/속성력 5% 증가" },
  { id: 16, name: "열광", score: 25, effect: "고정대미지 8% 증가" },
  { id: 17, name: "생명", score: 20, effect: "최대 HP 5% 증가" },
  { id: 18, name: "평화", score: 25, effect: "올스탯 1500 증가" },
  { id: 19, name: "조화", score: 40, effect: "올스탯 5% 증가" },
  { id: 20, name: "통찰", score: 150, effect: "관통력 10%, 타격 시 0.1% 확률로 스킬 쿨타임 1초 감소" },
  { id: 21, name: "평화\n조화", score: 65, effect: "올스탯 1500 증가, 올스탯 5% 증가" },
  { id: 22, name: "열정\n분노", score: 30, effect: "고정대미지 1500 증가, 무공/속 70 증가" },
  { id: 23, name: "강철\n생명", score: 25, effect: "체력 1500 증가, 최대 HP 5%" },
  { id: 24, name: "인내\n서약", score: 0, effect: "경험치 획득량 10%, 퀘스트 보상 30%" },
  { id: 25, name: "열광\n격노", score: 65, effect: "고정대미지 8%, 무기공격력/속성력 5%" },
  { id: 26, name: "헌신\n파괴", score: 150, effect: "최소/최대 대미지 50%" },
  { id: 27, name: "축복\n풍요", score: 0, effect: "엘리 획득량 50%, 아이템 발생 확률 20%" },
  { id: 28, name: "야성\n지배", score: 90, effect: "일반몬스터 추가 대미지 6000, 지배력 3%" },
  { id: 29, name: "악몽\n죽음", score: 100, effect: "보스몬스터 추가 대미지 10000, 지배력 5%" },
  { id: 30, name: "파멸\n폭주", score: 100, effect: "크리티컬 대미지 50%, 크리티컬 확률 1%" },
];

export default function RuneWordChecker() {
  const [selectedRunes, setSelectedRunes] = useState([]);
  const [hoveredRune, setHoveredRune] = useState(null);

  const toggleRune = (rune) => {
    if (selectedRunes.includes(rune.id)) {
      setSelectedRunes(selectedRunes.filter((id) => id !== rune.id));
    } else if (selectedRunes.length < 8) {
      setSelectedRunes([...selectedRunes, rune.id]);
    }
  };

  const getScore = () => {
    return selectedRunes.reduce((acc, id, index) => {
      const rune = runes.find((r) => r.id === id);
      const isAmplify = index === 7;
      return acc + (rune?.score || 0) * (isAmplify ? 2 : 1);
    }, 0);
  };

  return (
    <div className="mt-10 p-4 rounded-lg bg-white shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">💎 룬워드 측정기</h2>
      <p className="text-center text-gray-600 mb-4">
        {selectedRunes.length < 7
          ? `일반 룬을 선택해주세요 ${selectedRunes.length}/7개`
          : selectedRunes.length === 7
          ? "증폭 룬을 선택해주세요"
          : "선택 완료!"}
      </p>

      {/* 5x6 고정 격자 */}
      <div
        className="w-[312px] mx-auto mb-4"
        style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}
      >
        {runes.map((rune) => {
          const isSelected = selectedRunes.includes(rune.id);
          const isAmplify = selectedRunes[7] === rune.id;
          return (
            <button
              key={rune.id}
              onClick={() => toggleRune(rune)}
              onMouseEnter={() => setHoveredRune(rune.id)}
              onMouseLeave={() => setHoveredRune(null)}
              className={`text-xs whitespace-pre text-white rounded transition cursor-pointer ${
                isSelected
                  ? isAmplify
                    ? "bg-red-600"
                    : "bg-blue-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              style={{
                width: "60px",
                height: "60px",
              }}
            >
              {hoveredRune === rune.id ? `${rune.score}점` : rune.name}
            </button>
          );
        })}
      </div>

      {/* 결과 영역 */}
      {selectedRunes.length > 0 && (
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-bold mb-2">📊 선택한 룬 효과</h3>
          <ul className="text-sm list-disc list-inside space-y-1">
            {selectedRunes.map((id, idx) => {
              const rune = runes.find((r) => r.id === id);
              const isAmplify = idx === 7;
              return (
                <li key={id}>
                  {rune.name} - {rune.effect}{" "}
                  <span className={isAmplify ? "text-red-600 font-semibold" : "text-gray-600"}>
                    ({isAmplify ? `${rune.score * 2}` : rune.score}점)
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 text-right font-bold text-indigo-700">
            총 점수: {getScore()}점/1040점
          </p>
        </div>
      )}
    </div>
  );
}

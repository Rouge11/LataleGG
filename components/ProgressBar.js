import React, { useState, useEffect } from "react";

export default function ProgressBar({ percentageMin, percentageMax }) {
  // 두 단계 애니메이션을 위해 내부 state 사용
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(0);

  useEffect(() => {
    // 매번 새 결과가 계산될 때
    // 1) 초기: 0→0
    // 2) 잠깐 지연 후 최종값(percentageMin, percentageMax)로 변경
    setMinVal(0);
    setMaxVal(0);

    const timer = setTimeout(() => {
      // 게이지 바 범위를 0~100으로 제한
      const clampedMin = Math.max(0, Math.min(100, percentageMin));
      const clampedMax = Math.max(0, Math.min(100, percentageMax));

      setMinVal(clampedMin);
      setMaxVal(clampedMax);
    }, 50);

    return () => clearTimeout(timer);
  }, [percentageMin, percentageMax]);

  // 게이지 바: 첫 바는 0% ~ minVal% (진한 보라), 두 번째 바는 minVal% ~ maxVal% (연보라)
  const leftVal = Math.min(minVal, maxVal);
  const widthVal = Math.abs(maxVal - minVal);

  return (
    <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
      {/* 첫 번째 구간: 0% ~ minVal% (진한 보라) */}
      <div
        className="absolute top-0 left-0 h-full bg-purple-800 transition-all duration-700 ease-out"
        style={{
          width: `${leftVal}%`, // 0에서 leftVal까지 애니메이션
        }}
      />
      {/* 두 번째 구간: minVal% ~ maxVal% (연보라) */}
      <div
        className="absolute top-0 h-full bg-purple-400 transition-all duration-700 ease-out"
        style={{
          left: `${leftVal}%`,  // minVal지점부터 시작
          width: `${widthVal}%`, // minVal→maxVal 구간
        }}
      />
    </div>
  );
}

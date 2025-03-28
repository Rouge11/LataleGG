export default function ProgressBar({ percentageMin, percentageMax }) {
  // 게이지 범위를 0~100으로 제한
  const minVal = Math.max(0, Math.min(100, percentageMin));
  const maxVal = Math.max(0, Math.min(100, percentageMax));

  return (
    <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
      {/* 첫 구간(진한 보라, 0 ~ minVal) */}
      <div
        className="absolute top-0 left-0 h-full bg-purple-800"
        style={{ width: `${minVal}%` }}
      />

      {/* 두 번째 구간(연보라, minVal ~ maxVal) */}
      {maxVal > minVal && (
        <div
          className="absolute top-0 h-full bg-purple-400"
          style={{
            left: `${minVal}%`,
            width: `${maxVal - minVal}%`,
          }}
        />
      )}
    </div>
  );
}

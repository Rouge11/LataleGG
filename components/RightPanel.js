import React from "react";

export default function RightPanel({ setActivePage }) {
  return (
    <div className="fixed right-0 top-12 w-[260px] h-full bg-gray-900 text-white p-0 pt-14 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-100">도구</h2>

      <div className="menu-box bg-gray-800 w-[220px] mx-auto p-4 rounded-lg border border-gray-600">
        <button
          className="block w-full py-2 mb-2 bg-gray-700 hover:bg-gray-500 rounded-lg text-sm font-semibold"
          onClick={() => setActivePage("enchantSim")}
        >
          인챈트 시뮬레이션
        </button>
        <button
          className="block w-full py-2 bg-gray-700 hover:bg-gray-500 rounded-lg text-sm font-semibold"
          onClick={() => setActivePage("rune")}
        >
          룬워드 측정기
        </button>
      </div>
    </div>
  );
}

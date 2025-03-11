export default function Content({ activePage }) {
  return (
    <div className="flex-grow pt-16 p-6 bg-white shadow-md rounded-lg border border-gray-300">
      {activePage === "board" && <div className="text-center text-lg font-semibold text-gray-800">📌 자유게시판</div>}
      {activePage === "status" && <div className="text-center text-lg font-semibold text-gray-800">🛠 상태창 인증</div>}
      {activePage === "trade" && <div className="text-center text-lg font-semibold text-gray-800">💰 거래게시판</div>}
      {activePage === "enchant" && <div className="text-center text-lg font-semibold text-gray-800">✨ 인챈트 계산</div>}
    </div>
  );
}

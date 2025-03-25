import Board from "./Board";
import EnchantCalculator from "./EnchantCalculator"; // 상대 경로 주의

export default function Content({ activePage, user }) {
  return (
    <div className="mx-auto pt-16 p-6 w-[60%] bg-white shadow-md rounded-lg border border-gray-300">
      {activePage === "board" && <Board user={user} />} {/* ✅ user 전달 */}
      {activePage === "status" && <div className="text-center text-lg font-semibold text-gray-800">🛠 상태창 인증</div>}
      {activePage === "trade" && <div className="text-center text-lg font-semibold text-gray-800">💰 거래게시판</div>}
      {activePage === "enchant" && <EnchantCalculator />}
    </div>
  );
}

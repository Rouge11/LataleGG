import Board from "./Board";
import EnchantCalculator from "./EnchantCalculator"; 
import TradeBoard from "./TradeBoard";
import RuneWordChecker from "./RuneWordChecker";

export default function Content({ activePage, user }) {
  return (
    <div className="mx-auto pt-16 p-6 w-[60%] bg-white shadow-md rounded-lg border border-gray-300">
      {activePage === "board" && <Board user={user} />} 
      {activePage === "status" && <div className="text-center text-lg font-semibold text-gray-800">🛠 상태창 인증</div>}
      {activePage === "trade" && <TradeBoard user={user} />}
      {activePage === "enchant" && <EnchantCalculator />}
      {activePage === "rune" && <RuneWordChecker />}
    </div>
  );
}

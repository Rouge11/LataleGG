export default function Sidebar({ setActivePage }) {
  return (
    <div className="fixed left-0 top-12 w-[260px] h-full bg-gray-900 text-white p-0 pt-14 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-100">메뉴</h2>

      {/* 메뉴 박스 추가 */}
      <div className="menu-box bg-gray-800 w-[220px] mx-auto p-4 rounded-lg border border-gray-600">
        <button className="cursor-pointer block w-[180px] mx-auto py-3 px-4 mb-3 bg-gray-700 hover:bg-gray-500 text-white font-semibold rounded-lg transition"
          onClick={() => setActivePage("board")}>
          자유게시판
        </button>
        <button className="cursor-pointer block w-[180px] mx-auto py-3 px-4 mb-3 bg-gray-700 hover:bg-gray-500 text-white font-semibold rounded-lg transition"
          onClick={() => setActivePage("status")}>
          상태창 인증
        </button>
        <button className="cursor-pointer block w-[180px] mx-auto py-3 px-4 mb-3 bg-gray-700 hover:bg-gray-500 text-white font-semibold rounded-lg transition"
          onClick={() => setActivePage("trade")}>
          거래게시판
        </button>
        <button className="cursor-pointer block w-[180px] mx-auto py-3 px-4 bg-gray-700 hover:bg-gray-500 text-white font-semibold rounded-lg transition"
          onClick={() => setActivePage("enchant")}>
          인챈트 계산
        </button>
      </div>
    </div>
  );
}

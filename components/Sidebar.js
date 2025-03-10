export default function Sidebar({ setActivePage }) {
    return (
      <div className="fixed left-0 top-12 w-1/5 h-full bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">메뉴</h2>
        <button className="block w-full py-2 px-3 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => setActivePage("board")}>
          자유게시판
        </button>
        <button className="block w-full py-2 px-3 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => setActivePage("status")}>
          상태창 인증
        </button>
        <button className="block w-full py-2 px-3 mb-2 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => setActivePage("trade")}>
          거래게시판
        </button>
        <button className="block w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded"
          onClick={() => setActivePage("enchant")}>
          인챈트 계산
        </button>
      </div>
    );
  }
  
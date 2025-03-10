export default function Content({ activePage }) {
    return (
      <div className="ml-[20%] mt-12 p-6 w-3/5">
        {activePage === "board" && <div>📌 자유게시판 페이지</div>}
        {activePage === "status" && <div>🛠 상태창 인증 페이지</div>}
        {activePage === "trade" && <div>💰 거래게시판 페이지</div>}
        {activePage === "enchant" && <div>✨ 인챈트 계산 페이지</div>}
      </div>
    );
  }
  
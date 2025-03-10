import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";

export default function Home() {
  const [activePage, setActivePage] = useState("board");

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 상단 네비게이션 바 */}
      <Navbar />

      {/* 좌측 메뉴 바 + 중앙 컨텐츠 */}
      <div className="flex mt-12">
        <Sidebar setActivePage={setActivePage} />
        <Content activePage={activePage} />
        
        {/* 우측 공간 (미정) */}
        <div className="w-1/5 bg-gray-300 fixed right-0 top-12 h-full p-4">
          <p>우측 공간 (컨텐츠 미정)</p>
        </div>
      </div>
    </div>
  );
}

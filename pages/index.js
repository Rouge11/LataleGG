import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import RightPanel from "../components/RightPanel"; // 우측 패널 추가

export default function Home() {
  const [activePage, setActivePage] = useState("board");

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex mt-12">
        <Sidebar setActivePage={setActivePage} />
        <div className="flex-grow">
          <Content activePage={activePage} />
        </div>
        <RightPanel />
      </div>
    </div>
  );
}

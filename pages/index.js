import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import RightPanel from "../components/RightPanel";
import Board from "../components/Board"; //자유게시판

export default function Home() {
  const [activePage, setActivePage] = useState("board");

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex mt-12">
        <Sidebar setActivePage={setActivePage} />
        <div className="flex-grow">
          {activePage === "board" ? <Board /> : <Content activePage={activePage} />}
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
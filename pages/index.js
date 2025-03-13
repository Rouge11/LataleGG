import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import RightPanel from "../components/RightPanel";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("board");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedUser) => {
      setUser(loggedUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar user={user} />
      <div className="flex mt-12">
        <Sidebar setActivePage={setActivePage} />
        <Content activePage={activePage} user={user} /> {/* ✅ user 전달 */}
        <RightPanel />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("board"); // ✅ `activePage` 상태 추가

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedUser) => {
      setUser(loggedUser);
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
        <Sidebar setActivePage={setActivePage} />  {/* ✅ `setActivePage` 전달 */}
        <Content activePage={activePage} />  {/* ✅ `activePage` 전달 */}
        <div className="w-1/5 bg-gray-900 fixed right-0 top-12 h-full p-4 text-center shadow-md border-l border-gray-300">
          <p className="text-gray-700 font-semibold">우측 공간 (컨텐츠 미정)</p>
        </div>
      </div>
    </div>
  );
}

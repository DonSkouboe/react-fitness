import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white p-6 pb-16">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">🏋️ Fit-with-ChatGPT 🚀</h1>
      <Outlet /> {/* 📌 Viser kun den aktive side */}
      <BottomNav /> {/* 📌 Navigation forbliver fast i bunden */}
    </div>
  );
}

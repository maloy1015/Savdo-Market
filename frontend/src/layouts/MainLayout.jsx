import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6fb]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 md:px-6 py-5">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

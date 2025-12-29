import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import FloatingAIChat from "../chat/FloatingAIChat";
import { useAuth } from "../../contexts/AuthContext";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.includes(location.pathname);

  if (isAuthRoute) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Fixed header above everything */}
      <div className="fixed inset-x-0 top-0 z-50">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
      </div>

      {/* Main content area - Sidebar on LEFT, Content on RIGHT */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed on LEFT side */}
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div className="lg:hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Main content - Takes remaining space on RIGHT side */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Floating AI Chat Button - Only show for logged-in users */}
      {user && <FloatingAIChat />}
    </div>
  );
}

export default MainLayout;
import { Outlet } from 'react-router-dom';
import MainNav from '../navigation/MainNav';
import Sidebar from '../navigation/Sidebar';
import { useState } from 'react';
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-full">
      <MainNav setSidebarOpen={setSidebarOpen} />   
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />        
        <div className="flex-1">
          <main className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
export default DashboardLayout;
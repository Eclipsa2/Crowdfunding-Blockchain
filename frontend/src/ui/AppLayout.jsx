import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="h-screen grid grid-cols-[20rem_1fr] grid-rows-[auto_1fr] bg-slate-950 text-slate-200">
      <Header />
      <div className="row-span-full">
        <Sidebar />
      </div>
      <div className="bg-slate-900 overflow-y-auto h-full">
        <div className="max-w-[80rem] mx-auto flex flex-col gap-8 h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;

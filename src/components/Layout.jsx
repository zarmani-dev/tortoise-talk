import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="w-full min-h-screen bg-gray-950 text-slate-200">
      <Outlet />
      <Toaster position="bottom-right" />
    </main>
  );
};
export default Layout;

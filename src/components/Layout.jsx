import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="w-full  h-screen bg-gray-950 text-slate-200">
      <Outlet />
    </main>
  );
};
export default Layout;

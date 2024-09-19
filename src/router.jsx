import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./components/Layout";
import Chat from "./components/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/:roomId",
        element: <Chat />,
      },
    ],
  },
]);

export default router;

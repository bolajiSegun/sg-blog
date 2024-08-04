import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import SinglePost from "./pages/SinglePost.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import Home from "./pages/Home.tsx";
import EditPost from "./pages/EditPost.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "post/:slug",
        element: <SinglePost />,
      },
      {
        path: "post/:slug/edit",
        element: <EditPost />,
      },
      {
        path: "post/create",
        element: <CreatePost />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  //  <React.StrictMode>
  <AuthContextProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthContextProvider>
  // </React.StrictMode>
);

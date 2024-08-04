import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import useGetUser from "./hooks/useGetUser";

function App() {
  useGetUser();

  return (
    <>
      <Navbar />
      <main className="mx-auto h-screen max-w-2xl pt-6 pb-20 sm:px-4 md:px-0">
        <Outlet />
      </main>
    </>
  );
}

export default App;

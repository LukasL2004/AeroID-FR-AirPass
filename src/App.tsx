import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Login from "./Pages/LoginPage/Login";
import NavBar from "./Components/NavBar/NavBar";
import BoardingPass from "./Pages/BoardingPass/BoardingPass";
import Scanner from "./Pages/ScanningPage/Scanner";
import PhotoUpload from "./Pages/PhotoUpload/PhotoUpload";

function LayOut() {
  return (
    <>
      <NavBar />
      <div className="content-container">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    { path: "", loader: () => redirect("/AeroID") },
    {
      path: "/AeroID",
      element: <LayOut />,
      children: [
        {
          path: "",
          loader: () => redirect("/AeroID/Login"),
        },
        {
          path: "Login",
          element: <Login />,
        },
        {
          path: "PhotoUpload",
          element: <PhotoUpload />,
        },
        {
          path: "BoardingPass",
          element: <BoardingPass />,
        },
        {
          path: "Scanner",
          element: <Scanner />,
        },
      ],
    },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

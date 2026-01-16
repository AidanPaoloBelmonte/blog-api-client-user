import { useState } from "react";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router";
import { useCookies } from "react-cookie";

import Header from "./components/header";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";

import "./App.css";

function LayoutContext() {
  const [cookies, setCookie] = useCookies(["token"]);
  const [isAuth, setAuth] = useState(cookies?.payload);

  return (
    <>
      <Header key={isAuth} isAuth={isAuth} />
      <Outlet context={{ cookies, setCookie, setAuth }} />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <LayoutContext />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

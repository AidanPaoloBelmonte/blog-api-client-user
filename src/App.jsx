import { useState } from "react";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router";
import { useCookies } from "react-cookie";

import Header from "./components/header";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";
import Blogs from "./components/blogs";
import BlogPost from "./components/blogPost";

import "./App.css";

function LayoutContext() {
  const [cookies, setCookie] = useCookies(["token"]);
  const [user, setUser] = useState(cookies?.user);

  return (
    <>
      <Header key={user?.id ?? 0} user={user} />
      <Outlet context={{ cookies, setCookie, user, setUser }} />
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
      {
        path: "/blogs",
        element: <Blogs></Blogs>,
      },
      {
        path: "/blogs/:id",
        element: <BlogPost></BlogPost>,
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

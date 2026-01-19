import { useState } from "react";
import { useOutletContext } from "react-router";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import "../res/accountForm.css";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "all" });

  const { setCookie, setUser } = useOutletContext();
  const [error, setError] = useState("");

  async function onSubmit(data) {
    const response = await axios.post("http://localhost:3000/login", data, {
      withCredentials: true,
    });

    if (response?.data?.token) {
      const payload = response.data.token;
      const user = response.data.user;
      const opts = {
        maxAge: 604800, // 7 days
        secure: true,
        sameSite: true,
      };

      setCookie("payload", payload, opts);

      setCookie("user", user, opts);

      navigate("/blogs");
    }

    setError(response?.data?.error);
    setUser(response?.data?.user);
  }

  function handleUsernameErrorDisplay() {
    if (errors?.username)
      return <p className="formError inline">{errors.username.message}</p>;
  }

  function handlePasswordErrorDisplay() {
    if (errors?.password)
      return <p className="formError inline">{errors.password.message}</p>;
  }

  function handleServerErrorDisplay() {
    if (error) return <p className="formError block">{error}</p>;
  }

  return (
    <section className="baseSection loginSection flexFill">
      <div className="borderWrapper">
        <form className="login" onSubmit={handleSubmit(onSubmit)}>
          {handleServerErrorDisplay()}
          <div className={`formEntry ${errors?.username ? "invalid" : ""}`}>
            <label htmlFor="username">Username</label>
            <input
              {...register("username", {
                pattern: {
                  value: /[a-zA-Z0-9_]$/,
                  message:
                    "A username can only contain letters, numbers and underscores",
                },
                minLength: {
                  value: 3,
                  message: "A username must be at least 3 characters long",
                },
                required: {
                  value: true,
                  message: "A username must be provided",
                },
              })}
            ></input>
            {handleUsernameErrorDisplay()}
          </div>
          <div className={`formEntry ${errors?.password ? "invalid" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", {
                pattern: {
                  value: /^\S*$/,
                  message: "Passwords cannot contain whitespace",
                },
                required: {
                  value: true,
                  message: "A password must be provided",
                },
              })}
            ></input>
            {handlePasswordErrorDisplay()}
          </div>
          <div className="formFooter">
            <button
              type="submit"
              className="submit"
              disabled={!isDirty || !isValid}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

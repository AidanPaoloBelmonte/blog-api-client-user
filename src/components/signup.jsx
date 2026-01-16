import { useState } from "react";
import { useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";

import "../res/accountForm.css";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({ mode: "all" });

  const { setCookie, setAuth } = useOutletContext();
  const [error, setError] = useState("");

  async function onSubmit(data) {
    const response = await axios.post("http://localhost:3000/signup", data, {
      withCredentials: true,
    });

    if (response?.data?.token) {
      const payload = response.data.token;

      setCookie("payload", payload, {
        maxAge: 604800, // 7 days
        secure: true,
        sameSite: true,
      });
    }

    setError(response?.data?.error);
    setAuth(!response?.data?.error);
  }

  function handleUsernameErrorDisplay() {
    if (errors?.username)
      return <p className="formError inline">{errors.username.message}</p>;
  }

  function handleEmailErrorDisplay() {
    if (errors?.email)
      return <p className="formError inline">{errors.email.message}</p>;
  }

  function handlePasswordErrorDisplay() {
    if (errors?.password)
      return <p className="formError inline">{errors.password.message}</p>;
  }

  function handleServerErrorDisplay() {
    if (error) return <p className="formError">{error}</p>;
  }

  return (
    <section className="baseSection signUpSection flexFill">
      <div className="borderWrapper">
        <form className="login" onSubmit={handleSubmit(onSubmit)}>
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
          <div className={`formEntry ${errors?.email ? "invalid" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "This is not a valid email format.",
                },
                required: {
                  value: true,
                  message: "An email must be provided",
                },
              })}
            ></input>
            {handleEmailErrorDisplay()}
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
            {handleServerErrorDisplay()}
            <button
              type="submit"
              className="submit"
              disabled={!isDirty || !isValid}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

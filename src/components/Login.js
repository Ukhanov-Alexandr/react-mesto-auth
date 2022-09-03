import React, { useState } from "react";
import "./register.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({
      email: email,
      password: password,
    });
    setEmail('');
    setPassword('');
  }

  return (
    <main className="content">
      <section className="auth">
        <form className="auth__form" onSubmit={handleSubmit}>
          <h1 className="auth__title">Вход</h1>
          <input
            className="auth__input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          ></input>
          <input
            className="auth__input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Пароль"
          ></input>
          <button className="auth__button-submit">Войти</button>
        </form>
      </section>
    </main>
  );
};

export default Login;

import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <main className="auth">
      <section className="auth__container">
        <form className="auth__form" onSubmit={handleSubmit}>
          <h1 className="auth__title">Вход</h1>
          <input
            className="auth__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          ></input>
          <input
            className="auth__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          ></input>
          <button className="auth__button-submit">Войти</button>
        </form>
      </section>
    </main>
  );
};

export default Login;

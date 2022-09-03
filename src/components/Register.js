import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";

const Register = ({ onSignUp }) => {
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
    onSignUp({
      email: email,
      password: password,
    });
  }

  return (
    <main className="content">
      <section className="auth">
        <form className="auth__form" onSubmit={handleSubmit}>
          <h1 className="auth__title">Регистрация</h1>
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
          <button className="auth__button-submit">Зарегистрироваться</button>
          <Link to="/sign-in" className="auth__link">
            Уже зарегистрированы? Войти
          </Link>
        </form>
      </section>
    </main>
  );
};

export default Register;

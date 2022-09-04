import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSignUp({
      email: email,
      password: password,
    });
  }

  return (
    <main className="auth">
      <section className="auth__container">
        <form className="auth__form" onSubmit={handleSubmit}>
          <h1 className="auth__title">Регистрация</h1>
          <input
            className="auth__input"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
          ></input>
          <input
            className="auth__input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
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

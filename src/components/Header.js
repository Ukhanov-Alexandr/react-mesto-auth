import React from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../images/logo.svg";


function Header({ signOut, email }) {
  const { pathname } = useLocation();
  console.log(email);
  return (
    <header className="header">
      <img className="logo" src={logo} alt="логотип" />
      {pathname === "/sign-in" && (
        <Link to="/sign-up" className="header__button" type="button">
          Регистрация
        </Link>
      )}
      {pathname === "/sign-up" && (
        <Link to="/sign-in" className="header__button" type="button">
          Войти
        </Link>
      )}
      {pathname === "/" && (
        <div className="header__container">
          <p className="header__email">{email}</p>
          <button className="header__button" onClick={signOut}>
            Выйти
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;

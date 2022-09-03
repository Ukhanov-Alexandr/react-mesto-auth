import React from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../images/logo.svg";

function Header({ loggedIn, isInfoTooltipOpen, email }) {
  const { pathname } = useLocation();
  // console.log(pathname);
  const buttonCaption = {
    "/sign-in": "Регистрация",
    "/sign-up": "Войти",
  };

  return (
    <header className="header">
      <img className="logo" src={logo} alt="логотип" />
      {loggedIn ? (
        <div className="header__container">
          <p className="header__email">
            {!isInfoTooltipOpen ? email : "" }
          </p>
          <button className="header__button">
            {!isInfoTooltipOpen ? "Выйти" : buttonCaption[pathname]}
          </button>
        </div>
      ) : (
        <Link to={ pathname === "/sign-up" ? '/sign-in' : "/sign-up" } className="header__button" type="button">
          {!isInfoTooltipOpen ? buttonCaption[pathname] : "Зарегистрироваться"}
        </Link>
      )}
    </header>
  );
}

export default Header;

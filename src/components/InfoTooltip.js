import React from "react";
import regsuc from "../images/reg1.png";
import regfail from "../images/reg-faild.svg";

function InfoTooltip({ isOpen, onClose, loggedIn, handleOverlayClick }) {

  return (
    <div
      className={`popup infoTooltip ${isOpen ? "popup_opened" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div className="popup__container infoTooltip__container">
        <button
          className="popup__btn-close"
          type="button"
          onClick={() => onClose()}
        ></button>
        <img className="infoTooltip__image " src={loggedIn ? regsuc : regfail} alt="логотип" />
        <h3 className="popup__title infoTooltip__title">
            {loggedIn ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.' }
        </h3>
      </div>
    </div>
  );
}

export default InfoTooltip;

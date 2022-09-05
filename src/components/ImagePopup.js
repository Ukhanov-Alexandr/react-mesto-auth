import React from "react";

function ImagePopup({name, card, onClose, handleOverlayClick}) {

  return (
    <div
      className={`popup popup-${name} ${
        card ? "popup_opened" : ""
      }`}
      onClick={handleOverlayClick}
    >
      <div className="popup-image__container">
        <button
          className="popup__btn-close"
          type="button"
          onClick={onClose}
        ></button>
        <img
          className="popup-image__image"
          src={card ? card.link : ""}
          alt={card ? card.name : ""}
        />
        <p className="popup-image__caption">
          {card ? card.name : ""}
        </p>
      </div>
    </div>
  );
}

export default React.memo(ImagePopup);

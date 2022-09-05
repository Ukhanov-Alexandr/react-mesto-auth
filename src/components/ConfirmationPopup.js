import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmationPopup({ card, onSubmit, onClose, isRequesting }) {

  function handleSubmit(e){
    e.preventDefault()
    onSubmit(card);
  }

  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return (
    <PopupWithForm
      title="Вы уверены?"
      name="delete"
      isOpen={!!card}
      onClose={onClose}
      onSubmit={handleSubmit}
      handleOverlayClick={handleOverlayClick}
    >
      <button className="popup__btn-save form__submit" type="submit">
        { isRequesting ? 'Удаление..' : 'Да' }
      </button>
    </PopupWithForm>
  );
};

export default React.memo(ConfirmationPopup);
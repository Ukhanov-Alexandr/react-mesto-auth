import React, { useCallback, useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "../components/EditProfilePopup";
import EditAvatarPopup from "../components/EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import ErrorPopup from "./ErrorPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../auth";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setСurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [deletedCard, setDeletedCard] = useState(null);
  const [isRequestingServer, setIsRequestingServer] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [email, setEmail] = useState("");

  const history = useHistory();

  const closeConfirmationPopup = useCallback(() => {
    setDeletedCard(null);
  }, []);

  const openConfirmationPopup = useCallback((card) => {
    setDeletedCard(card);
  }, []);

  const closeErrorPopup = useCallback(() => {
    setServerError(null);
  }, []);

  const openErrorPopup = useCallback((error) => {
    setServerError(error);
  }, []);

  const handleCardLike = useCallback(
    (card) => {
      const isLiked = card.likes.some((i) => i._id === currentUser._id);

      if (isLiked) {
        api
          .unlikeCard(card._id)
          .then((res) => {
            setCards((state) =>
              state.map((c) => (c._id === card._id ? res : c))
            );
          })
          .catch((err) => {
            console.log(`Ошибка с кодом: ${err.errorCode}`);
            console.dir(err);
            openErrorPopup(err);
          });
      } else {
        api
          .setlikeCard(card._id)
          .then((res) => {
            setCards((state) =>
              state.map((c) => (c._id === card._id ? res : c))
            );
          })
          .catch((err) => {
            console.log(`Ошибка с кодом: ${err.errorCode}`);
            console.dir(err);
            openErrorPopup(err);
          });
      }
    },
    [currentUser]
  );

  const handleCardDelete = useCallback((card) => {
    setIsRequestingServer(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id && c));
        closeConfirmationPopup();
      })
      .catch((err) => {
        console.log(`Ошибка с кодом: ${err.errorCode}`);
        console.dir(err);
        openErrorPopup(err);
      })
      .finally(() => {
        setIsRequestingServer(false);
      });
  }, []);

  const handleCardClick = useCallback((card) => {
    setSelectedCard(card);
  }, []);

  const handleEditAvatarClick = useCallback(() => {
    setIsEditAvatarPopupOpen(true);
  }, []);

  const handleEditProfileClick = useCallback(() => {
    setIsEditProfilePopupOpen(true);
  }, []);

  const handleAddPlaceClick = useCallback(() => {
    setIsAddPlacePopupOpen(true);
  }, []);

  const closeAllPopups = useCallback(() => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }, []);

  useEffect(() => {
    if (
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      selectedCard ||
      isInfoTooltipOpen
    ) {
      function handleEscClose(evt) {
        if (evt.key === "Escape") {
          closeAllPopups();
        }
      }

      document.addEventListener("keydown", handleEscClose);

      return () => {
        document.removeEventListener("keydown", handleEscClose);
      };
    }
  }, [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    selectedCard,
    isInfoTooltipOpen,
  ]);

  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      console.log(evt.target === evt.currentTarget)
      closeAllPopups();
    }
  };

  const handleUpdateUser = useCallback((data) => {
    setIsRequestingServer(true);
    api
      .patchProfile(data)
      .then((res) => {
        setСurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка с кодом: ${err.errorCode}`);
        console.dir(err);
        openErrorPopup(err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsRequestingServer(false);
        }, 300);
      });
  }, []);

  const handleUpdateAvatar = useCallback((data) => {
    setIsRequestingServer(true);
    api
      .setNewAvatar(data)
      .then((res) => {
        console.dir(res);
        setСurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка с кодом: ${err.errorCode}`);
        console.dir(err);
        openErrorPopup(err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsRequestingServer(false);
        }, 300);
      });
  }, []);

  const handleAddPlaceSubmit = useCallback(
    (data) => {
      setIsRequestingServer(true);
      api
        .addNewCard(data)
        .then((res) => {
          setCards([res, ...cards]);
          closeAllPopups();
        })
        .catch((err) => {
          console.log(`Ошибка с кодом: ${err.errorCode}`);
          console.dir(err);
          openErrorPopup(err);
        })
        .finally(() => {
          setTimeout(() => {
            setIsRequestingServer(false);
          }, 300);
        });
    },
    [cards]
  );

  useEffect(() => {
    Promise.all([api.getUser(), api.getCards()])
      .then(([user, cards]) => {
        setСurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка с кодом: ${err.errorCode}`);
        console.dir(err);
        openErrorPopup(err);
      });
  }, []);

//ниже реализован функционал 12 спринта
  const handleSignUp = ({ email, password }) => {
    if (!email || !password) {
      return;
    }
    auth
      .register(email, password)
      .then((res) => {
        if (res.ok) {
          setLoggedIn(true);
          setIsInfoTooltipOpen(true);
          setTimeout(() => {
            history.push("/sign-in");
          }, 800);
        } else {
          setLoggedIn(false);
          setIsInfoTooltipOpen(true);
          setTimeout(() => {
            history.push("/sign-in");
          }, 800);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLogin = ({ email, password }) => {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setTimeout(() => {
            setLoggedIn(true);
            auth.getContent(localStorage.getItem("jwt")).then((res)=>setEmail(res.data.email))
            history.push("/");
          }, 100);
        } else {
          setLoggedIn(false);
          setIsInfoTooltipOpen(true);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  function signOut() {
    localStorage.removeItem("jwt");
    history.push("/sign-in");
    setLoggedIn(false);
  }

  function tokenCheck() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      // здесь будем проверять токен
      auth.getContent(jwt).then((res) => {
        setEmail(res.data.email);
        if (res) {
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => console.log(err));;
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header signOut={signOut} email={email} />
      <Switch>
        <ProtectedRoute
          loggedIn={loggedIn}
          exact
          path="/"
          component={
            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={openConfirmationPopup}
            />
          }
        />
        <Route path="/sign-up">
          <Register onSignUp={handleSignUp} />
          <InfoTooltip
            loggedIn={loggedIn}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
          />
        </Route>

        <Route path="/sign-in">
          <Login onLogin={handleLogin} />
          <InfoTooltip
            loggedIn={loggedIn}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            handleOverlayClick={handleOverlayClick}
          />
        </Route>
      </Switch>
      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isRequesting={isRequestingServer}
        handleOverlayClick={handleOverlayClick}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isRequesting={isRequestingServer}
        handleOverlayClick={handleOverlayClick}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isRequesting={isRequestingServer}
        handleOverlayClick={handleOverlayClick}
      />
      <ConfirmationPopup
        card={deletedCard}
        onSubmit={handleCardDelete}
        onClose={closeConfirmationPopup}
        isRequesting={isRequestingServer}
      />
      <ImagePopup
        title="Посмотреть в полном размере"
        name="image"
        card={selectedCard}
        onClose={closeAllPopups}
        handleOverlayClick={handleOverlayClick}
      />
      <ErrorPopup error={serverError} onClose={closeErrorPopup} />
    </CurrentUserContext.Provider>
  );
}

export default React.memo(App);

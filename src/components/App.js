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
  const [email, setEmail] = useState('');

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

  const handleCardLike = useCallback((card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (isLiked) {
      api
        .unlikeCard(card._id)
        .then((res) => {
          setCards((state) => state.map((c) => (c._id === card._id ? res : c)));
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
          setCards((state) => state.map((c) => (c._id === card._id ? res : c)));
        })
        .catch((err) => {
          console.log(`Ошибка с кодом: ${err.errorCode}`);
          console.dir(err);
          openErrorPopup(err);
        });
    }
  }, []);

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  const history = useHistory();


  const handleSignUp = ({ email, password }) => {
    if (!email || !password) {
      return;
    }
    auth
      .register(email, password)
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          setLoggedIn(true);
          history.push("/sign-in");
        }, 1000);
      })
      .catch((err) => console.log(err));
      setLoggedIn(true);
      setIsInfoTooltipOpen(true);
  };

  const handleLogin = ({email, password}) => {
    console.log(`мейл - ${email}, пароль - ${password}`);
    auth.authorize(email, password)
      .then((data) => {
      console.log(data)
      if (data.token) {
        setLoggedIn(true);
        setTimeout(() => {
          history.push("/");
        }, 1000);
      }
    });
  }

  useEffect(() => {
    tokenCheck();
  }, []);

  function tokenCheck() {
    // console.log(localStorage.getItem('jwt'))
    if (localStorage.getItem('jwt')){
      const jwt = localStorage.getItem('jwt');
      // здесь будем проверять токен
      auth.getContent(jwt).then((res) => {
        console.log(res.data.email)
        setEmail(res.data.email)
        if (res) {
          setLoggedIn(true);
          history.push("/");
        }
      })
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} isInfoTooltipOpen={isInfoTooltipOpen} email={email}/>
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
          <Login 
            onLogin={handleLogin}
          />
        </Route>

      </Switch>
      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isRequesting={isRequestingServer}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isRequesting={isRequestingServer}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isRequesting={isRequestingServer}
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
      />
      <ErrorPopup error={serverError} onClose={closeErrorPopup} />
    </CurrentUserContext.Provider>
  );
}

export default React.memo(App);

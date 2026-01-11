import React, { useEffect } from 'react';
import { Header } from "./components/Header/Header";
import { BurgerWorkspace } from "./components/BurgerWorkspace/BurgerWorkspace";
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchIngredients } from './services/ingredientsSlice';
import { checkAuth } from './services/authActions';
import { ModalProvider } from "./context/ModalContext/ModalContext";
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { IngredientPage } from './pages/IngredientPage';
import { ProtectedRouteElement } from './components/ProtectedRouteElement';
import { IngredientDetailsOverlay } from './components/IngredientDetailsOverlay';
import { PageSection } from './components/PageSection/PageSection';
import { ProfileOrdersPage } from './pages/ProfileOrdersPage';
import { ProfileOrderPage } from './pages/ProfileOrderPage';
import { FeedPage } from './pages/FeedPage';
import { FeedOrderPage } from './pages/FeedOrderPage';

function App() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.ingredients.items);
  const loading = useAppSelector((state) => state.ingredients.loading);
  const location = useLocation();
  const background = (location.state as { background?: Location })?.background;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [dispatch, loading]);

  return (
    <ModalProvider>
      <Header />
      <PageSection>
        <Routes location={background || location}>
          <Route
            path="/"
            element={
              <HomePage>
                {Array.isArray(items) && items.length > 0 && (
                  <BurgerWorkspace />
                )}
              </HomePage>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRouteElement guestOnly>
                <LoginPage />
              </ProtectedRouteElement>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRouteElement guestOnly>
                <RegisterPage />
              </ProtectedRouteElement>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRouteElement guestOnly>
                <ForgotPasswordPage />
              </ProtectedRouteElement>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRouteElement guestOnly requireForgotFlow>
                <ResetPasswordPage />
              </ProtectedRouteElement>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRouteElement authOnly>
                <ProfilePage />
              </ProtectedRouteElement>
            }
          />
          <Route
            path="/profile/orders"
            element={
              <ProtectedRouteElement authOnly>
                <ProfileOrdersPage />
              </ProtectedRouteElement>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRouteElement authOnly>
                <ProfileOrderPage />
              </ProtectedRouteElement>
            }
          />
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:number" element={<FeedOrderPage />} />
        </Routes>
        {background && (
          <Routes location={location}>
            <Route path="/ingredients/:id" element={<IngredientDetailsOverlay />} />
          </Routes>
        )}
      </PageSection>
    </ModalProvider>
  );
}

export default App;

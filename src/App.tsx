import React, { useEffect } from 'react';
import { Header } from "./components/Header/Header";
import { BurgerWorkspace } from "./components/BurgerWorkspace/BurgerWorkspace";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from './services/ingredientsSlice';
import type { AppDispatch, RootState } from './services/store';
import { ModalProvider } from "./context/ModalContext/ModalContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { IngredientPage } from './pages/IngredientPage';
import { ProtectedRouteElement } from './components/ProtectedRouteElement';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.ingredients.items);
  const loading = useSelector((state: RootState) => state.ingredients.loading);

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [dispatch, loading]);

  return (
    <ModalProvider>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage>
                {Array.isArray(items) && items.length > 0 && (
                  <BurgerWorkspace ingredients={items} />
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
          <Route path="/ingredients/:id" element={<IngredientPage />} />
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;

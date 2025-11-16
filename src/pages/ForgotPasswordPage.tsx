import React from 'react';

export const ForgotPasswordPage = () => {
  React.useEffect(() => {
    window.sessionStorage.setItem('forgotPasswordVisited', 'true');
  }, []);

  return (
    <section>
      <h1>Восстановление пароля</h1>
    </section>
  );
};



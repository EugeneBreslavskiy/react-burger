import React, { FC, FormEvent, ReactNode, memo } from 'react';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './user-form.module.css';

export interface UserFormSchema {
  title: string;
  submitText: string;
  endpoint?: string;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  nav?: ReactNode | ReactNode[];
  children?: ReactNode;
}

const UserFormComponent: FC<UserFormSchema> = ({
  title,
  submitText,
  endpoint,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  nav,
  children,
}) => {
  const AnyInput: any = Input;
  const AnyPasswordInput: any = PasswordInput;
  return (
    <form className={styles.UserFormContainer} onSubmit={onSubmit} noValidate>
      <h1 className={`${styles.UserFormTitle} text text_type_main-large`}>{title}</h1>

      <div className={styles.UserFormField}>
        <AnyInput
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
          name="email"
          required
          autoComplete="email"
          size="default"
        />
      </div>

      <div className={styles.UserFormField}>
        <AnyPasswordInput
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
          name="password"
          required
          autoComplete="current-password"
        />
      </div>

      {children}

      <Button htmlType="submit" type="primary" size="large" extraClass={styles.UserFormButton}>
        {submitText}
      </Button>

      {nav ? <div className={styles.UserFormNav}>{Array.isArray(nav) ? nav : [nav]}</div> : null}

      <input type="hidden" name="endpoint" value={endpoint || ''} />
    </form>
  );
};

export const UserForm = memo(UserFormComponent);



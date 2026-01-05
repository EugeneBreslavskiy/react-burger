import React, { FC, FormEvent, ReactNode, memo, ChangeEvent } from 'react';
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
  showEmail?: boolean;
  showPassword?: boolean;
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
  showEmail = true,
  showPassword = true,
}) => {
  type InputProps = Omit<React.ComponentProps<typeof Input>, 'onChange'> & { onChange?: (e: ChangeEvent<HTMLInputElement>) => void };
  type PasswordInputProps = Omit<React.ComponentProps<typeof PasswordInput>, 'onChange'> & { onChange?: (e: ChangeEvent<HTMLInputElement>) => void };
  const AnyInput = Input as unknown as React.ComponentType<Partial<InputProps>>;
  const AnyPasswordInput = PasswordInput as unknown as React.ComponentType<Partial<PasswordInputProps>>;
  return (
    <form className={styles.UserFormContainer} onSubmit={onSubmit} noValidate>
      <h1 className={`${styles.UserFormTitle} text text_type_main-large`}>{title}</h1>

      {showEmail && (
        <div className={styles.UserFormField}>
          <AnyInput
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
            name="email"
            required
            autoComplete="email"
            size="default"
          />
        </div>
      )}

      {showPassword && (
        <div className={styles.UserFormField}>
          <AnyPasswordInput
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onPasswordChange(e.target.value)}
            name="password"
            required
            autoComplete="current-password"
          />
        </div>
      )}

      {children}

      <Button htmlType="submit" type="primary" size="large" extraClass={styles.UserFormButton}>
        {submitText}
      </Button>

      {nav ? (
        <div className={styles.UserFormNav}>
          {Array.isArray(nav) ? nav.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>) : nav}
        </div>
      ) : null}

      <input type="hidden" name="endpoint" value={endpoint || ''} />
    </form>
  );
};

export const UserForm = memo(UserFormComponent);



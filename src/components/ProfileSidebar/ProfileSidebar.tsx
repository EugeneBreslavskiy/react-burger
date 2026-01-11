import { FC } from 'react';
import { SidebarLink } from './SidebarLink';
import styles from './ProfileSidebar.module.css';
import { useAppDispatch } from '../../hooks/redux';
import { logoutUser } from '../../services/authActions';
import { useNavigate } from 'react-router-dom';

export const ProfileSidebar: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div>
      <SidebarLink to="/profile" end>Профиль</SidebarLink>
      <SidebarLink to="/profile/orders">История заказов</SidebarLink>
      <button
        type="button"
        className={`${styles.link} ${styles.button}`}
        onClick={async () => {
          const response = await dispatch(logoutUser()).unwrap().catch(() => null);

          if (response?.success) {
            navigate('/login', { replace: true });
          }
        }}
      >
        <span className="text text_type_main-medium">Выход</span>
      </button>

      <p className={`${styles.hint} text text_type_main-default`}>
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </div>
  );
};



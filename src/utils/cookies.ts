import Cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';

export const setCookie = (name: string, value: string, minutes?: number): void => {
  const options: CookieAttributes = { path: '/' };

  if (typeof minutes === 'number') {
    options.expires = minutes / (60 * 24);
  }

  Cookies.set(name, value, options);
};

export const getCookie = (name: string): string | null => {
  const cookieValue = Cookies.get(name);

  return typeof cookieValue === 'string' ? cookieValue : null;
};

export const deleteCookie = (name: string): void => {
  Cookies.remove(name, { path: '/' });
};



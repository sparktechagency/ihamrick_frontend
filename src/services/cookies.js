// utils/cookies.js
export const setCookie = (name, value, options = {}) => {
  let cookie = `${name}=${value}; path=${options.path || "/"};`;
  if (options.maxAge) {
    cookie += `max-age=${options.maxAge};`;
  }
  document.cookie = cookie;
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

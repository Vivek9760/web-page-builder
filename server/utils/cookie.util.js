const parseCookies = (cookieString) => {
  return cookieString.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    if (!key || !value) return acc;
    acc[key.trim()] = decodeURIComponent(value.trim());
    return acc;
  }, {});
};

module.exports = { parseCookies };

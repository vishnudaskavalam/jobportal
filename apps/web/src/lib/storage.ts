export const storage = {
  setAccessToken(token: string) {
    if (sessionStorage.getItem('refreshToken')) {
      sessionStorage.setItem('accessToken', token);
    } else {
      localStorage.setItem('accessToken', token);
    }
  },

  getAccessToken() {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  },

  setRefreshToken(token: string) {
    if (sessionStorage.getItem('refreshToken')) {
      sessionStorage.setItem('refreshToken', token);
    } else {
      localStorage.setItem('refreshToken', token);
    }
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  },

  clear() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },
};

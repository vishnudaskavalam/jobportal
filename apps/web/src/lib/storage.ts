export const storage = {
  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },

  clear() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// API 호스트 설정
export const API_HOST = process.env.REACT_APP_API_HOST || '';

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_HOST}/api/auth/login`,
  },
  USERS: {
    SIGNUP: `${API_HOST}/api/users/signup`,
  },
  SOCIAL_GATHERINGS: {
    CREATE: `${API_HOST}/api/social-gatherings`,
    LATEST: `${API_HOST}/api/social-gatherings/latest`,
    SCROLL: `${API_HOST}/api/social-gatherings/scroll`,
    PARTICIPANTS: (id: string | number) => `${API_HOST}/api/social-gatherings/${id}/participants`,
    PARTICIPATE: (id: string | number) => `${API_HOST}/api/social-gatherings/${id}/participate`,
  },
}; 
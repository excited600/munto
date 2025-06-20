// API 호스트 설정
export const API_HOST = process.env.REACT_APP_API_HOST || '';

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_HOST}/api/users/signin`,
  },
  USERS: {
    SIGNUP: `${API_HOST}/api/users/signup`,
    SELF: `${API_HOST}/api/users/self`,
  },
  SOCIAL_GATHERINGS: {
    CREATE: `${API_HOST}/api/social-gatherings`,
    LATEST: `${API_HOST}/api/social-gatherings/recommendations`,
    SCROLL: `${API_HOST}/api/social-gatherings/scroll`,
    GET_BY_ID: (id: string | number) => `${API_HOST}/api/social-gatherings/${id}`,
    PARTICIPANTS: (id: string | number) => `${API_HOST}/api/social-gatherings/${id}/participants`,
    PARTICIPATE: (id: string | number) => `${API_HOST}/api/social-gatherings/${id}/participate`,
  },
}; 
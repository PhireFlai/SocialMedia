
export function fetchUser() {
    const userString = localStorage.getItem('user');
    const userInfo = userString ? JSON.parse(userString) : null;
    return userInfo;
}
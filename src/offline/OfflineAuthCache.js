export class OfflineAuthCache {
  constructor() {
    this.cachedUser = null;
  }
  saveSession(user) {
    this.cachedUser = { uid: user.uid, email: user.email, lastLogin: new Date().toISOString() };
  }
  getSession() {
    return this.cachedUser;
  }
}

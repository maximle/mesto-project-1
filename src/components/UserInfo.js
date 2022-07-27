export default class UserInfo {
  constructor({nameSelector, aboutSelector, avatarSelector}, apiObject) {
      this._nameSelector = nameSelector;
      this._aboutSelector = aboutSelector;
      this._avatarSelector = avatarSelector;
      this._apiObject = apiObject;
      this.user = {};
  }

  updateAvatar({link}) {
    this._avatarSelector.src = link;
  }

  getUserInfo() {
      return (
          this._apiObject.getDataOnRequestToServer({target: 'users/me', config1: {
              method: 'GET'
          }})
          .then(user => {
              
              this._avatarSelector.src = user.avatar;
              this._nameSelector.textContent = user.name;
              this._aboutSelector.textContent = user.about;
              this.user.avatar = user.avatar;
              this.user.name = user.name;
              this.user.description = user.about;
              this.user['_id'] = user['_id'];

              return this.user;
              })
          .catch(error => {
              console.log(error);
              return error;
          })
      );
      }

  setUserInfo({userInfo}) {          
    console.log(userInfo);
    this._nameSelector.textContent = userInfo.name;
    this._aboutSelector.textContent = userInfo.about;
    this._avatarSelector.src = userInfo.avatar;
    this.user.name = userInfo.name;
    this.user.description = userInfo.about;
    this.user.avatar = userInfo.avatar;
    this.user['_id'] = userInfo['_id'];
    console.log('Данные обновлены');
  }

}

export {
  UserInfo
}
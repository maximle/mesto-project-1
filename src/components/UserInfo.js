export default class UserInfo {
  constructor({nameSelector, aboutSelector, avatarSelector}, apiObject) {
      this._nameSelector = nameSelector;
      this._aboutSelector = aboutSelector;
      this._avatarSelector = avatarSelector;
      this._apiObject = apiObject;
      this.user = {};
  }

  updateAvatar({link}) {
      return (
          this._apiObject.getDataOnRequestToServer({target: 'users/me/avatar', config1: {
              method: 'PATCH',
              body: JSON.stringify(
                  {
                      avatar: link
                  })}})
      )
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

  setUserInfo({name, about}) {
      return (
          this._apiObject.getDataOnRequestToServer({target: 'users/me', config1: {
              method: 'PATCH',
              body: JSON.stringify(
                  {
                  name: name,
                  about: about
              })
          }})
              .then(updatedUser => {
                  this._nameSelector.textContent = updatedUser.name;
                  this._aboutSelector.textContent = updatedUser.about;
  
                  this.user.name = updatedUser.name;
                  this.user.description = updatedUser.about;
                  this.user.avatar = updatedUser.avatar;
                  this.user['_id'] = updatedUser['_id'];
                  console.log('Данные обновлены');
                  return updatedUser;
              })
              .catch(error => {
                  return error;
              })
              );
          }
  }



export {
  UserInfo
}
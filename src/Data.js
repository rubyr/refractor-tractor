class Data {
  constructor() {
    this.userUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData';
    this.sleepUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData';
    this.activityUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData';
    this.hydrationUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData';
    this.userData = this.fetchData(this.userUrl, 'userData');
    this.sleepData = this.fetchData(this.sleepUrl, 'sleepData');
    this.activityData = this.fetchData(this.activityUrl, 'activityData');
    this.hydrationData = this.fetchData(this.hydrationUrl, 'hydrationData');
  }

  fetchData(url, type) {
    fetch(url).then(data => data.json()).then(data => this[type] = data[type]);
  }
}

export default Data;

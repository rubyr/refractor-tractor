class Data {
  constructor() {
    this.userUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData';
    this.sleepUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData';
    this.activityUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData';
    this.hydrationUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData';
    this.userData = fetch(this.userUrl).then(data => data.json()).then(data => data.userData);
    this.sleepData = fetch(this.sleepUrl).then(data => data.json()).then(data => data.sleepData);
    this.activityData = fetch(this.activityUrl).then(data => data.json()).then(data => data.activityData);
    this.hydrationData = fetch(this.hydrationUrl).then(data => data.json()).then(data => data.hydrationData);
  }



  // fetchData(url, type) async {
  //   let fetchedData = await fetch(url).then(data => data.json()).then(data => data[type]);
  //   return fetchedData;
  // }
}

export default Data;

const url = 'https://fe-apps.herokuapp.com/api/v1/fitlit/';
const userUrl = `${url}1908/users/userData`;
const sleepUrl = `${url}1908/sleep/sleepData`;
const activityUrl = `${url}1908/activity/activityData`;
const hydrationUrl = `${url}1908/hydration/hydrationData`;
export const userPromise = fetchData(userUrl, 'userData')
export const sleepPromise = fetchData(sleepUrl, 'sleepData')
export const activityPromise = fetchData(activityUrl, 'activityData')
export const hydrationPromise = fetchData(hydrationUrl, 'hydrationData')

function fetchData(url, type) {
  return fetch(url).then(data => data.json()).then(data => data[type]);
}

const url = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/';
const userUrl = `${url}users/userData`;
const sleepUrl = `${url}sleep/sleepData`;
const activityUrl = `${url}activity/activityData`;
const hydrationUrl = `${url}hydration/hydrationData`;
export const userPromise = fetchData(userUrl, 'userData');
export const sleepPromise = fetchData(sleepUrl, 'sleepData');
export const activityPromise = fetchData(activityUrl, 'activityData');
export const hydrationPromise = fetchData(hydrationUrl, 'hydrationData');

function fetchData(url, type) {
  return fetch(url).then(data => data.json()).then(data => data[type]);
}

const userUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData';
const sleepUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData';
const activityUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData';
const hydrationUrl = 'https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData';
export const userPromise = fetch(userUrl).then(data => data.json()).then(data => data.userData);
export const sleepPromise = fetch(sleepUrl).then(data => data.json()).then(data => data.sleepData);
export const activityPromise = fetch(activityUrl).then(data => data.json()).then(data => data.activityData);
export const hydrationPromise = fetch(hydrationUrl).then(data => data.json()).then(data => data.hydrationData);


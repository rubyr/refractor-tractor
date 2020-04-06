import $ from "jquery";
import "./css/base.scss";
import "./css/style.scss";

import "./images/person walking on path.jpg";
import "./images/The Rock.jpg";

import userData from "./data/users";
import hydrationData from "./data/hydration";
import sleepData from "./data/sleep";
import activityData from "./data/activity";

import User from "./User";
import Activity from "./Activity";
import Hydration from "./Hydration";
import Sleep from "./Sleep";
import UserRepo from "./User-repo";

// data and page
function startApp() {
  let userList = [];
  makeUsers(userList);
  let userRepo = new UserRepo(userList);
  let hydrationRepo = new Hydration(hydrationData);
  let sleepRepo = new Sleep(sleepData);
  let activityRepo = new Activity(activityData);
  var userNowId = pickUser();
  let userNow = getUserById(userNowId, userRepo);
  let today = makeToday(userRepo, userNowId, hydrationData);
  let randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
  $(".historicalWeek").prepend(`Week of ${randomHistory}`);
  addInfoToSidebar(userNow, userRepo);
  addHydrationInfo(userNowId, hydrationRepo, today, userRepo, randomHistory);
  addSleepInfo(userNowId, sleepRepo, today, userRepo, randomHistory);
  let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
  addActivityInfo(
    userNowId,
    activityRepo,
    today,
    userRepo,
    randomHistory,
    userNow,
    winnerNow
  );
  addFriendGameInfo(
    userNowId,
    activityRepo,
    userRepo,
    today,
    randomHistory,
    userNow
  );
}

// data
function makeUsers(array) {
  userData.forEach(function (dataItem) {
    let user = new User(dataItem);
    array.push(user);
  });
}

// data
function pickUser() {
  return Math.floor(Math.random() * 50);
}

// data
function getUserById(id, listRepo) {
  return listRepo.getDataFromID(id);
}

// page
function addInfoToSidebar(user, userStorage) {
  $("#sidebarName").text(user.name);
  $("#headerText").text(`${user.getFirstName()}'s Activity Tracker`);
  $("#stepGoalCard").text(`Your daily step goal is ${user.dailyStepGoal}.`);
  $("#userAddress").text(user.address);
  $("#userEmail").text(user.email);
  $("#userStridelength").text(
    `Your stridelength is ${user.strideLength} meters.`
  );
  $("#friendList").append(makeFriendHTML(user, userStorage));
}

// page
function makeFriendHTML(user, userStorage) {
  return user
    .getFriendsNames(userStorage)
    .map(
      (friendName) => `<li class='historical-list-listItem'>${friendName}</li>`
    )
    .join("");
}

// why is this a function
function makeWinnerID(activityInfo, user, dateString, userStorage) {
  return activityInfo.getWinnerId(user, dateString, userStorage);
}

// data
function makeToday(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[0].date;
}

// data
function makeRandomDate(userStorage, id, dataSet) {
  var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
  return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date;
}

function addHydrationInfo(
  id,
  hydrationInfo,
  dateString,
  userStorage,
  laterDateString
) {
  $("#hydrationToday").prepend(
    `<p>You drank</p><p><span class="number">${hydrationInfo.calculateDailyOunces(
      id,
      dateString
    )}</span></p><p>oz water today.</p>`
  );
  $("#hydrationAverage").prepend(
    `<p>Your average water intake is</p><p><span class="number">${hydrationInfo.calculateAverageOunces(
      id
    )}</span></p> <p>oz per day.</p>`
  );
  $("#hydrationThisWeek").prepend(
    makeHydrationHTML(
      id,
      hydrationInfo,
      userStorage,
      hydrationInfo.calculateFirstWeekOunces(userStorage, id)
    )
  );
  $("#hydrationEarlierWeek").prepend(
    makeHydrationHTML(
      id,
      hydrationInfo,
      userStorage,
      hydrationInfo.calculateRandomWeekOunces(laterDateString, id, userStorage)
    )
  );
}

// page
function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method
    .map(
      (drinkData) =>
      `<li class="historical-list-listItem">On ${drinkData}oz</li>`
    )
    .join("");
}

// page
function addSleepInfo(id, sleepInfo, dateString, userStorage, laterDateString) {
  $("#sleepToday").prepend(
    `<p>You slept</p> <p><span class="number">${sleepInfo.calculateDailySleep(
      id,
      dateString
    )}</span></p> <p>hours today.</p>`
  );
  $("#sleepQualityToday").prepend(
    `<p>Your sleep quality was</p> <p><span class="number">${sleepInfo.calculateDailySleepQuality(
      id,
      dateString
    )}</span></p><p>out of 5.</p>`
  );
  $("#avUserSleepQuality").prepend(
    `<p>The average user's sleep quality is</p> <p><span class="number">${
      Math.round(sleepInfo.calculateAllUserSleepQuality() * 100) / 100
    }</span></p><p>out of 5.</p>`
  );
  $("#sleepThisWeek").prepend(
    makeSleepHTML(
      id,
      sleepInfo,
      userStorage,
      sleepInfo.calculateWeekSleep(dateString, id, userStorage)
    )
  );
  $("#sleepEarlierWeek").prepend(
    makeSleepHTML(
      id,
      sleepInfo,
      userStorage,
      sleepInfo.calculateWeekSleep(laterDateString, id, userStorage)
    )
  );
}

// page
function makeSleepHTML(id, sleepInfo, userStorage, method) {
  return method
    .map(
      (sleepData) =>
      `<li class="historical-list-listItem">On ${sleepData} hours</li>`
    )
    .join("");
}

// page (never used)
function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
  return method
    .map(
      (sleepQualityData) =>
      `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`
    )
    .join("");
}

function addActivityInfo(
  id,
  activityInfo,
  dateString,
  userStorage,
  laterDateString,
  user,
  winnerId
) {
  $("#userStairsToday").prepend(
    `<p>Stair Count:</p><p>You</><p><span class="number">${activityInfo.userDataForToday(
      id,
      dateString,
      userStorage,
      "flightsOfStairs"
    )}</span></p>`
  );
  $("#avgStairsToday").prepend(
    `<p>Stair Count: </p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
      dateString,
      userStorage,
      "flightsOfStairs"
    )}</span></p>`
  );
  $("#userStepsToday").prepend(
    `<p>Step Count:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(
      id,
      dateString,
      userStorage,
      "numSteps"
    )}</span></p>`
  );
  $("#avgStepsToday").prepend(
    `<p>Step Count:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
      dateString,
      userStorage,
      "numSteps"
    )}</span></p>`
  );
  $("#userMinutesToday").prepend(
    `<p>Active Minutes:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(
      id,
      dateString,
      userStorage,
      "minutesActive"
    )}</span></p>`
  );
  $("#avgMinutesToday").prepend(
    `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(
      dateString,
      userStorage,
      "minutesActive"
    )}</span></p>`
  );
  $("#userStepsThisWeek").prepend(
    makeStepsHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(id, dateString, userStorage, "numSteps")
    )
  );
  $("#userStairsThisWeek").prepend(
    makeStairsHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(
        id,
        dateString,
        userStorage,
        "flightsOfStairs"
      )
    )
  );
  $("#userMinutesThisWeek").prepend(
    makeMinutesHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(id, dateString, userStorage, "minutesActive")
    )
  );
  $("#bestUserSteps").prepend(
    makeStepsHTML(
      user,
      activityInfo,
      userStorage,
      activityInfo.userDataForWeek(
        winnerId,
        dateString,
        userStorage,
        "numSteps"
      )
    )
  );
}

// page
function makeStepsHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (activityData) =>
      `<li class="historical-list-listItem">On ${activityData} steps</li>`
    )
    .join("");
}

// page
function makeStairsHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (data) => `<li class="historical-list-listItem">On ${data} flights</li>`
    )
    .join("");
}

// page
function makeMinutesHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (data) => `<li class="historical-list-listItem">On ${data} minutes</li>`
    )
    .join("");
}

function addFriendGameInfo(
  id,
  activityInfo,
  userStorage,
  dateString,
  laterDateString,
  user
) {
  $("#friendChallengeListToday").prepend(
    makeFriendChallengeHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.showChallengeListAndWinner(user, dateString, userStorage)
    )
  );
  $("#streakList").prepend(
    makeStepStreakHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.getStreak(userStorage, id, "numSteps")
    )
  );
  $("#streakListMinutes").prepend(
    makeStepStreakHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.getStreak(userStorage, id, "minutesActive")
    )
  );
  $("#friendChallengeListHistory").prepend(
    makeFriendChallengeHTML(
      id,
      activityInfo,
      userStorage,
      activityInfo.showChallengeListAndWinner(user, dateString, userStorage)
    )
  );
  $("#bigWinner").prepend(
    `THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(
      user,
      dateString,
      userStorage
    )} steps`
  );
}

// page
function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (friendChallengeData) =>
      `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`
    )
    .join("");
}

// page
function makeStepStreakHTML(id, activityInfo, userStorage, method) {
  return method
    .map(
      (streakData) => `<li class="historical-list-listItem">${streakData}!</li>`
    )
    .join("");
}

startApp();
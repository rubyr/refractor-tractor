import $ from "jquery";
import "./css/variables.scss"
import "./css/style.scss";
import "./css/base.scss";
import "./css/media-queries.scss"
import "./images/person walking on path.jpg";
import "./images/The Rock.jpg";
import {userPromise, sleepPromise, activityPromise, hydrationPromise} from "./Utils.js"
import DataHandler from "./data-handler";

let dataObj = {};
Promise.all([userPromise, sleepPromise, activityPromise, hydrationPromise]).then(data => dataObj = {
  userData: data[0],
  sleepData: data[1],
  activityData: data[2],
  hydrationData: data[3]
}).then(() => startApp());

function startApp() {
  let dataHandler = new DataHandler();
  $(".historicalWeek").prepend(`Week of ${dataHandler.randomHistory}`);
  addInfoToSidebar(dataHandler.userNow, dataHandler.userRepo);
  addHydrationInfo(
    dataHandler.userNowId, 
    dataHandler.hydrationRepo, 
    dataHandler.today, 
    dataHandler.userRepo, 
    dataHandler.randomHistory
  );  
  addSleepInfo(
    dataHandler.userNowId, 
    dataHandler.sleepRepo, 
    dataHandler.today, 
    dataHandler.userRepo, 
    dataHandler.randomHistory
  );
  let winnerNow = dataHandler.activityRepo.getWinnerId(
    dataHandler.userNow,
    dataHandler.today, 
    dataHandler.userRepo
  );
  addActivityInfo(
    dataHandler.userNowId,
    dataHandler.activityRepo,
    dataHandler.today,
    dataHandler.userRepo,
    dataHandler.randomHistory,
    dataHandler.userNow,
    winnerNow
  );
  addFriendGameInfo(
    dataHandler.userNowId,
    dataHandler.activityRepo,
    dataHandler.userRepo,
    dataHandler.today,
    dataHandler.randomHistory,
    dataHandler.userNow
  );
}

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

function makeFriendHTML(user, userStorage) {
  return user
    .getFriendsNames(userStorage)
    .map(
      (friendName) => `<li class='historical-list-listItem'>${friendName}</li>`
    )
    .join("");
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
      hydrationInfo.calculateWeekOunces(laterDateString, id, userStorage)
    )
  );
}

function makeHydrationHTML(id, hydrationInfo, userStorage, method) {
  return method
    .map(
      (drinkData) =>
      `<li class="historical-list-listItem">On ${drinkData}oz</li>`
    )
    .join("");
}

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

import $ from "jquery";
import "./css/base.scss";
import "./css/media-queries.scss";
import "./images/person walking on path.jpg";
import "./images/The Rock.jpg";
import {
  userPromise, sleepPromise, activityPromise, hydrationPromise
} from "./utils.js";
import DataHandler from "./data-handler";

let data = {};
let dataHandler;

Promise.all([userPromise, sleepPromise, activityPromise, hydrationPromise]).then(response => data = {
  userData: response[0],
  sleepData: response[1],
  activityData: response[2],
  hydrationData: response[3]
}).then(() => startApp(data));

function startApp(data) {
  dataHandler = new DataHandler(data);
  $("body>section").hide();
  $(`user-stats-expanded`).show();
  addInfoToUser();
  addHydrationInfo();
  addSleepInfo();
  addActivityInfo();
}

$(".tabs-section").click(function(event) {
  if (event.target.id !== "") {
    $("body>section").hide();
    $(`.${event.target.id}-expanded`).show();
  }
});

function addInfoToUser() {
  const user = dataHandler.userNow;
  $("#user-name").text(user.name);
  $("#stepGoalCard").text(`Your daily step goal is ${user.dailyStepGoal}.`);
  $("#user-address").text(user.address);
  $("#user-email").text(user.email);
  $("#user-stridelength").text(
    `Stridelength: ${user.strideLength} meters`
  );
  $("#friends-list").append(makeFriendHTML(user, dataHandler.userRepo));
}

function makeFriendHTML(user, userStorage) {
  return user
    .getFriendsNames(userStorage)
    .map(
      (friendName) => `<li class='historical-list-listItem'>${friendName}</li>`
    )
    .join("");
}

function addHydrationInfo() {
  const hydrationInfo = dataHandler.hydrationRepo;
  const id = dataHandler.userNowId;
  const dateString = dataHandler.today;
  const userStorage = dataHandler.userRepo;
  $("#hydration-today").html(
    `<p>You drank<span class="big-number">${hydrationInfo.calculateDailyOunces(
      id,
      dateString
    )}</span>oz of water today.</p>`
  );
  $("#hydration-average").html(
    `<p>Your average water intake is<span class="number">${hydrationInfo.calculateAverageOunces(
      id
    )}</span>oz per day.</p>`
  );
  $("#hydration-week").html(
    makeCalendarHTML(
      hydrationInfo.calculateFirstWeekOunces(userStorage, id),
      "oz"
    )
  );
}

function addSleepInfo() {
  const sleepInfo = dataHandler.sleepRepo;
  const id = dataHandler.userNowId;
  const dateString = dataHandler.today;
  const userStorage = dataHandler.userRepo;
  $("#sleep-today").html(
    `<p>You slept<span class="number">${
      sleepInfo.sleepLength(id, dateString)
    }</span>hours today.</p>`
  );
  $("#avg-user-sleep").html(
    `<p>On average, you sleep<span class="number">${
      sleepInfo.calculateAverageSleep(id, dateString)
    }</span>hours.</p>`
  );
  $("#sleep-week").html(
    makeCalendarHTML(
      sleepInfo.calculateWeekSleep(dateString, id, userStorage),
      "hours"
    )
  );
  $("#sleep-quality-today").html(
    `<p>Your sleep quality was<span class="number">${
      sleepInfo.sleepQuality(id, dateString)
    }</span>out of 5.</p>`
  );
  $("#avg-user-sleep-quality").html(
    `<p>The average user's sleep quality is<span class="number">${
      sleepInfo.totalQuality()
    }</span>out of 5.</p>`
  );
  $("#sleep-quality-week").html(
    makeCalendarHTML(
      sleepInfo.calculateWeekSleepQuality(dateString, id, userStorage),
      "out of 5"
    )
  );
}

function addActivityInfo() {
  const activityInfo = dataHandler.activityRepo;
  const id = dataHandler.userNowId;
  const dateString = dataHandler.today;
  const userStorage = dataHandler.userRepo;
  $("#activity-stairs-today").html(
    `<p>You climbed<span class="number">${
      activityInfo.calculateDailyStairs(id, dateString)
    }</span>flights of stairs today.</p>`
  );
  $("#activity-avg-stairs-today").html(
    `<p>The average stairs climbed was<span class="number">${
      activityInfo.getAllUserAverageForDay(
        dateString, userStorage, "flightsOfStairs")
    }</span>flights of stairs today.</p>`
  );
  $("#activity-steps-today").html(
    `<p>You took<span class="number">${
      activityInfo.calculateDailySteps(id, dateString)
    }</span>steps today.</p>`
  );
  $("#activity-avg-steps-today").html(
    `<p>The average steps taken today was<span class="number">${
      activityInfo.getAllUserAverageForDay(dateString, userStorage, "numSteps")
    }</span>steps.</p>`
  );
  $("#activity-mins-today").html(
    `<p>You were active for<span class="number">${
      activityInfo.calculateActiveMinutes(id, dateString)
    }</span>minutes today.</p>`
  );
  $("#activity-avg-mins-today").html(
    `<p>The average active minutes today was<span class="number">${
      activityInfo.getAllUserAverageForDay(
        dateString, userStorage, "minutesActive")
    }</span>minutes.</p>`
  );
  $("#activity-steps-week").html(
    makeCalendarHTML(
      activityInfo.userDataForWeek(
        id, dateString, userStorage, "numSteps"),
      "steps"
    )
  );
  $("#activity-stairs-week").html(
    makeCalendarHTML(
      activityInfo.userDataForWeek(
        id, dateString, userStorage, "flightsOfStairs"),
      "stairs"
    )
  );
  $("#activity-mins-week").html(
    makeCalendarHTML(
      activityInfo.userDataForWeek(
        id, dateString, userStorage, "minutesActive"),
      "minutes"
    )
  );
}

function makeCalendarHTML(method, unit) {
  return "<table class=\"table-calendar\">" + method.map((data) =>
    `<tr><td class="calendar-cell">${data.split(": ").join("</td><td>")} ${unit}</td></tr>`
  ).join("") + "</table>";
}

$("#sleepNew-submit").click(() => {
  const sleep = {
    hoursSlept: $("#sleepNew-hours").val(),
    sleepQuality: $("#sleepNew-quality").val()
  };
  if (validateInput(sleep, ".sleep-input")) {
    postData("sleep/sleepData", sleep);
  }
});

$("#activityNew-submit").click(() => {
  const activity = {
    numSteps: $("#activityNew-steps").val(),
    minutesActive: $("#activityNew-minutes").val(),
    flightsOfStairs: $("#activityNew-stairs").val()
  };
  if (validateInput(activity, ".activity-input")) {
    postData("activity/activityData", activity);
  }
});

$("#hydrationNew-submit").click(() => {
  const hydration = {
    numOunces: $("#hydrationNew-ounces").val(),
  };
  if (validateInput(hydration, ".hydration-input")) {
    postData("hydration/hydrationData", hydration);
  }
});

function validateInput(obj, inputName) {
  $(inputName).removeClass("invalid-input");
  if (Object.values(obj).some(v => v === "")) {
    $(inputName).filter(function() { 
      return !this.value 
    }).addClass("invalid-input");
    return false;
  }
  return true;
}

function postData(url, data) {
  let datenow = new Date().toISOString()
  datenow = datenow.split("T")[0].replace(/-/g, "/");
  let body = {
    "userID": dataHandler.userNowId,
    "date": datenow,
  }
  for (const [key, value] of Object.entries(data)) {
    body[key] = Number(value);
  }
  fetch(`https://fe-apps.herokuapp.com/api/v1/fitlit/1908/${url}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
    .then(() => $("input").val(""))
    .catch(err => {
      $("#error-message").show().children("p").append(`(${err})`);
    });
}

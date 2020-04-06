import User from "./User";
import UserRepo from "./User-repo";
import Hydration from "./Hydration";
import Sleep from "./Sleep";
import Activity from "./Activity";

// remove when fetching data
import userData from "./data/users";
import hydrationData from "./data/hydration";
import sleepData from "./data/sleep";
import activityData from "./data/activity";

class DataHandler {
  constructor() {
    this.userList = [],
    this.makeUsers(this.userList);
    this.userRepo = new UserRepo(this.userList);
    this.hydrationRepo = new Hydration(hydrationData);
    this.sleepRepo = new Sleep(sleepData);
    this.activityRepo = new Activity(activityData);
    this.userNowId = this.pickUser();
    this.userNow = this.getUserById(this.userNowId, this.userRepo);
    this.today = this.makeToday(this.userRepo, this.userNowId, hydrationData);
    this.randomHistory = this.makeRandomDate(
      this.userRepo, 
      this.userNowId, 
      hydrationData
    );
  }

  makeUsers(array) {
    userData.forEach(function (dataItem) {
      let user = new User(dataItem);
      array.push(user);
    });
  }

  pickUser() {
    return Math.floor(Math.random() * 50);
  }

  getUserById(id, listRepo) {
    return listRepo.getDataFromID(id);
  }

  makeToday(userStorage, id, dataSet) {
    var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
    return sortedArray[0].date;
  }
  
  makeRandomDate(userStorage, id, dataSet) {
    var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
    return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date;
  }
}

export default DataHandler;
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
    this.userNowId = this.pickRandomUser();
    this.userList = [],
    this.makeUsers();
    this.userRepo = new UserRepo(this.userList);
    this.hydrationRepo = new Hydration(hydrationData);
    this.sleepRepo = new Sleep(sleepData);
    this.activityRepo = new Activity(activityData);
    this.today = this.makeToday(this.userRepo, this.userNowId, hydrationData);
    this.randomHistory = this.makeRandomDate(
      this.userRepo, 
      this.userNowId, 
      hydrationData
    );
  }

  makeUsers() {
    this.userNow = new User(userData.find(user => user.id === this.userNowId));
    this.userNow.friends.forEach(uid => {
      this.userList.push(new User(userData.find(user => user.id === uid)));
    });
  }

  pickRandomUser() {
    return Math.floor(Math.random() * (userData.length - 1)) + 1;
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
    return sortedArray[Math.floor(Math.random() * sortedArray.length)].date;
  }
}

export default DataHandler;
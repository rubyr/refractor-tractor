import User from "./User";
import UserRepo from "./User-repo";
import Hydration from "./Hydration";
import Sleep from "./Sleep";
import Activity from "./Activity";
class DataHandler {
  constructor(data) {
    this.userNowId = this.pickRandomUser(data);
    this.userList = [],
    this.makeUsers(data);
    this.userRepo = new UserRepo(this.userList);
    this.hydrationRepo = new Hydration(data.hydrationData);
    this.sleepRepo = new Sleep(data.sleepData);
    this.activityRepo = new Activity(data.activityData);
    this.today = this.makeToday(this.userRepo, this.userNowId, data.hydrationData);
    this.randomHistory = this.makeRandomDate(
      this.userRepo,
      this.userNowId,
      data.hydrationData
    );
  }

  makeUsers(data) {
    this.userNow = new User(data.userData.find(user => user.id === this.userNowId));
    this.userNow.friends.forEach(uid => {
      this.userList.push(new User(data.userData.find(user => user.id === uid)));
    });
  }

  pickRandomUser(data) {
    return Math.floor(Math.random() * (data.userData.length - 1)) + 1;
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
import DataRepo from './DataRepo';
class Activity extends DataRepo {
  constructor(data) {
    super(data);
  }

  calculateDailyStairs(userId, date) {
    return super.daily(userId, date, "flightsOfStairs");
  }

  calculateDailySteps(userId, date) {
    return super.daily(userId, date, "numSteps");
  }

  calculateActiveMinutes(userId, date) {
    return super.daily(userId, date, "minutesActive")
  }

  getAllUserAverageForDay(date, userRepo, attr) {
    const selectedDayData = userRepo.chooseDayDataForAllUsers(this.data, date);
    return super.averageData(selectedDayData, attr);
  }

  userDataForToday(id, date, attr) {
    return super.daily(id, date, attr);
  }

  userDataForWeek(id, date, userRepo, attr) {
    return super.weekly(id, date, attr, userRepo);
  }
}

export default Activity;
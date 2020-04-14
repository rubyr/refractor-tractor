import DataRepo from './DataRepo';
class Sleep extends DataRepo {
  constructor(data) {
    super(data);
  }
  
  calculateAverageSleep(id) {
    return super.average(id, "hoursSlept");
  }

  calculateAverageSleepQuality(id) {
    return super.average(id, "sleepQuality");
  }

  sleepLength(id, date) {
    return super.daily(id, date, "hoursSlept");
  }

  sleepQuality(id, date) {
    return super.daily(id, date, "sleepQuality");
  }

  calculateWeekSleep(date, id, userRepo) {
    return super.weekly(id, date, "hoursSlept", userRepo);
  }

  calculateWeekSleepQuality(date, id, userRepo) {
    return super.weekly(id, date, "sleepQuality", userRepo);
  }

  totalQuality() {
    var totalSleepQuality = this.data.reduce(function(sumSoFar, dataItem) {
      sumSoFar += dataItem.sleepQuality;
      return sumSoFar;
    }, 0)
    return +(totalSleepQuality / this.data.length).toFixed(2);
  }
}

export default Sleep;

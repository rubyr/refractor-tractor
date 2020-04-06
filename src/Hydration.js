import DataRepo from "./DataRepo";

class Hydration extends DataRepo {
  calculateAverageOunces(id) {
    return super.average(id, "numOunces");
  }
  calculateDailyOunces(id, date) {
    return super.daily(id, date, "numOunces");
  }
  calculateFirstWeekOunces(userRepo, id) {
    return super.weekly(id, userRepo.getFirstWeek(id, this.data), "numOunces", userRepo);
  }
  calculateWeekOunces(date, id, userRepo) {
    return super.weekly(id, date, "numOunces", userRepo);
  }
}


export default Hydration;

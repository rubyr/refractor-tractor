import DataRepo from "./DataRepo";
class Hydration extends DataRepo {
  constructor(data) {
    super(data);
  }
  
  calculateAverageOunces(id) {
    return super.average(id, "numOunces");
  }

  calculateDailyOunces(id, date) {
    return super.daily(id, date, "numOunces");
  }

  calculateFirstWeekOunces(userRepo, id) {
    let user = userRepo.getFirstWeek(id, this.data);
    return super.weekly(id, user[0].date, "numOunces", userRepo);
  }
  
  calculateWeekOunces(date, id, userRepo) {
    return super.weekly(id, date, "numOunces", userRepo);
  }
}

export default Hydration;

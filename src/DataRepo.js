class DataRepo {
  constructor(data) {
    this.data = data;
  }

  average(userId, attr) {
    let perDay = this.data.filter((data) => 
      userId === data.userID
    );
    return +(perDay.reduce((sumSoFar, data) => 
      sumSoFar + data[attr]
    , 0) / perDay.length).toFixed(2);
  }

  daily(userId, date, attr) {
    let day = this.data.find((data) => 
      userId === data.userID && date === data.date
    );
    return day[attr];
  }

  weekly(userId, date, attr, userRepo) {
    return userRepo.getWeekFromDate(date, userId, this.data).map((data) => `${data.date}: ${data[attr]}`);
  }
}

export default DataRepo;
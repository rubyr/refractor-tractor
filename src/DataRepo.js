class DataRepo {
  constructor(data) {
    this.data = data;
  }

  averageData(data, attr) {
    return +(data.reduce((sumSoFar, data) => 
      sumSoFar + data[attr]
    , 0) / data.length).toFixed(2);
  }

  average(userId, attr) {
    let perDay = this.data.filter((data) => 
      userId === data.userID
    );
    return this.averageData(perDay, attr);
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
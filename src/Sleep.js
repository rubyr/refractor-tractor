import DataRepo from './DataRepo';
class Sleep extends DataRepo {
  calculateAverageSleep(id) {
    return super.average(id, "hoursSlept");
  }

  calculateAverageSleepQuality(id) {
    return super.average(id, "sleepQuality");
  }

  calculateDailySleep(id, date) {
    return super.daily(id, date, "hoursSlept");
  }

  calculateDailySleepQuality(id, date) {
    return super.daily(id, date, "sleepQuality");
  }
  calculateWeekSleep(date, id, userRepo) {
    return super.weekly(id, date, "hoursSlept", userRepo);
  }

  calculateWeekSleepQuality(date, id, userRepo) {
    return super.weekly(id, date, "sleepQuality", userRepo);
  }
  calculateAllUserSleepQuality() {
    var totalSleepQuality = this.data.reduce(function(sumSoFar, dataItem) {
      sumSoFar += dataItem.sleepQuality;
      return sumSoFar;
    }, 0)
    return totalSleepQuality / this.data.length
  }
  determineBestSleepers(date, userRepo) {
    let timeline = userRepo.chooseWeekDataForAllUsers(this.data, date);
    let userSleepObject = userRepo.isolateUsernameAndRelevantData(this.data, date, 'sleepQuality', timeline);

    return Object.keys(userSleepObject).filter(function(key) {
      return (userSleepObject[key].reduce(function(sumSoFar, sleepQualityValue) {
        sumSoFar += sleepQualityValue
        return sumSoFar;
      }, 0) / userSleepObject[key].length) > 3
    }).map(function(sleeper) {
      return userRepo.getDataFromID(parseInt(sleeper)).name;
    })
  }
  determineSleepWinnerForWeek(date, userRepo) {
    let timeline = userRepo.chooseWeekDataForAllUsers(this.data, date);
    let sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.data, date, 'sleepQuality', timeline);

    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }
  determineSleepHoursWinnerForDay(date, userRepo) {
    let timeline = userRepo.chooseDayDataForAllUsers(this.data, date);
    let sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.data, date, 'hoursSlept', timeline);

    return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
  }
  getWinnerNamesFromList(sortedArray, userRepo) {
    let bestSleepers = sortedArray.filter(function(element) {
      return element[Object.keys(element)] === Object.values(sortedArray[0])[0]
    });

    let bestSleeperIds = bestSleepers.map(function(bestSleeper) {
      return (Object.keys(bestSleeper));
    });

    return bestSleeperIds.map(function(sleepNumber) {
      return userRepo.getDataFromID(parseInt(sleepNumber)).name;
    });
  }
}


export default Sleep;

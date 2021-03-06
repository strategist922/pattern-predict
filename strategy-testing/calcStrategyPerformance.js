const timeBreakdowns = require('./timeBreakdowns');
const percBreakdowns = require('./percBreakdowns');

const calcStrategyPerformanceOfSinglePercBreakdown = (testResults, percFilter) => {
  const strategies = Object.keys(testResults[0].strategies);
  return strategies.reduce((acc, strategyKey) => {
    const testsThatMeetFilter = testResults.filter(test => percFilter(test.strategies[strategyKey]));
    const percUp = testsThatMeetFilter.filter(test => test.wentUpFollowingDay).length * 10000 / (testsThatMeetFilter.length * 100);
    acc[strategyKey] = {
      percUp,
      count: testsThatMeetFilter.length
    };
    return acc;
  }, {});
};

const calcStrategyPerformanceOverall = testResults => {

  const calcStrategyPerformanceOfSingleTimeBreakdown = testResults => {
    // console.log('------------------------------');
    // console.log(tests);
    return Object.keys(percBreakdowns).map(breakdownName => {
      const percFilter = percBreakdowns[breakdownName];
      return {
        breakdownName,
        strategyPerformance: calcStrategyPerformanceOfSinglePercBreakdown(testResults, percFilter)
      };
    });
  };

  const overallStrategyPerformance = Object.keys(timeBreakdowns).reduce((acc, timeBreakdown) => {
    acc[timeBreakdown] = calcStrategyPerformanceOfSingleTimeBreakdown(
      testResults.slice(0 - timeBreakdowns[timeBreakdown])
    );
    return acc;
  }, {});

  return overallStrategyPerformance;
};

module.exports = {
  single: calcStrategyPerformanceOfSinglePercBreakdown,
  overall: calcStrategyPerformanceOverall
};

const states = require('../config/states.json');

exports.getStateNameByCode = (stateCode) => {
  for (i in states) {
    if (states[i].code.toLowerCase() === stateCode.toLowerCase()) {
      return states[i].name.toLowerCase();
    }
  }
  return '';
};

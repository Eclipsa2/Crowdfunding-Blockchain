export const daysLeft = (deadline) => {
  const difference = deadline - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const weiToEth = (wei) => {
  return wei * Math.pow(10, -18);
};

export const roundUpToSixDecimals = (number) => {
  const factor = Math.pow(10, 6);
  return Math.ceil(number * factor) / factor;
};

export const logMarValues: {[key: number]: number} = {
  1: 1.0, // 20/200
  2: 0.9, // 20/160
  3: 0.8, // 20/125
  4: 0.7, // 20/100
  5: 0.6, // 20/80
  6: 0.5, // 20/63
  7: 0.4, // 20/50
  8: 0.3, // 20/40
  9: 0.2, // 20/32
  10: 0.1, // 20/25
  11: 0.0, // 20/20
  12: -0.1, // 20/16
};

export const logMARToSnellen = (logMAR: number) => {
  const denominator = Math.round(20 * Math.pow(10, logMAR));
  return `20/${denominator}`;
};

// Calculate pixel size based on LogMAR value
export const calculateSizeFromLogMAR = (
  logMAR: number,
  screenWidth: number,
) => {
  const denominator = Math.round(20 * Math.pow(10, logMAR));
  const result = 20 / denominator;
  const baseSize = screenWidth * 0.4;
  const logsize = baseSize * Math.pow(10, -result);
  return logsize;
};

export type Direction = 'up' | 'right' | 'down' | 'left';

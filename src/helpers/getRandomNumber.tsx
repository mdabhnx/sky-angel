export function getRandomNumber(min: number = 50, max: number = 300): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function limit({ x, y }: { x: number; y: number }) {
  const minX = (window.innerWidth / 2 - 180) * -1;
  const maxX = minX * -1;
  const maxY = window.innerHeight - 95;
  const returnValue = { x, y };
  if (x > maxX) {
    returnValue.x = maxX;
  } else if (x < minX) {
    returnValue.x = minX;
  }
  if (y > maxY) {
    returnValue.y = maxY;
  } else if (y < -46) {
    returnValue.y = -46;
  }

  return returnValue;
}

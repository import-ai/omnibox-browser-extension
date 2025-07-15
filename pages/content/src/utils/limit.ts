export default function limit({ x, y }: { x: number; y: number }) {
  const minX = window.innerWidth * 0.3 * -1;
  const maxX = window.innerWidth - 360 + minX;
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

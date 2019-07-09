export function getAngle(point1, point2) {
  const distX = point2.x - point1.x;
  const distY = point1.y - point2.y;
  const degrees90InRad = 90 * (Math.PI / 180);
  return distY < 0 ? degrees90InRad + (degrees90InRad + Math.atan(distX / distY)) : Math.atan(distX / distY);
}
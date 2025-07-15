export default function transform(target: HTMLElement) {
  const matrix = window.getComputedStyle(target).transform.match(/^matrix\((.+)\)$/);
  return matrix
    ? {
        x: parseFloat(matrix[1].split(', ')[4]),
        y: parseFloat(matrix[1].split(', ')[5]),
      }
    : { x: 0, y: 0 };
}

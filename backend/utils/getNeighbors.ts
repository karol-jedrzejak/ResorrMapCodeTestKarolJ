export const getNeighbors = (map: string[][], i: number, j: number) => {
  const rows = map.length;
  const cols = map[0].length;

  return {
    up: i > 0 && map[i - 1][j] === '#',
    down: i < rows - 1 && map[i + 1][j] === '#',
    left: j > 0 && map[i][j - 1] === '#',
    right: j < cols - 1 && map[i][j + 1] === '#'
  };
};
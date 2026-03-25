export const getRoadInfo = (neighbors: { up: boolean; down: boolean; left: boolean; right: boolean }) => {
  const { up, down, left, right } = neighbors;
  const connected = [up, down, left, right].filter(Boolean).length;

  let shape = 'end';
  let rotation = 0;

  if (connected === 1) {
    if (up) rotation = 180;
    else if (right) rotation = 270;
    else if (down) rotation = 0;
    else if (left) rotation = 90;
  } else if (connected === 2) {
    if (up && down) {
      shape = 'straight';
    } else if (left && right) {
      shape = 'straight';
      rotation = 90;
    } else {
      shape = 'corner';
      if (up && right) rotation = 0;
      else if (right && down) rotation = 90;
      else if (down && left) rotation = 180;
      else if (left && up) rotation = 270;
    }
  } else if (connected === 3) {
    shape = 't';
    if (!down) rotation = 270;
    else if (!left) rotation = 0;
    else if (!up) rotation = 90;
    else if (!right) rotation = 180;
  } else if (connected === 4) {
    shape = 'cross';
  }

  return { shape, rotation };
};
export enum COLOR {
  BLUE,
  GREEN,
  RED,
  YELLOW
}

export const colorToHex = (color: COLOR) => {
  switch (color) {
    case COLOR.BLUE: return 'blue';
    case COLOR.GREEN: return 'green';
    case COLOR.RED: return 'red';
    case COLOR.YELLOW: return 'yellow';
  }
}

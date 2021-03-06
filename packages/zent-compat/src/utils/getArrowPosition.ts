import capitalize from 'zent/es/utils/capitalize';

import Popover, { PositionFunction } from '../popover';

const { Position } = Popover;

const { Arrow } = Position;

export default function getPosition(
  position: string | PositionFunction,
  centerArrow: boolean
): PositionFunction {
  if (typeof position === 'function') {
    return position;
  }

  let positionName = position
    .split('-')
    .map(s => capitalize(s))
    .join('');
  let pos = Position[positionName];

  // Choose a fallback in case position is invalid
  if (!pos) {
    pos = Position.TopCenter;
    positionName = 'TopCenter';
  }

  // *-center postions are not affected by centerArrow parameter
  if (!centerArrow || /^.+Center$/.test(positionName)) {
    return pos;
  }

  positionName = 'Arrow' + positionName + 'Position';

  return Arrow[positionName];
}

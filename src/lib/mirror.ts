interface MirrorOptions {
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
}

export const getMirrorTransform = ({
  mirrorHorizontal,
  mirrorVertical
}: MirrorOptions): string => {
  if (!mirrorHorizontal && !mirrorVertical) {
    return 'none';
  }

  const xScale = mirrorHorizontal ? -1 : 1;
  const yScale = mirrorVertical ? -1 : 1;

  return `scale(${xScale}, ${yScale})`;
};

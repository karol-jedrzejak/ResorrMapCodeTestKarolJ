export const getCellAsset = (cell: any): string | null => {
  const assets: Record<string, string> = {
    'W': 'cabana.png',
    'p': 'textureWater.png',
    'c': 'houseChimney.png',
  };

  if (cell.type === '#') {
    const shapeAssets: Record<string, string> = {
      straight: 'arrowStraight.png',
      corner: 'arrowCornerSquare.png',
      t: 'arrowSplit.png',
      cross: 'arrowCrossing.png',
      end: 'arrowEnd.png',
    };
    return shapeAssets[cell.shape || ''] || 'arrowEnd.png';
  }

  return assets[cell.type] || null;
};
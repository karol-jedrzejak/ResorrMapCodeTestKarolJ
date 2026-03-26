
import React from 'react';
import { getCellAsset } from '../utils/assetMapper.ts';
import { Cell } from "../models/types";

interface MapGridProps {
  map: Cell[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number, cell: Cell) => void;
}

export const MapGrid: React.FC<MapGridProps> = ({ map, selectedCell, onCellClick }) => {
  return (
    <div className="map">
      {map.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="row" style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const asset = getCellAsset(cell);

            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`cell ${cell.type === 'W' ? 'cabana' : ''}`}
                onClick={() => onCellClick(rowIndex, colIndex, cell)} // Przekazujemy row, col i CAŁY obiekt cell
              >
                {asset && (
                  <img
                    src={`/assets/${asset}`}
                    alt={cell.type}
                    className={getImgClass(cell, isSelected)}
                    style={{ 
                      transform: `rotate(${cell.rotation}deg)`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const getImgClass = (cell: Cell, isSelected: boolean): string => {
  if (cell.type !== 'W') return '';
  if (cell.occupied) return 'occupied';
  if (isSelected) return 'selected';
  return 'available';
};
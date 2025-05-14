import { ChessPiece } from "./pieces/ChessPiece.tsx";
 
import { Pawn } from "./pieces/Pawn.tsx";
import { Knight } from "./pieces/Knight.tsx";
import { Queen } from "./pieces/Queen.tsx";
import { Rook } from "./pieces/Rook.tsx";
import { Bishop } from "./pieces/Bishop.tsx";
import { King } from "./pieces/King.tsx";

export const pieceFactory = (type: string, color: "white" | "black", position: { row: number; col: number }): ChessPiece => {
  switch (type) {
    case 'pawn': return new Pawn(color, position);
    case 'rook': return new Rook(color, position);
    case 'knight': return new Knight(color, position);
    case 'bishop': return new Bishop(color, position);
    case 'queen': return new Queen(color, position);
    case 'king': return new King(color, position);
    default: throw new Error(`Unknown piece type: ${type}`);
  }
};


 
export const findKingPosition = (
  pieces: (ChessPiece | null)[][], 
  color: 'white' | 'black'
): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = pieces[row][col];
      if (piece?.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};


type Direction = [number, number];
export type Position = { row: number; col: number };

export const isWithinBoard = (row: number, col: number): boolean =>
  row >= 0 && row < 8 && col >= 0 && col < 8;


export const getOppositeColor = (color: 'white' | 'black'): 'white' | 'black' =>
  color === 'white' ? 'black' : 'white';

export const isSquareAttackedByPawn = (piece: ChessPiece, targetPos: Position) => {
  const direction = piece.color === 'white' ? -1 : 1;
  return piece.position.row + direction === targetPos.row &&
    Math.abs(piece.position.col - targetPos.col) === 1;
};


 


export const calculateLineMoves = (
  piece: ChessPiece,
  pieces: (ChessPiece)[][],
  directions: Direction[],
  maxSteps: number = 8
): Position[] => {
  const moves: Position[] = [];
  const { row, col } = piece.position;

  directions.forEach(([dr, dc]) => {
    for (let step = 1; step <= maxSteps; step++) {
      const newRow = row + dr * step;
      const newCol = col + dc * step;

      if (!isWithinBoard(newRow, newCol)) break;

      const target = pieces[newRow][newCol];
      if (!target) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (target.color !== piece.color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  });

  return moves;
};

export { ChessPiece };


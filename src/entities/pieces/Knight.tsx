 
import { isWithinBoard, ChessPiece, Position } from "../figure.tsx";
 


export class Knight extends ChessPiece {


    constructor(color: "white" | "black", position: { row: number; col: number }) {
      super("knight", color, position);
    }
  
    public getPossibleMoves(pieces: (ChessPiece)[][]): Position[] {
      const { position: { row, col }, color } = this;
      return [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [-1, 2], [1, -2], [-1, -2]
      ]
        .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
        .filter(pos =>
          isWithinBoard(pos.row, pos.col) &&
          pieces[pos.row][pos.col]?.color !== color
        );
    }
  
  }
  
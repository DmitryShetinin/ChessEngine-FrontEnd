 
import { isWithinBoard, Position } from "../figure.tsx";
import { ChessPiece, IBoard } from "../game/Types.tsx";



export class Knight extends ChessPiece {


    constructor(color: "white" | "black", position: { row: number; col: number }) {
      super("knight", color, position);
    }
  
    public getPossibleMoves(pieces: IBoard): Position[] {
      const { position: { row, col }, color } = this;
      return [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [-1, 2], [1, -2], [-1, -2]
      ]
        .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
        .filter(pos =>
          isWithinBoard(pos.row, pos.col) &&
          pieces.getPiece({row: pos.row, col: pos.col}) ?.color !== color
        );
    }
  
  }
  
import {  Position, calculateLineMoves } from "../figure.tsx";
import { ChessPiece, IBoard } from "../game/Types.tsx";

export class Bishop extends ChessPiece {


    constructor(color: "white" | "black", position: { row: number; col: number }) {
      super("bishop", color, position);
    }
  
    public getPossibleMoves(pieces:  IBoard): Position[] {
      return calculateLineMoves(this, pieces, [
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ]);
    }
  }
  
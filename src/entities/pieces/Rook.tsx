import { calculateLineMoves, Position } from "../figure.tsx";
import { ChessPiece, IBoard } from "../game/Types.tsx";

export class Rook extends ChessPiece {
  rook: { row: number; };


  constructor(color: "white" | "black", position: { row: number; col: number }) {
    super("rook", color, position);
  }

  public getPossibleMoves(pieces : IBoard): Position[] {
    return calculateLineMoves(this, pieces, [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]);
  }
}
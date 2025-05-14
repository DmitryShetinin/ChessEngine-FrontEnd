import { calculateLineMoves, ChessPiece, Position } from "../figure.tsx";


export class Queen extends ChessPiece {


  constructor(color: "white" | "black", position: { row: number; col: number }) {
    super("queen", color, position);
  }

  public getPossibleMoves(pieces: (ChessPiece)[][]): Position[] {
    return [
      ...calculateLineMoves(this, pieces, [[1, 0], [-1, 0], [0, 1], [0, -1]]),
      ...calculateLineMoves(this, pieces, [[1, 1], [1, -1], [-1, 1], [-1, -1]])
    ];
  }
}


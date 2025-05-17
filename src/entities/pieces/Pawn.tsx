import {  getOppositeColor, isWithinBoard, Position } from "../figure.tsx";
import { ChessPiece, IBoard } from "../game/Types.tsx";

 



export class Pawn extends ChessPiece {


    private get direction() {
      return this.color === 'white' ? -1 : 1;
    }
  
    private get startRow() {
      return this.color === 'white' ? 6 : 1;
    }
  
  
    constructor(color: "white" | "black", position: { row: number; col: number }) {
      super("pawn", color, position);
    }
  
    public getPossibleMoves(pieces: IBoard): Position[] {
  
  
      const moves: Position[] = [];
  
  
      this.addForwardMoves(moves, pieces);
      this.addCaptureMoves(moves, pieces);
  
      return moves;
    }
  
    private addForwardMoves(moves: Position[], pieces: IBoard) {
      const newRow = this.position.row + this.direction;
      if (!isWithinBoard(newRow, this.position.col)) return;
  
      if (!pieces.getPiece({ row: newRow, col: this.position.col })) {
        moves.push({ row: newRow, col: this.position.col });
  
        if (this.position.row === this.startRow) {
          const doubleRow = newRow + this.direction;
          if (!pieces.getPiece({ row: doubleRow, col: this.position.col })) {
            moves.push({ row: doubleRow, col: this.position.col });
          }
        }
      }
    }
  
    private addCaptureMoves(moves: Position[], pieces : IBoard) {
      const captureDirections = [[this.direction, -1], [this.direction, 1]];
  
      for (const [dr, dc] of captureDirections) {
        const newRow = this.position.row + dr;
        const newCol = this.position.col + dc;
  
        if (!isWithinBoard(newRow, newCol)) continue;
  
        const target = pieces.getPiece({ row: newRow, col: newCol});
        if (target?.color === getOppositeColor(this.color)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }
  
  
  }
  
  
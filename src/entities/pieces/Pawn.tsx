import { ChessPiece, getOppositeColor, isWithinBoard, Position } from "../figure.tsx";
 

 



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
  
    public getPossibleMoves(pieces: (ChessPiece)[][]): Position[] {
  
  
      const moves: Position[] = [];
  
  
      this.addForwardMoves(moves, pieces);
      this.addCaptureMoves(moves, pieces);
  
      return moves;
    }
  
    private addForwardMoves(moves: Position[], pieces: ChessPiece[][]) {
      const newRow = this.position.row + this.direction;
      if (!isWithinBoard(newRow, this.position.col)) return;
  
      if (!pieces[newRow][this.position.col]) {
        moves.push({ row: newRow, col: this.position.col });
  
        if (this.position.row === this.startRow) {
          const doubleRow = newRow + this.direction;
          if (!pieces[doubleRow][this.position.col]) {
            moves.push({ row: doubleRow, col: this.position.col });
          }
        }
      }
    }
  
    private addCaptureMoves(moves: Position[], pieces: ChessPiece[][]) {
      const captureDirections = [[this.direction, -1], [this.direction, 1]];
  
      for (const [dr, dc] of captureDirections) {
        const newRow = this.position.row + dr;
        const newCol = this.position.col + dc;
  
        if (!isWithinBoard(newRow, newCol)) continue;
  
        const target = pieces[newRow][newCol];
        if (target?.color === getOppositeColor(this.color)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }
  
  
  }
  
  
import { pieceSymbols } from "../../shared/index.tsx";

type Position = { row: number; col: number };
 
 

export abstract class ChessPiece {
    constructor(
      public type: string,
      public color: "white" | "black",
  
      public position: { row: number; col: number }
    ) { }
  
  
    get symbol(): string {
      return pieceSymbols[this.type][this.color];
    }
  
    public abstract getPossibleMoves(pieces: (ChessPiece | null)[][]): Position[];
  
  }
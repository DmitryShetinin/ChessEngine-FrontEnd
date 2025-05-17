import { pieceSymbols } from "../../shared/index.tsx";

export type Position = { row: number; col: number };
 
  
  export type Move = {
    from: Position;
    to: Position;
  };
 
 export type MoveResult = {
  newBoard: IBoard;
  possibleMoves: Position[] | null;
  selectedPiece: Position | null;
  requiresPromotion: Position | null;
  nextTurn: "white" | "black";
};

  export type Color = "white" | "black";
  
 
  
export abstract class ChessPiece {

  public hasMoved : boolean
  constructor(
    public type: string,
    public color: "white" | "black",

    public position: { row: number; col: number }
  ) { 

    this.hasMoved = true;
  }


  public get symbol(): string {
    return pieceSymbols[this.type][this.color];
  }

  public abstract getPossibleMoves(pieces: IBoard): Position[];

}


  export interface IBoard {
    getPiece(position: Position | null): ChessPiece | null;
    setPiece(position: Position | null, piece: ChessPiece | null): void;
    isSquareEmpty(position: Position): boolean;

    some(callback: (piece: ChessPiece | null, position: Position) => boolean): boolean;
    forEach(callback: (piece: ChessPiece | null, position: Position) => void): void;
 

  }

  
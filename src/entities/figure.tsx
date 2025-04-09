import { pieceSymbols } from "../shared/index.tsx";


export const pieceFactory = (type: string, color: "white" | "black", position: { row: number; col: number }): ChessPiece => {
  switch(type) {
    case 'pawn': return new Pawn(color, position);
    case 'rook': return new Rook(color, position);
    case 'knight': return new Knight(color, position);
    case 'bishop': return new Bishop(color, position);
    case 'queen': return new Queen(color, position);
    case 'king': return new King(color, position);
    default: throw new Error(`Unknown piece type: ${type}`);
  }
}; 


export abstract  class ChessPiece {
  constructor(
    public type: string,
    public color: "white" | "black",
  
    public position: { row: number; col: number }
  ) {}


  get symbol(): string {
    return pieceSymbols[this.type][this.color];
  }

  public abstract getPossibleMoves(pieces: (ChessPiece)[][]): Position[];

}

type Direction = [number, number];
type Position = { row: number; col: number };

const isWithinBoard = (row: number, col: number): boolean =>
  row >= 0 && row < 8 && col >= 0 && col < 8;


const getOppositeColor = (color: 'white' | 'black'): 'white' | 'black' =>
  color === 'white' ? 'black' : 'white';

const isSquareAttackedByPawn = (piece: ChessPiece, targetPos: Position) => {
  const direction = piece.color === 'white' ? -1 : 1;
  return piece.position.row + direction === targetPos.row && 
    Math.abs(piece.position.col - targetPos.col) === 1;
};


const isSquareUnderAttack = (
  targetPos: Position,
  defenderColor: 'white' | 'black',
  pieces: (ChessPiece)[][]
): boolean => {
  const attackerColor = getOppositeColor(defenderColor);

  return pieces.some((row, r) =>
    row.some((piece, c) => {
      if (!piece || piece.color !== attackerColor || piece?.type == "king")
        return false;

      // Специальная обработка пешек
      return piece.type === 'pawn' 
        ? isSquareAttackedByPawn(piece, targetPos)
        : piece.getPossibleMoves(pieces).some(m => 
            m.row === targetPos.row && m.col === targetPos.col
          );

      
    })
  );
};


const calculateLineMoves = (
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




export class King extends ChessPiece {
  private canCastle: boolean;

  constructor(
    color: "white" | "black",
    position: { row: number; col: number }
  ) {
    super("king", color, position);
    this.canCastle = true; // По умолчанию король может рокироваться
  }

  // Метод для отключения возможности рокировки
  public disableCastling(): void {
    this.canCastle = false;
  }

 

  // Проверка возможности рокировки
  public canPerformCastling(): boolean {
    return this.canCastle;
  }

  public getPossibleMoves(pieces: (ChessPiece)[][]): Position[] {
    const { position: { row, col }, color } = this;
    const moves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(pos =>
      isWithinBoard(pos.row, pos.col) &&
      pieces[pos.row][pos.col]?.color !== color
    );
  
   
    return moves.filter(move =>
      !isSquareUnderAttack({ row: move.row, col: move.col }, color, pieces)
    );
 }


}

export class Rook extends ChessPiece {
 

  constructor(color: "white" | "black", position: { row: number; col: number }) {
    super("rook", color, position);
  }

  public getPossibleMoves(pieces: (ChessPiece)[][]): Position[] {
     return calculateLineMoves(this, pieces, [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]);
  }
}

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


export class Bishop extends ChessPiece {


  constructor(color: "white" | "black", position: { row: number; col: number }) {
    super("bishop", color, position);
  }

  public getPossibleMoves(pieces: (ChessPiece)[][]): Position[] {
    return calculateLineMoves(this, pieces, [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]);
  }

 
}




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









import {  Position, getOppositeColor, isSquareAttackedByPawn, isWithinBoard, pieceFactory } from "../figure.tsx";
import { IBoard } from "../game/Types.tsx";
import { Rook } from "./Rook.tsx";
import { produce } from 'immer';
import { ChessPiece } from "../game/Types.tsx"





export class King extends ChessPiece {
  private canCastle: boolean;
  public newRookPosition: Position[] = [];

  constructor(
    color: "white" | "black",
    position: { row: number; col: number }
  ) {
    super("king", color, position);
    this.canCastle = true; // По умолчанию король может рокироваться
  }

  // Метод для отключения возможности рокировки
  public disableCastling(): Position[] {
    this.canCastle = false;

    return this.newRookPosition;
  }



  // Проверка возможности рокировки
  public canPerformCastling(): boolean {
    return this.canCastle;
  }

  public isCheck(pieces: IBoard): boolean {
    return isSquareUnderAttack(this.position, this.color, pieces);
  }

 

  
  public mayPerformCastling(pieces: IBoard): Position[] {
    if (!this.canCastle || this.isCheck(pieces)) return [];
    
    const safeCastlingPositions: Position[] = [];
    const isWhite = this.color === "white";
    const currentRow = isWhite ? 7 : 0;

    // Проверяем обе возможные рокировки
    [0, 7].forEach(rookCol => {
        const rook = pieces.getPiece({row: currentRow, col: rookCol});
        
        if (rook instanceof Rook ) {
            const direction = rookCol === 0 ? -1 : 1;
            const isPathClear = this.isCastlingPathClear(rook, currentRow, pieces);
            const isPathSafe = this.isCastlingPathSafe(direction, currentRow, pieces);

            if (isPathClear && isPathSafe) {
                safeCastlingPositions.push({
                    row: currentRow,
                    col: this.position.col + 2 * direction
                });
                
                // Сохраняем позиции для ладьи
                this.newRookPosition = [
                    { row: currentRow, col: rookCol },
                    { row: currentRow, col: this.position.col + direction }
                ];
            }
        }
    });

    return safeCastlingPositions;
}

private isCastlingPathClear(rook: Rook, currentRow: number, pieces: IBoard): boolean {
  const start = Math.min(this.position.col, rook.position.col) + 1;
  const end = Math.max(this.position.col, rook.position.col);
  
  for (let col = start; col < end; col++) {
      if (pieces.getPiece({row: currentRow, col: col}) !== null) return false;
  }
  return true;
}

private isCastlingPathSafe(direction: number, currentRow: number, pieces: IBoard): boolean {
  // Проверяем безопасность клеток для короля
  const steps = direction === 1 ? [1, 2] : [-1, -2];
  return steps.every(step => {
      const checkCol = this.position.col + step;
      return !isSquareUnderAttack(
          { row: currentRow, col: checkCol },
          this.color,
          pieces
      );
  });
}



public castling(pieces: IBoard, direction: number): IBoard {
  return produce(pieces, draft => {
      // Перемещение короля
      const newKingCol = this.position.col + 2 * direction;
      draft.setPiece({row: this.position.row, col: this.position.col}, null);
      draft.setPiece({row: this.position.row, col: newKingCol}, pieceFactory(
          'king',
          this.color,
          { row: this.position.row, col: newKingCol }
      ));   

      // Перемещение ладьи
      const rookCol = direction === 1 ? 7 : 0;
      const newRookCol = this.position.col + direction;
      draft.setPiece({row: this.position.row, col: rookCol}, null);
       draft.setPiece({row: this.position.row, col: newRookCol}, pieceFactory(
          'rook',
          this.color,
          { row: this.position.row, col: newRookCol }
      )); 
  });
}


  public getPossibleMoves(pieces: IBoard): Position[] {
    const { position: { row, col }, color } = this;

    // Основные возможные движения для короля
    const moves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]
      .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
      .filter(pos =>
        isWithinBoard(pos.row, pos.col) &&
        pieces.getPiece({row: pos.row, col: pos.col})?.color !== color
      );

    // Получаем безопасные координаты для рокировки
    const castlingMoves = this.mayPerformCastling(pieces);

    // Объединяем обычные ходы и ходы рокировки
    const allMoves = [...moves, ...castlingMoves];

    // Фильтруем ходы, чтобы убрать те, которые под атакой
    return allMoves.filter(move =>
      !isSquareUnderAttack({ row: move.row, col: move.col }, color, pieces)
    );
  }


}



const isSquareUnderAttack = (
  targetPos: Position,
  defenderColor: 'white' | 'black',
  board: IBoard
): boolean => {
  const attackerColor = getOppositeColor(defenderColor);

  return board.some((piece, position) => {
      if (!piece || piece.color !== attackerColor || piece.type === "king") 
          return false;

      // Для пешек используем специальную проверку
      if (piece.type === 'pawn') {
          return isSquareAttackedByPawn(piece, targetPos);
      }

      // Для остальных фигур проверяем возможные ходы
      return piece.getPossibleMoves(board).some(move => 
          move.row === targetPos.row && 
          move.col === targetPos.col
      );
  });
};
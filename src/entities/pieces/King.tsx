import { ChessPiece, Position, getOppositeColor, isSquareAttackedByPawn, isWithinBoard, pieceFactory } from "../figure.tsx";
import { Rook } from "./Rook.tsx";
import { produce } from 'immer';






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

  public isCheck(pieces: (ChessPiece | null)[][]): boolean {
    return isSquareUnderAttack(this.position, this.color, pieces);
  }

  public isCheckmate(pieces: (ChessPiece | null)[][]): boolean {
    if (!this.isCheck(pieces)) return false;

    // Проверяем возможные ходы короля
    const kingMoves = this.getPossibleMoves(pieces);
    if (kingMoves.length > 0) return false;

    // Проверяем возможность защиты другими фигурами
    return !this.canAnyPieceDefend(pieces);
  }

  private canAnyPieceDefend(pieces: (ChessPiece | null)[][]): boolean {
    const defenderColor = this.color;
    
    return pieces.some((row, rowIndex) => 
      row.some((piece, colIndex) => {
        if (!piece || piece.color !== defenderColor || piece === this) return false;

        // Проверяем все возможные ходы фигуры
        const moves = piece.getPossibleMoves(pieces);
        
        return moves.some(move => {
          // Создаем копию доски
          const newBoard = produce(pieces, draft => {
            draft[piece.position.row][piece.position.col] = null;
            draft[move.row][move.col] = pieceFactory(
              piece.type,
              piece.color,
              { row: move.row, col: move.col }
            );
          });

          // Проверяем остался ли шах после этого хода
          return !this.isCheck(newBoard);
        });
      })
    );
  }

  
  public mayPerformCastling(pieces: (ChessPiece | null)[][]): Position[] {
    if (!this.canCastle || this.isCheck(pieces)) return [];
    
    const safeCastlingPositions: Position[] = [];
    const isWhite = this.color === "white";
    const currentRow = isWhite ? 7 : 0;

    // Проверяем обе возможные рокировки
    [0, 7].forEach(rookCol => {
        const rook = pieces[currentRow][rookCol];
        
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

private isCastlingPathClear(rook: Rook, currentRow: number, pieces: (ChessPiece | null)[][]): boolean {
  const start = Math.min(this.position.col, rook.position.col) + 1;
  const end = Math.max(this.position.col, rook.position.col);
  
  for (let col = start; col < end; col++) {
      if (pieces[currentRow][col] !== null) return false;
  }
  return true;
}

private isCastlingPathSafe(direction: number, currentRow: number, pieces: (ChessPiece | null)[][]): boolean {
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
public castling(pieces: (ChessPiece | null)[][], direction: number): (ChessPiece | null)[][] {
  return produce(pieces, draft => {
      // Перемещение короля
      const newKingCol = this.position.col + 2 * direction;
      draft[this.position.row][this.position.col] = null;
      draft[this.position.row][newKingCol] = pieceFactory(
          'king',
          this.color,
          { row: this.position.row, col: newKingCol }
      );

      // Перемещение ладьи
      const rookCol = direction === 1 ? 7 : 0;
      const newRookCol = this.position.col + direction;
      draft[this.position.row][rookCol] = null;
      draft[this.position.row][newRookCol] = pieceFactory(
          'rook',
          this.color,
          { row: this.position.row, col: newRookCol }
      );
  });
}


  public getPossibleMoves(pieces: (ChessPiece | null)[][]): Position[] {
    const { position: { row, col }, color } = this;

    // Основные возможные движения для короля
    const moves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]
      .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
      .filter(pos =>
        isWithinBoard(pos.row, pos.col) &&
        pieces[pos.row][pos.col]?.color !== color
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
  pieces: (ChessPiece | null)[][]
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

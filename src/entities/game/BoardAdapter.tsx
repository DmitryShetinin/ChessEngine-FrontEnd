// entities/game/lib/BoardAdapter.ts

import { IBoard, Position, ChessPiece } from './Types.tsx';
import { immerable } from 'immer';
/**
 * Адаптер для работы с разными форматами данных доски.
 * Реализует интерфейс IBoard, чтобы ChessGame мог работать с любым источником.
 */
export class BoardAdapter implements IBoard {
  [immerable] = true; 
  // Приватное хранилище данных в формате ChessGame
  private boardMatrix: (ChessPiece | null)[][];
  constructor(externalData: unknown) {
    this.boardMatrix = this.normalize(externalData);
  }

  forEach(callback: (piece: ChessPiece | null, position: Position) => void): void {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = { row, col };
        callback(this.getPiece(pos), pos);
      }
    }
  }

  public getBoardMatrix() :  (ChessPiece | null)[][]{
    return this.boardMatrix
  }
  // Преобразование внешних данных в стандартный формат 8x8
  private normalize(data: unknown): (ChessPiece | null)[][] {
    // Если данные уже в формате ChessPiece[]
    if (Array.isArray(data) && data.every(item => item === null || ('type' in item && 'color' in item))) {
      const matrix = this.createEmptyBoard();
      data.forEach(piece => {
        if (piece && piece.position) {
          matrix[piece.position.row][piece.position.col] = piece;
        }
      });
      return matrix;
    }

    // Если данные в API-формате
    if (this.isAPIResponse(data)) {
      const matrix = this.createEmptyBoard();
      data.pieces.forEach(({ type, color, position }) => {
        const [row, col] = position.split(',').map(Number);
        matrix[row][col] = { type, color, position: { row, col } } as ChessPiece;
      });
      return matrix;
    }

    throw new Error('Unsupported board format');
  }


  private createEmptyBoard() {
    return Array(8).fill(null).map(() => Array(8).fill(null));
  }
  // Проверка формата данных (пример для API)
  private isAPIResponse(data: unknown): data is ApiBoardResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'pieces' in data &&
      Array.isArray((data as any).pieces)
    );
  }

  // Реализация методов IBoard
  getPiece(position: Position | null): ChessPiece | null {

    if(!position) return null; 

    return this.boardMatrix[position.row]?.[position.col] ?? null;
  }

  setPiece(position: Position, piece: ChessPiece | null): void {
  
    
    if (this.isPositionValid(position)) {
      this.boardMatrix[position.row][position.col] = piece;
    }
  }


  some(callback: (piece: ChessPiece | null, pos: Position) => boolean): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = { row, col };
        if (callback(this.getPiece(pos), pos)) return true;
      }
    }
    return false;
  }




  isSquareEmpty(position: Position): boolean {
    return this.getPiece(position) === null;
  }

  private isPositionValid(position: Position): boolean {
    return (
      position.row >= 0 && position.row < 8 &&
      position.col >= 0 && position.col < 8
    );
  }

  // Для экспорта данных обратно во внешний формат
  toExternalFormat(): ApiBoardResponse {
    const pieces: ApiPiece[] = [];

    this.boardMatrix.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece) {
          pieces.push({
            type: piece.type,
            color: piece.color,
            position: `${rowIndex},${colIndex}`
          });
        }
      });
    });

    return { pieces };
  }

 
}

// Типы для внешнего API
type ApiBoardResponse = {
  pieces: ApiPiece[];
};

type ApiPiece = {
  type: string;
  color: 'white' | 'black';
  position: string; // "row,col"
};
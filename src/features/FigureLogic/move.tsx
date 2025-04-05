import { ChessPiece } from "../../entities/figure";

type Direction = [number, number];
type Position = { row: number; col: number };

// Общие утилиты
const isWithinBoard = (row: number, col: number): boolean =>
  row >= 0 && row < 8 && col >= 0 && col < 8;

const getOppositeColor = (color: 'white' | 'black'): 'white' | 'black' =>
  color === 'white' ? 'black' : 'white';

// Базовые движения для фигур
const calculateLineMoves = (
  piece: ChessPiece,
  pieces: (ChessPiece | null)[][],
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

// Расчет ходов для каждой фигуры
export default function calculatePossibleMoves(
  piece: ChessPiece,
  pieces: (ChessPiece | null)[][]
) {
  const { type } = piece;
 
  switch (type) {
    case 'pawn':
      return calculatePawnMoves(piece, pieces);
    case 'rook':
      return calculateRookMoves(piece, pieces);
    case 'bishop':
      return calculateBishopMoves(piece, pieces);
    case 'queen':
      return calculateQueenMoves(piece, pieces);
    case 'knight':
      return calculateKnightMoves(piece, pieces);
    case 'king':
      return calculateKingMoves(piece, pieces);
    default:
      return [];


 
  }
}

// Отдельные функции для каждой фигуры
function calculatePawnMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
  const { position: { row, col }, color } = piece;
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  // Обычные ходы
  if (isWithinBoard(row + direction, col) && !pieces[row + direction][col]) {
    moves.push({ row: row + direction, col });

    // Двойной ход
    if (row === startRow && !pieces[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col });
    }
  }

  // Взятия
  [[direction, -1], [direction, 1]].forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isWithinBoard(newRow, newCol)) {
      const target = pieces[newRow][newCol];
      if (target?.color === getOppositeColor(color)) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  });

  return moves;
}

function calculateRookMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
  return calculateLineMoves(piece, pieces, [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ]);
}

function calculateBishopMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
  return calculateLineMoves(piece, pieces, [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]);
}

function calculateQueenMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
  return [
    ...calculateLineMoves(piece, pieces, [[1, 0], [-1, 0], [0, 1], [0, -1]]),
    ...calculateLineMoves(piece, pieces, [[1, 1], [1, -1], [-1, 1], [-1, -1]])
  ];
}

function calculateKnightMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
  const { position: { row, col }, color } = piece;
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

function calculateKingMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
  const { position: { row, col }, color } = piece;
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




// Проверка безопасности клетки
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
      if (piece.type === 'pawn') {
        const direction = piece.color === 'white' ? -1 : 1;
        return (
          (r + direction === targetPos.row) &&
          (Math.abs(c - targetPos.col) === 1)
        );
      }

      return calculatePossibleMoves(piece, pieces)
        .some(move =>
          move.row === targetPos.row &&
          move.col === targetPos.col
        );
    })
  );
};

// Проверка шаха и мата
export const isInCheck = (
  color: 'white' | 'black',
  pieces: (ChessPiece | null)[][]
): boolean => {
  const kingPos = pieces.flat().find(p =>
    p?.type === 'king' && p.color === color
  )?.position;

  return !!kingPos && isSquareUnderAttack(kingPos, color, pieces);
};

export const isCheckmate = (
  color: 'white' | 'black',
  pieces: (ChessPiece | null)[][]
): boolean => {
  if (!isInCheck(color, pieces)) return false;

  return pieces.flat().every(piece =>
    !piece ||
    piece.color !== color ||
    calculatePossibleMoves(piece, pieces).length === 0
  );
};
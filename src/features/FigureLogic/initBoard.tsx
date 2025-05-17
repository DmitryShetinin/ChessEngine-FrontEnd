// features/FigureLogic/initBoard.tsx

import { pieceFactory } from "../../entities/figure.tsx";
import { BoardAdapter } from "../../entities/game/BoardAdapter.tsx";
import { ChessGame } from "../../entities/game/ChessGame.tsx";
import { ChessPiece, IBoard } from "../../entities/game/Types.tsx";

// 1. Функция для создания начальных данных доски
export const createInitialBoardData = (): ChessPiece[] => {
  const PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  
  return Array(8).fill(null).flatMap((_, row) =>
    Array(8).fill(null).map((_, col) => {
      if(row === 1) return pieceFactory('pawn', "black", { row, col });
      if(row === 6) return  pieceFactory('pawn', "white", { row, col });
      if(row === 0) return pieceFactory(PIECE_ORDER[col], "black", { row, col });
      if(row === 7) return pieceFactory(PIECE_ORDER[col], "white", { row, col });
      return null;
    })
  ).filter(Boolean) as ChessPiece[];
};

// 2. Отдельная функция для создания игры
export const createNewGame = () => {
  const initialData = createInitialBoardData();
  const boardAdapter = new BoardAdapter(initialData);
  return new ChessGame(boardAdapter);
};

 
// GameLogic.ts

import { pieceFactory } from "../../entities/figure.tsx";
import { IBoard, MoveResult, Position } from "../../entities/game/Types.tsx";
import calculatePossibleMoves from "../FigureLogic/move.tsx";
import { produce } from 'immer';

// Типы для разделения ответственности
type SelectionResult = {
  newBoard: IBoard;
  possibleMoves: Position[];
  selectedPiece: Position | null;
};

type MoveExecutionResult = {
  newBoard: IBoard;
  requiresPromotion: Position | null;
  nextTurn: "white" | "black";
};

// 1. Функция для выбора фигуры и показа ходов
export const handlePieceSelection = (
  board: IBoard,
  position: Position,
  moveTurn: "white" | "black"
): SelectionResult => {
  const piece = board.getPiece(position);
  
  if (!piece || piece.color !== moveTurn) {
    return {
      newBoard: board,
      possibleMoves: [],
      selectedPiece: null
    };
  }

  return {
    newBoard: board,
    possibleMoves: calculatePossibleMoves(piece, board),
    selectedPiece: position
  };
};

// 2. Функция для выполнения хода
export const handleMoveExecution = (
  board: IBoard,
  from: Position,
  to: Position,
  moveTurn: "white" | "black"
): MoveExecutionResult => {
  const piece = board.getPiece(from);
  if (!piece) return { newBoard: board, requiresPromotion: null, nextTurn: moveTurn };

  // Проверка валидности хода
  const validMoves = calculatePossibleMoves(piece, board);
  const isValid = validMoves.some(m => m.row === to.row && m.col === to.col);
  if (!isValid) return { newBoard: board, requiresPromotion: null, nextTurn: moveTurn };
  console.log(piece)
  // Выполнение перемещения
  const newBoard = produce(board, draft => {
    draft.setPiece(from, null);
    draft.setPiece(to,  pieceFactory(piece.type, piece.color, to ));
  });

  // Проверка на превращение пешки
  const requiresPromotion = piece.type === 'pawn' && (to.row === 0 || to.row === 7) 
    ? to 
    : null;

  return {
    newBoard,
    requiresPromotion,
    nextTurn: moveTurn === "white" ? "black" : "white"
  };
};

// 3. Объединяющая функция для использования в компоненте
export const handleCellClickLogic = (
  board: IBoard,
  selectedPosition: Position | null,
  moveTurn: "white" | "black",
  clickPos: Position
): MoveResult => {
  if (!selectedPosition) {
    const selection = handlePieceSelection(board, clickPos, moveTurn);
    return {
      ...selection,
      requiresPromotion: null,
      nextTurn: moveTurn
    };
  }

  const moveResult = handleMoveExecution(board, selectedPosition, clickPos, moveTurn);
  return {
    ...moveResult,
    possibleMoves: null,
    selectedPiece: null
  };
};
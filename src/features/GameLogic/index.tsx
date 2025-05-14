import { ChessPiece, findKingPosition, pieceFactory } from "../../entities/figure.tsx";
import calculatePossibleMoves from "../FigureLogic/move.tsx";
import { King } from "../../entities/pieces/King.tsx";
import { produce } from 'immer';


export type GameState = {
  pieces: (ChessPiece  | null)[][];
  selectedPiece: ChessPiece | null;
  possibleMoves: Array<{ row: number; col: number }>;
  moveTurn: "white" | "black";
  hasPromotion: boolean;
  promotionPosition: { row: number; col: number };

  
};


export const HandleCellClick = (
  row: number,
  col: number,
  state: GameState,

  updateState: (newState: Partial<GameState>) => void
) => {

  const { pieces, selectedPiece, moveTurn, hasPromotion } = state;
 
  if (hasPromotion) return;


  const clickedPiece = pieces[row][col];
  const movesSet = new Set(state.possibleMoves.map(m => `${m.row}-${m.col}`));

 
  if (clickedPiece?.color === moveTurn) {
    return updateState({
      pieces: pieces, // Сохраняем текущее состояние доски
      selectedPiece: clickedPiece,
      possibleMoves: calculatePossibleMoves(clickedPiece, pieces),
      hasPromotion: false
    });
  }



  if (!movesSet.has(`${row}-${col}`)) return;

  if (selectedPiece instanceof King) {

  
  // Получаем разрешенные позиции для рокировки
  const castlingMoves = selectedPiece.mayPerformCastling(pieces);
  
  // Проверяем что кликнули именно на позицию рокировки
  const isCastlingMove = castlingMoves.some(m => m.row === row && m.col === col);
  
  if (isCastlingMove) {
      // Определяем направление рокировки
      const direction = col > selectedPiece.position.col ? 1 : -1;
      
      // Выполняем рокировку
      const newPieces = selectedPiece.castling(pieces, direction);

    return updateState({
          pieces: newPieces,
          moveTurn: moveTurn === "white" ? "black" : "white",
          selectedPiece: null,
          possibleMoves: []
      });
  }
 
  }
  updateState({
    pieces: produce(pieces, draft => {
      draft[selectedPiece!.position.row][selectedPiece!.position.col] = null;
      draft[row][col] = pieceFactory(selectedPiece!.type,  selectedPiece!.color, { row, col });
    }),
    


    moveTurn: moveTurn === "white" ? "black" : "white",


    selectedPiece: selectedPiece,  
    possibleMoves: []

  });

  if (selectedPiece?.type === 'pawn' && (row === 0 || row === 7)) {
    return updateState({
      hasPromotion: true,
      promotionPosition: { row, col },
      moveTurn: moveTurn === "white" ? "white" : "black"
    });
  }






};
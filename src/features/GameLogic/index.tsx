import { ChessPiece, pieceFactory } from "../../entities/figure.tsx";
import calculatePossibleMoves from "../FigureLogic/move.tsx";
import { produce } from 'immer';


export type GameState = {
  pieces: (ChessPiece)[][];
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

  const clickedPiece = pieces[row][col];
  const movesSet = new Set(state.possibleMoves.map(m => `${m.row}-${m.col}`));

  if (hasPromotion) return;
  if(!pieces) return; 
  if (clickedPiece?.color === moveTurn) {
    return updateState({
      pieces: pieces, // Сохраняем текущее состояние доски
      selectedPiece: clickedPiece,
      possibleMoves: calculatePossibleMoves(clickedPiece, pieces),
      hasPromotion: false
    });
  }



  if (!movesSet.has(`${row}-${col}`)) return;


 
   
  updateState({
    pieces: produce(pieces, draft => {
      draft[selectedPiece!.position.row][selectedPiece!.position.col] = null;
      draft[row][col] = pieceFactory(selectedPiece!.type,  selectedPiece!.color, { row, col });
    }),



    moveTurn: moveTurn === "white" ? "black" : "white",


    selectedPiece: selectedPiece, // Исправлено: сбрасываем выбор после хода
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
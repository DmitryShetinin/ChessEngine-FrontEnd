import { ChessPiece } from "../../entities/figure.tsx";
import calculatePossibleMoves from "../FigureLogic/move.tsx";
import { produce } from 'immer';


export type GameState = {
    pieces: (ChessPiece | null)[][];
    selectedPiece: ChessPiece | null;
    possibleMoves: Array<{ row: number; col: number }>;
    moveTurn: "white" | "black";
    hasPromotion: boolean;  
  };


  export const HandleCellClick = (
    row: number,
    col: number,
    state: GameState,
 
    updateState: (newState: Partial<GameState>) => void
  ) => {
    const { pieces, selectedPiece, moveTurn , hasPromotion } = state;
   
    const clickedPiece = pieces[row][col];
    const movesSet = new Set(state.possibleMoves.map(m => `${m.row}-${m.col}`));
    
    if(hasPromotion) return;
      
 
    if (selectedPiece) {
      if (movesSet.has(`${row}-${col}`)) {
        const isPawnPromotion = selectedPiece.type === "pawn" && row === 0 || row === 7;
        
        updateState({
          pieces: produce(pieces, draft => {
            draft[selectedPiece.position.row][selectedPiece.position.col] = null;
            draft[row][col] = new ChessPiece(
              selectedPiece.type,
              selectedPiece.color,
              { row, col }
            );
          }),


          hasPromotion: isPawnPromotion,
   

          moveTurn: moveTurn === "white" && !isPawnPromotion ? "black" : "white",
          selectedPiece: null, // Исправлено: сбрасываем выбор после хода
          possibleMoves: []
        });
      }
      else {
        updateState({
          selectedPiece: null,
          possibleMoves: [],
          hasPromotion: false
        });
      }
    }
    else if (clickedPiece?.color === moveTurn) {
      updateState({
        selectedPiece: clickedPiece,
        possibleMoves: calculatePossibleMoves(clickedPiece, pieces),
        hasPromotion: false
      });
    }
  };
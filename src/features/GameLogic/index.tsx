import { ChessPiece, King, pieceFactory } from "../../entities/figure.tsx";
import calculatePossibleMoves from "../FigureLogic/move.tsx";
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
    const pos = selectedPiece.disableCastling();
  
    updateState({
      pieces: produce(pieces, draft => {
        // Удаляем ладью в исходной позиции и перемещаем её
        draft[pos[0].row][pos[0].col] = null;
        draft[pos[1].row][pos[1].col] = pieceFactory('rook', selectedPiece.color, { row: pos[1].row, col: pos[1].col });
  
        // Удаляем короля из текущей позиции и перемещаем в новую
        draft[selectedPiece.position.row][selectedPiece.position.col] = null;
        draft[row][col] = pieceFactory(selectedPiece.type, selectedPiece.color, { row, col });

        
      }),

      moveTurn: moveTurn === "white" ? "black" : "white",


      selectedPiece: selectedPiece,  
      possibleMoves: []
    });
  
    return;
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
import { ChessPiece, Pawn, pieceFactory } from "../../entities/figure.tsx";


 
  

 


const PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
const BOARD_SIZE = 8;

export const createInitialBoard = (): (ChessPiece | null)[][] => {

   
  
    return Array(BOARD_SIZE).fill(null).map((_, row) => 
      Array(BOARD_SIZE).fill(null).map((_, col) => {
        // Пешки
        if(row === 1 || row === 6) {
          const color = row === 1 ? "black" : "white";
          return new Pawn(color, { row, col });
        }
    
        // Остальные фигуры
        if(row === 0 || row === 7) {
          const color = row === 0 ? "black" : "white";
          const type = PIECE_ORDER[col];
       
          return pieceFactory(type, color, { row, col });
        }
  
        return null;
      })
    );
  };
import { ChessPiece } from "../../entities/figure";
import { IBoard } from "../../entities/game/Types";



 
export default function calculatePossibleMoves(
  piece: ChessPiece,
  pieces: IBoard
) {
   
  return piece.getPossibleMoves(pieces);
}
 
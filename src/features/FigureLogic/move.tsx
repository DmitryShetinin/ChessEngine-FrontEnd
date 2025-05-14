import { ChessPiece } from "../../entities/figure";



 
export default function calculatePossibleMoves(
  piece: ChessPiece,
  pieces: (ChessPiece  | null)[][]
) {
   
 
  return piece.getPossibleMoves(pieces);
}
 
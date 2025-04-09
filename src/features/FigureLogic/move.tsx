import { ChessPiece } from "../../entities/figure";

type Direction = [number, number];
type Position = { row: number; col: number };

 
 
export default function calculatePossibleMoves(
  piece: ChessPiece,
  pieces: (ChessPiece )[][]
) {
  if(pieces == null) return; 
  
  return piece.getPossibleMoves(pieces);
}
 
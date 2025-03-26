import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { ChessPiece } from "../../entities/figure.tsx"
import calculatePossibleMoves from "../../features/move.tsx";
import './index.css';

const Gridcell = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.color};
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  cursor: pointer;
  position: relative;
`;

const MoveIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 200, 0, 0.3);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const createInitialPieces = (): (ChessPiece | null)[][] => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

  pieceOrder.forEach((type, col) => {
    board[0][col] = new ChessPiece(type, "white", { row: 0, col });
    board[1][col] = new ChessPiece("pawn", "white", { row: 1, col });
    board[7][col] = new ChessPiece(type, "black", { row: 7, col });
    board[6][col] = new ChessPiece("pawn", "black", { row: 6, col });
  });

  return board;
};



const Gridwrapper = () => {
  const [pieces, setPieces] = useState<(ChessPiece | null)[][]>(createInitialPieces());
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<{ row: number; col: number }[]>([]);

  const getPieceSymbol = useCallback((piece: ChessPiece) => {
    const symbols = {
      king: { white: "♔", black: "♚" },
      queen: { white: "♕", black: "♛" },
      rook: { white: "♖", black: "♜" },
      bishop: { white: "♗", black: "♝" },
      knight: { white: "♘", black: "♞" },
      pawn: { white: "♙", black: "♟" },
    };
    return symbols[piece.type][piece.color];
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    const clickedPiece = pieces[row][col];
    
    if (selectedPiece) {
      // Move piece if valid move
      if (possibleMoves.some(m => m.row === row && m.col === col)) {
        const newPieces = pieces.map(row => [...row]);
        newPieces[selectedPiece.position.row][selectedPiece.position.col] = null;
        newPieces[row][col] = new ChessPiece(
          selectedPiece.type,
          selectedPiece.color,
          { row, col }
        );
        setPieces(newPieces);
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else if (clickedPiece) {
      setSelectedPiece(clickedPiece);
      setPossibleMoves(calculatePossibleMoves(clickedPiece, pieces));
    }
  }, [selectedPiece, possibleMoves, pieces]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {pieces.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((_, colIndex) => (
            <Gridcell
          
              key={`${rowIndex}-${colIndex}`}
              color={(rowIndex + colIndex) % 2 === 0 ? "#f0d9b5" : "#b58863"}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {pieces[rowIndex][colIndex] && (
                <div class="zxc" style={{ 
                  color: pieces[rowIndex][colIndex]?.color === "white" ? "#fff" : "#000"
       
                }}>
                  {getPieceSymbol(pieces[rowIndex][colIndex]!)}
                </div>
              )}
              {possibleMoves.some(m => m.row === rowIndex && m.col === colIndex) && (
                <MoveIndicator />
              )}
            </Gridcell>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gridwrapper;

 
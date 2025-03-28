import React, { useState, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import { ChessPiece } from "../../entities/figure.tsx";
import  {GameState  , HandleCellClick }  from "../../features/GameLogic/index.tsx"

import Paneltools from "../Paneltools/index.tsx";
import './index.css';
 

 
 

const BOARD_SIZE = 8;
const LIGHT_COLOR = "#eeeed2";
const DARK_COLOR = "#769656";
const PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

// Стилизованные компоненты
const GridCell = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background-color: ${({ color }) => color};
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    z-index: 2;
  }
`;

const MoveIndicator = styled.div<{ isCapture: boolean }>`
  width: ${({ isCapture }) => (isCapture ? '40px' : '20px')};
  height: ${({ isCapture }) => (isCapture ? '40px' : '20px')};
  border-radius: 50%;
  background-color: ${({ isCapture }) => (isCapture ? '#F08080' : 'rgba(2, 84, 247, 0.7)')};
  opacity: 0.9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// Вспомогательные функции
const createInitialBoard = (): (ChessPiece | null)[][] => {
  return Array(BOARD_SIZE).fill(null).map((_, row) => 
    Array(BOARD_SIZE).fill(null).map((_, col) => {
      if (row === 1) return new ChessPiece("pawn", "black", { row, col });
      if (row === 6) return new ChessPiece("pawn", "white", { row, col });
      if (row === 0 || row === 7) {
        const color = row === 0 ? "black" : "white";
        return new ChessPiece(PIECE_ORDER[col], color, { row, col });
      }
      return null;
    })
  );
};

const Gridwrapper = () => {
  // Состояния
  const [state, setState] = useState<GameState>({
    pieces: createInitialBoard(),
    selectedPiece: null,
    possibleMoves: [],
    moveTurn: "white",
    hasPromotion: false // Добавляем в тип GameState
  });

  // Обновляем деструктуризацию
  const { pieces, possibleMoves, moveTurn, hasPromotion } = state;


  const movesSet = useMemo(() => 
    new Set(possibleMoves.map(m => `${m.row}-${m.col}`)), 
  [possibleMoves]);


  // Мемоизированные значения
  const pieceSymbols = useMemo(() => ({
    king: { white: "♔", black: "♚" },
    queen: { white: "♕", black: "♛" },
    rook: { white: "♖", black: "♜" },
    bishop: { white: "♗", black: "♝" },
    knight: { white: "♘", black: "♞" },
    pawn: { white: "♙", black: "♟" },
  }), []);

 

  const updateState = (newState: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Обработчики
  const handleCellClick = useCallback((row: number, col: number) => {
    HandleCellClick(row, col, state, updateState);
    
  }, [state, updateState]);
 

 




  // Рендеринг
  const renderCell = (rowIndex: number, colIndex: number) => {
    const piece = pieces[rowIndex][colIndex];
    const hasMove = movesSet.has(`${rowIndex}-${colIndex}`);
    const isCapture = hasMove && !!piece;

    return (
      <GridCell
        key={`${rowIndex}-${colIndex}`}
        color={(rowIndex + colIndex) % 2 === 0 ? LIGHT_COLOR : DARK_COLOR}
        onClick={() => handleCellClick(rowIndex, colIndex)}
      >
        {piece && (
          <div className="piece" style={{ transition: "all 0.2s ease" }}>
            {pieceSymbols[piece.type][piece.color]}
          </div>
        )}
        {hasMove && <MoveIndicator isCapture={isCapture} />}
      </GridCell>
    );
  };

  return (
    <div className="chess-board">
      <div style={{ position: 'relative', zIndex: 1 }}>
        {pieces.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      <Paneltools moveTurn={moveTurn} swapPawn={state.hasPromotion} />
    </div>
  );
};

export default Gridwrapper;
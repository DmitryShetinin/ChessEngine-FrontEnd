import React, { useState, useCallback, useMemo } from "react";
 
 
import  {GameState  , HandleCellClick }  from "../../features/GameLogic/index.tsx"

import Paneltools from "../Paneltools/index.tsx";
import './index.css';
 
import { pieceSymbols } from "../../shared/index.tsx";
import { pieceFactory } from "../../entities/figure.tsx";
import { createInitialBoard } from "../../features/FigureLogic/initBoard.tsx";
 

 
 


const LIGHT_COLOR = "#eeeed2";
const DARK_COLOR = "#769656";






const Gridwrapper = () => {
  // Состояния
  const [state, setState] = useState<GameState>({
    pieces: createInitialBoard(),
    selectedPiece: null,
    possibleMoves: [],
    moveTurn: "white",
    hasPromotion: false, // Добавляем в тип GameState
    promotionPosition: null,
    isCastlingPossibleWhite: true,
    isCastlingPossibleBlack: true
  });

  // Обновляем деструктуризацию
  const { pieces, possibleMoves, moveTurn, hasPromotion  } = state;


  const movesSet = useMemo(() => 
    new Set(possibleMoves.map(m => `${m.row}-${m.col}`)), 
  [possibleMoves]);

 
 

  

  const updateState = (newState: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Обработчики
  const handleCellClick = useCallback((row: number, col: number) => {
 
    HandleCellClick(row, col, state, updateState);
    
  }, [state, updateState]);
  

  const handleChooseLableClick = useCallback((pieceType: string) => {
 
    setState(prev => {
      const newPieces = prev.pieces.map(row => [...row]);
      const { row, col } = prev.promotionPosition!;
      
      newPieces[row] = [...newPieces[row]];
      newPieces[row][col] = pieceFactory(pieceType.toLowerCase(),   prev.moveTurn ,   { row, col })
      
      
 
      return {
        ...prev,
        pieces: newPieces,
        hasPromotion: false,
        promotionPosition: null, 
        moveTurn: prev.moveTurn === "white" ? "black" : "white"
      };
    });
  }, []);

  
 

 
  

  // Рендеринг
  const renderCell = (rowIndex: number, colIndex: number) => {
    const piece = pieces[rowIndex][colIndex];
   
 
    const hasMove = movesSet.has(`${rowIndex}-${colIndex}`);
    const isCapture = hasMove && !!piece;

    return (
      <div 
        className="grid-cell"
        key={`${rowIndex}-${colIndex}`}
        style={{ backgroundColor: (rowIndex + colIndex) % 2 === 0 ? LIGHT_COLOR : DARK_COLOR} }
    
        onClick={() => handleCellClick(rowIndex, colIndex)}
      >
        {piece && (
          <div className="piece" style={{ transition: "all 0.2s ease" }}>
          {
            piece.symbol
          }
          </div>
        )}
        {hasMove &&  <div className={`move-indicator ${isCapture ? 'capture' : ''}`} />}
      </div>
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
      <Paneltools moveTurn={moveTurn}  />
      <>
      {hasPromotion && (
        <div className="promotion-overlay">
          <div className="promotion-modal">
            {['queen', 'rook', 'bishop', 'knight'].map((piece) => (
              <div 
                key={piece}
                className="promotion-option"
                onClick={() => handleChooseLableClick(piece)}
              >
                {pieceSymbols[piece][moveTurn]}
              </div>
            ))}
          </div>
        </div>
      )}
      </>
    </div>
  );
};

export default Gridwrapper;
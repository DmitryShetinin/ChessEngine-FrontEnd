import React, { useState, useCallback, useMemo } from "react";
import Paneltools from "../Paneltools/index.tsx";
import './index.css';
import { pieceSymbols } from "../../shared/index.tsx";
import { pieceFactory } from "../../entities/figure.tsx";
import { createNewGame } from "../../features/FigureLogic/initBoard.tsx";
import { produce } from 'immer';
import { ChessPiece, IBoard, Position } from "../../entities/game/Types.tsx";
import { handleCellClickLogic } from "../../features/GameLogic/index.tsx";

const LIGHT_COLOR = "#eeeed2";
const DARK_COLOR = "#769656";

export const extractPiecesForUI = (board: IBoard): (ChessPiece | null)[][] => {
  const matrix = Array(8).fill(null).map(() => Array(8).fill(null));
  board.forEach((piece, pos) => {
    matrix[pos.row][pos.col] = piece;
  });
  return matrix;
};

const Gridwrapper = () => {
  const [game] = useState(() => createNewGame());
  
  // Исправлено: добавлены все необходимые поля в состояние
  const [uiState, setUiState] = useState(() => ({
    board: game.getBoard(),
    selectedPosition: null as Position | null,
    possibleMoves: [] as Position[],
    moveTurn: "white" as "white" | "black",
    hasPromotion: false,
    promotionPosition: null as Position | null
  }));

  // Получаем матрицу для отображения
  const piecesMatrix = useMemo(
    () => extractPiecesForUI(uiState.board), 
    [uiState.board]
  );
 
  const movesSet = useMemo(
    () => new Set((uiState.possibleMoves || []).map(m => `${m.row}-${m.col}`)),
    [uiState.possibleMoves]
  );

  // Обработчик клика по ячейке
  const handleCellClick = useCallback((row: number, col: number) => {
 
    const result = handleCellClickLogic(
    uiState.board,
    uiState.selectedPosition,
    uiState.moveTurn,
    { row, col }
  );

  setUiState(prev => ({
    ...prev,
    board: result.newBoard,
    selectedPosition: result.selectedPiece ?? null,
    possibleMoves: result.possibleMoves ?? [],
    moveTurn: result.nextTurn,
    hasPromotion: result.requiresPromotion !== null,
    promotionPosition: result.requiresPromotion
  }));
  }, [uiState.board, uiState.selectedPosition, uiState.moveTurn]);

  // Обработчик выбора фигуры для превращения
const handleChoosePromotion = useCallback((pieceType: string) => {
  setUiState(prev => {
    if (!prev.promotionPosition) return prev;

    return produce(prev, draft => {
      // Устанавливаем новую фигуру на доске
      draft.board.setPiece(
        prev.promotionPosition!,
        pieceFactory(
          pieceType.toLowerCase() as 'queen' | 'rook' | 'bishop' | 'knight',
          prev.moveTurn === "white" ? "black" : "white",
          prev.promotionPosition!
        )
      );

      // Обновляем состояние
      draft.hasPromotion = false;
      draft.promotionPosition = null;
      draft.selectedPosition = null;
    });
  });
}, []);


 
  // Рендер ячейки
  const renderCell = (rowIndex: number, colIndex: number) => {
    const piece = piecesMatrix[rowIndex][colIndex];
    const hasMove = movesSet.has(`${rowIndex}-${colIndex}`);
    const isCapture = hasMove && !!piece;

    return (
      <div 
        className="grid-cell"
        key={`${rowIndex}-${colIndex}`}
        style={{ 
          backgroundColor: (rowIndex + colIndex) % 2 === 0 ? LIGHT_COLOR : DARK_COLOR
        }}
        onClick={() => handleCellClick(rowIndex, colIndex)}
      >
        {piece && (
          <div className="piece" style={{ transition: "all 0.2s ease" }}>
            {piece.symbol}
          </div>
        )}
        {hasMove && <div className={`move-indicator ${isCapture ? 'capture' : ''}`} />}
      </div>
    );
  };

  return (
    <div className="chess-board">
      <div style={{ position: 'relative', zIndex: 1 }}>
        {piecesMatrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      
      <Paneltools moveTurn={uiState.moveTurn} />
      
      {uiState.hasPromotion && (
        <div className="promotion-overlay">
          <div className="promotion-modal">
            {['queen', 'rook', 'bishop', 'knight'].map((piece) => (
              <div 
                key={piece}
                className="promotion-option"
                onClick={() => handleChoosePromotion(piece)}
              >
                {pieceSymbols[piece][uiState.moveTurn === "white" ? "black" : "white"]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gridwrapper;
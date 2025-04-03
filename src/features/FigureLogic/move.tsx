import { ChessPiece } from "../../entities/figure";
import React from "react";



function validation(){

}



export default function calculatePossibleMoves(piece: ChessPiece, pieces: (ChessPiece | null)[][]) {
    
    
    let moves: { row: number; col: number }[] = [];
  
    switch (piece.type) {
      case 'pawn': 
        moves = calculatePawnMoves(piece, pieces);
        break;
      case 'rook':
        moves = calculateRookMoves(piece, pieces);
        break;
      case 'bishop':
        moves = calculateBishopMoves(piece, pieces);
        break;
      case 'queen':
        moves = calculateBishopMoves(piece, pieces);
        moves = [
            ...moves,
            ...calculateRookMoves(piece, pieces)  
        ];
        break;
        case 'king':
            moves = calculateKingMoves(piece, pieces) 
            break;
        case 'knight':
            moves = calculateKnightMoves(piece, pieces) 
            break;
    }
  
    return moves;


    
}



const calculatePawnMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number}[] = [];
    const { row, col } = piece.position;
    const direction = piece.color === 'white' ? -1 : 1;


   

    // Проверка базового хода
    if (row + direction >= 0 && row + direction < 8) {
        if (!pieces[row + direction][col]) {
            moves.push({ row: row + direction, col });

            // Двойной ход из начальной позиции
            if ((piece.color === 'white' && row === 6) || 
                (piece.color === 'black' && row === 1)) {
                if (row + 2 * direction >= 0 && 
                    row + 2 * direction < 8 && 
                    !pieces[row + 2 * direction][col]) {
                    moves.push({ row: row + 2 * direction, col });
                }
            }
        }
    }

    // Обработка взятий
    [-1, 1].forEach((dc) => {
        const targetRow = row + direction;
        const targetCol = col + dc;
        
        // Добавляем проверку границ массива
        if (targetRow >= 0 && targetRow < 8 && 
            targetCol >= 0 && targetCol < 8) {
            
            const targetPiece = pieces[targetRow][targetCol];
            if (targetPiece?.color !== piece.color) {
                if(pieces[targetRow][targetCol] != null)
                    moves.push({ row: targetRow, col: targetCol});
            }
        }
    });
   
  


    return moves;
};

const calculateRookMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            if (!pieces[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (pieces[newRow][newCol]?.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
        }
    });

    return moves;
};


const calculateBishopMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            if (!pieces[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (pieces[newRow][newCol]?.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
        }
    });

    return moves;
};



 
const isSquareUnderAttack = (
    row: number,
    col: number,
    color: 'white' | 'black',
    pieces: (ChessPiece | null)[][]
): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = pieces[r][c];
            if (!piece || piece.color === color || piece.type === "king") continue;

            let moves: { row: number; col: number }[] = [];
            
            // Специальная обработка для пешек
            if (piece.type === "pawn") {
                const direction = piece.color === 'white' ? -1 : 1;
                const attackMoves = [
                    { row: r + direction, col: c - 1 },
                    { row: r + direction, col: c + 1 }
                ];
                
                // Фильтруем ходы за пределы доски
                moves = attackMoves.filter(m => 
                    m.row >= 0 && m.row < 8 && 
                    m.col >= 0 && m.col < 8
                );
            } else {
                moves = calculatePossibleMoves(piece, pieces);
            }

            if (moves.some(m => m.row === row && m.col === col)) {
                return true;
            }
        }
    }
    return false;
};

const calculateKingMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const color = piece.color;
    
    // Основные направления движения
    const directions = [
        [1, 1], [1, -1], [-1, 1], [-1, -1],
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    // Проверка обычных ходов
    directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return;
        
        const targetPiece = pieces[newRow][newCol];
        if (targetPiece?.color === color) return;
        
        if (!isSquareUnderAttack(newRow, newCol, color, pieces)) {
            moves.push({ row: newRow, col: newCol });
        }
    });

    
    // Фильтруем ходы, оставляя только безопасные
    return moves.filter(move => {
        // Создаем копию доски для проверки шаха
        const tempPieces = pieces.map(r => [...r]);
        tempPieces[row][col] = null;
        tempPieces[move.row][move.col] = piece;
        
        return !isInCheck(color, tempPieces);
    });
};

// Проверка на шах
const isInCheck = (color: 'white' | 'black', pieces: (ChessPiece | null)[][]) => {
    let kingPos: { row: number, col: number } | null = null;
    
    // Находим позицию короля
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = pieces[r][c];
            if (p?.type === 'king' && p.color === color) {
                kingPos = { row: r, col: c };
                break;
            }
        }
        if (kingPos) break;
    }
    
    return kingPos && isSquareUnderAttack(kingPos.row, kingPos.col, color, pieces);
};

// Проверка на мат
const isCheckmate = (color: 'white' | 'black', pieces: (ChessPiece | null)[][]) => {
    if (!isInCheck(color, pieces)) return false;

    // Проверяем все возможные ходы
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = pieces[r][c];
            if (piece?.color === color) {
                const moves = calculatePossibleMoves(piece, pieces);
                if (moves.length > 0) return false;
            }
        }
    }
    
    return true;
};



const calculateKnightMoves = (piece: ChessPiece, pieces: (ChessPiece | null)[][]) => {
    const moves: { row: number; col: number }[] = [];
    const { row, col } = piece.position;
    const directions = [
        [2, 1], [2, -1],[-2, 1], [-2, -1],
        [-1, 2],  [1, 2], [1, -2],  [-1, -2] 
    ];
   
 
    directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return;

      

        if (!pieces[newRow][newCol]) {
            moves.push({ row: newRow, col: newCol });
        } else {
            if (pieces[newRow][newCol]?.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
 
   
    return moves;
};

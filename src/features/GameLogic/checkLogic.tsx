import { ChessPiece } from "../../entities/figure.tsx";
 
import { IBoard, Position } from "../../entities/game/Types.tsx";
import calculatePossibleMoves from "../FigureLogic/move.tsx";

type CheckChecker = (pieces: IBoard, kingPos: Position, piece: ChessPiece) => boolean;

// Вспомогательные функции проверки атак
 
 
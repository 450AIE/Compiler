import { setAssignExpression, setArrayExpression, setObjectExpression, setFunctionCallStatement } from "./Expression";
import {
  setDeclareStatement,
  setForStatement,
  setFunctionDeclareStatement,
  setIfStatement,
  setReturnStatement,
  setWhileStatement,
} from "./Statement";
import { setImportDeclaration, setExportDeclaration } from "./ImportOrExportDeclaration";
import AssignExpression from "./Expression/AssignExpression";
import ArrayExpression from "./Expression/ArrayExpression";
import ObjectExpression from "./Expression/ObjectExpression";
import FunctionCallStatement from "./Statement/FunctionStatement/FunctionCall";
import DeclareStatement from "./Statement/DeclareStatement";
import ForStatement from "./Statement/ForStatement";
import FunctionDeclareStatement from "./Statement/FunctionStatement";
import IfStatement from "./Statement/IfStatement";
import ReturnStatement from "./Statement/ReturnStatement";
import WhileStatement from "./Statement/WhileStatement";
import ImportDeclaration from "./ImportOrExportDeclaration/ImportDeclaration";
import ExportDeclaration from "./ImportOrExportDeclaration/ExportDeclaration";

setAssignExpression(AssignExpression);
setArrayExpression(ArrayExpression);
setObjectExpression(ObjectExpression);
setFunctionCallStatement(FunctionCallStatement);
setDeclareStatement(DeclareStatement);
setForStatement(ForStatement);
setFunctionDeclareStatement(FunctionDeclareStatement);
setIfStatement(IfStatement);
setReturnStatement(ReturnStatement);
setWhileStatement(WhileStatement);
setImportDeclaration(ImportDeclaration);
setExportDeclaration(ExportDeclaration);

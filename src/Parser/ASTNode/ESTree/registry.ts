import {
  setAssignExpression,
  setArrayExpression,
  setObjectExpression,
  setFunctionCallStatement,
} from "./Expressions/Expression";
import {
  setDeclareStatement,
  setForStatement,
  setFunctionDeclareStatement,
  setIfStatement,
  setReturnStatement,
  setWhileStatement,
} from "./Statements/Statement";
import { setImportDeclaration, setExportDeclaration } from "./Modules/ImportOrExportDeclaration";
import AssignExpression from "./Expressions/AssignmentExpression";
import ArrayExpression from "./Expressions/ArrayExpression";
import ObjectExpression from "./Expressions/ObjectExpression";
import FunctionCallStatement from "./Statements/Declarations/FunctionDeclaration/FunctionCall";
import DeclareStatement from "./Statements/Declarations/VariableDeclaration";
import ForStatement from "./Statements/Loops/ForStatement";
import FunctionDeclareStatement from "./Statements/Declarations/FunctionDeclaration";
import IfStatement from "./Statements/Choice/IfStatement";
import ReturnStatement from "./Statements/ControlFlow/ReturnStatement";
import WhileStatement from "./Statements/Loops/WhileStatement";
import ImportDeclaration from "./Modules/ImportOrExportDeclaration/ImportDeclaration";
import ExportDeclaration from "./Modules/ImportOrExportDeclaration/ExportDeclaration";

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

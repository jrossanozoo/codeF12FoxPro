"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const definitionProvider_1 = require("./definitionProvider");
function activate(context) {
    console.log('FoxPro Go to Definition extension is now active!');
    // Registrar el provider de definiciones para archivos .prg
    const definitionProvider = new definitionProvider_1.FoxProDefinitionProvider();
    // Registrar para archivos con language ID 'foxpro'
    const disposable = vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'foxpro' }, definitionProvider);
    // Tambi�n registrar para archivos .prg que no tengan el language ID configurado
    const disposablePrg = vscode.languages.registerDefinitionProvider({ scheme: 'file', pattern: '**/*.prg' }, definitionProvider);
    // Registrar para archivos .PRG (may�sculas)
    const disposablePrgUpper = vscode.languages.registerDefinitionProvider({ scheme: 'file', pattern: '**/*.PRG' }, definitionProvider);
    context.subscriptions.push(disposable, disposablePrg, disposablePrgUpper);
}
exports.activate = activate;
function deactivate() {
    console.log('FoxPro Go to Definition extension has been deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
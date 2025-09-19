import * as vscode from 'vscode';
import { FoxProDefinitionProvider } from './definitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('FoxPro Go to Definition extension is now active!');

    // Registrar el provider de definiciones para archivos .prg
    const definitionProvider = new FoxProDefinitionProvider();
    
    // Registrar para archivos con language ID 'foxpro'
    const disposable = vscode.languages.registerDefinitionProvider(
        { scheme: 'file', language: 'foxpro' },
        definitionProvider
    );

    // También registrar para archivos .prg que no tengan el language ID configurado
    const disposablePrg = vscode.languages.registerDefinitionProvider(
        { scheme: 'file', pattern: '**/*.prg' },
        definitionProvider
    );

    // Registrar para archivos .PRG (mayúsculas)
    const disposablePrgUpper = vscode.languages.registerDefinitionProvider(
        { scheme: 'file', pattern: '**/*.PRG' },
        definitionProvider
    );

    context.subscriptions.push(disposable, disposablePrg, disposablePrgUpper);
}

export function deactivate() {
    console.log('FoxPro Go to Definition extension has been deactivated');
}
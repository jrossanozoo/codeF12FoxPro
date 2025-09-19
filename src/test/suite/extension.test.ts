import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('foxpro-extensions.foxpro-go-to-definition'));
    });

    test('Should activate on .prg files', async () => {
        const extension = vscode.extensions.getExtension('foxpro-extensions.foxpro-go-to-definition');
        if (extension) {
            await extension.activate();
            assert.ok(extension.isActive);
        }
    });
});
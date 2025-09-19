import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        // El directorio de desarrollo de la extensión - 
        // pasado a --extensionDevelopmentPath
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // El path del test runner
        // pasado a --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Descargar VS Code, descomprimir y ejecutar la integración de tests
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
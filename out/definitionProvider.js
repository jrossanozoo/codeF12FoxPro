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
exports.FoxProDefinitionProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
class FoxProDefinitionProvider {
    async provideDefinition(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return [];
        }
        const line = document.lineAt(position.line).text;
        const classInfo = this.extractClassNameAndType(line, position.character);
        if (!classInfo) {
            return [];
        }
        console.log(`Buscando definición para clase: ${classInfo.className} (tipo: ${classInfo.type})`);
        // Buscar la definición de la clase usando el tipo específico
        const definitions = await this.findClassDefinition(classInfo.className, classInfo.type, document, classInfo.filename);
        return definitions;
    }
    /**
     * Extrae el nombre de la clase y el tipo de instanciación desde una línea de código
     * Solo retorna información si detecta un patrón válido de instanciación
     */
    extractClassNameAndType(line, character) {
        // Limpiar la línea
        const cleanLine = line.trim();
        // Patterns para detectar instanciación de clases con mayor precisión
        const patterns = [
            // createobject("nombre_de_clase")
            {
                regex: /createobject\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*\)/i,
                type: 'createobject',
                captureGroup: 1
            },
            // newobject("nombre_de_clase", "archivo.prg")
            {
                regex: /newobject\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*,\s*['"]\s*([^'"]*)\s*['"]\s*\)/i,
                type: 'newobject_with_file',
                captureGroup: 1,
                fileGroup: 2
            },
            // newobject("nombre_de_clase") sin archivo
            {
                regex: /newobject\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*\)/i,
                type: 'newobject',
                captureGroup: 1
            },
            // _screen.zoo.crearobjeto("nombre_de_clase", "archivo.prg")
            {
                regex: /_screen\.zoo\.crearobjeto\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*,\s*['"]\s*([^'"]*)\s*['"]\s*\)/i,
                type: 'crearobjeto_with_file',
                captureGroup: 1,
                fileGroup: 2
            },
            // _screen.zoo.crearobjeto("nombre_de_clase")
            {
                regex: /_screen\.zoo\.crearobjeto\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*\)/i,
                type: 'crearobjeto',
                captureGroup: 1
            },
            // _screen.zoo.crearobjetoporproducto("nombre_de_clase")
            {
                regex: /_screen\.zoo\.crearobjetoporproducto\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*\)/i,
                type: 'crearobjetoporproducto',
                captureGroup: 1
            },
            // _screen.zoo.instanciarcomponente("nombre_de_componente")
            {
                regex: /_screen\.zoo\.instanciarcomponente\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*\)/i,
                type: 'instanciarcomponente',
                captureGroup: 1
            },
            // _screen.zoo.instanciarentidad("nombre_de_entidad")
            {
                regex: /_screen\.zoo\.instanciarentidad\s*\(\s*['"]\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*['"]\s*\)/i,
                type: 'instanciarentidad',
                captureGroup: 1
            },
            // define class nombre_de_clase
            {
                regex: /define\s+class\s+([a-zA-Z_][a-zA-Z0-9_]*)/i,
                type: 'definition',
                captureGroup: 1
            }
        ];
        for (const pattern of patterns) {
            const match = cleanLine.match(pattern.regex);
            if (match) {
                const className = match[pattern.captureGroup];
                const filename = pattern.fileGroup ? match[pattern.fileGroup] : undefined;
                // Verificar si el cursor está sobre el nombre de la clase
                const startIndex = line.toLowerCase().indexOf(className.toLowerCase());
                if (startIndex === -1)
                    continue;
                const endIndex = startIndex + className.length;
                if (character >= startIndex && character <= endIndex) {
                    return {
                        className: className,
                        type: pattern.type,
                        filename: filename
                    };
                }
            }
        }
        return null;
    }
    /**
     * Busca la definición de una clase usando el tipo específico para optimizar la búsqueda
     */
    async findClassDefinition(className, type, document, filename) {
        const locations = [];
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) {
            return locations;
        }
        const basePath = workspaceFolder.uri.fsPath;
        // Estrategia optimizada basada en el tipo de instanciación
        switch (type) {
            case 'newobject_with_file':
            case 'crearobjeto_with_file':
                // Buscar en el archivo específico primero
                if (filename) {
                    const specificFileLocation = await this.searchInSpecificFile(basePath, filename, className);
                    if (specificFileLocation) {
                        locations.push(specificFileLocation);
                        return locations;
                    }
                }
                break;
            case 'instanciarentidad':
                // Buscar entidades con orden de prioridad específico
                const entityLocations = await this.findEntityDefinitions(basePath, className);
                if (entityLocations.length > 0) {
                    return entityLocations;
                }
                break;
            case 'instanciarcomponente':
                // Buscar componentes
                const componentLocations = await this.findComponentDefinitions(basePath, className);
                if (componentLocations.length > 0) {
                    return componentLocations;
                }
                break;
            case 'crearobjetoporproducto':
                // Buscar productos
                const productLocations = await this.findProductDefinitions(basePath, className);
                if (productLocations.length > 0) {
                    return productLocations;
                }
                break;
            case 'definition':
                // Para definiciones de clase, buscar en el archivo actual solamente
                const currentFileLocation = await this.searchInFile(document.uri.fsPath, className);
                if (currentFileLocation) {
                    locations.push(currentFileLocation);
                }
                return locations;
        }
        // Búsqueda estándar como fallback
        return await this.findStandardClassDefinition(basePath, className, document);
    }
    /**
     * Busca en un archivo específico mencionado en newobject() o crearobjeto()
     */
    async searchInSpecificFile(basePath, filename, className) {
        // Normalizar el nombre del archivo
        let normalizedFilename = filename;
        if (!normalizedFilename.toLowerCase().endsWith('.prg')) {
            normalizedFilename += '.prg';
        }
        // Buscar el archivo en el workspace
        const filePath = await this.findFileInWorkspace(basePath, normalizedFilename);
        if (filePath) {
            return await this.searchInFile(filePath, className);
        }
        return null;
    }
    /**
     * Busca definiciones de entidades con el orden de prioridad específico
     */
    async findEntityDefinitions(basePath, className) {
        const locations = [];
        // Orden de prioridad para InstanciarEntidad
        const entityPatterns = [
            `entColorYTalle_${className}.prg`,
            `ent_${className}.prg`,
            `din_Entidad${className}.prg`
        ];
        for (const pattern of entityPatterns) {
            const filePath = await this.findFileInWorkspace(basePath, pattern);
            if (filePath) {
                const location = await this.searchInFile(filePath, className);
                if (location) {
                    locations.push(location);
                    break; // Encontrar solo el primero por prioridad
                }
            }
        }
        return locations;
    }
    /**
     * Busca definiciones de componentes
     */
    async findComponentDefinitions(basePath, className) {
        const locations = [];
        // Buscar componentes con prefijo "componente"
        const componentPatterns = [
            `componente${className}.prg`,
            `Componente${className}.prg`,
            `COMPONENTE${className}.prg`
        ];
        for (const pattern of componentPatterns) {
            const filePath = await this.findFileInWorkspace(basePath, pattern);
            if (filePath) {
                const location = await this.searchInFile(filePath, className);
                if (location) {
                    locations.push(location);
                    break; // Encontrar solo el primero
                }
            }
        }
        return locations;
    }
    /**
     * Busca definiciones de productos
     */
    async findProductDefinitions(basePath, className) {
        const locations = [];
        // Primero buscar con prefijo ColorYTalle_
        const productPatterns = [
            `ColorYTalle_${className}.prg`,
            `coloryTalle_${className}.prg`,
            `COLORYTALLE_${className}.prg`
        ];
        for (const pattern of productPatterns) {
            const filePath = await this.findFileInWorkspace(basePath, pattern);
            if (filePath) {
                const location = await this.searchInFile(filePath, className);
                if (location) {
                    locations.push(location);
                    return locations; // Encontrado con prefijo, retornar
                }
            }
        }
        // Si no se encontró con prefijo, buscar directamente el nombre de la clase
        const directPatterns = [
            `${className}.prg`,
            `${className.toLowerCase()}.prg`,
            `${className.toUpperCase()}.prg`
        ];
        for (const pattern of directPatterns) {
            const filePath = await this.findFileInWorkspace(basePath, pattern);
            if (filePath) {
                const location = await this.searchInFile(filePath, className);
                if (location) {
                    locations.push(location);
                    break;
                }
            }
        }
        return locations;
    }
    /**
     * Búsqueda estándar para createobject, newobject y crearobjeto sin archivo específico
     */
    async findStandardClassDefinition(basePath, className, document) {
        const locations = [];
        // 1. Buscar en el archivo actual primero
        const currentFileLocation = await this.searchInFile(document.uri.fsPath, className);
        if (currentFileLocation) {
            locations.push(currentFileLocation);
        }
        // 2. Buscar archivo con el mismo nombre de la clase
        const directFilePatterns = [
            `${className}.prg`,
            `${className.toLowerCase()}.prg`,
            `${className.toUpperCase()}.prg`
        ];
        for (const pattern of directFilePatterns) {
            const filePath = await this.findFileInWorkspace(basePath, pattern);
            if (filePath && !locations.some(loc => loc.uri.fsPath === filePath)) {
                const location = await this.searchInFile(filePath, className);
                if (location) {
                    locations.push(location);
                }
            }
        }
        // 3. Si no se encuentra nada, hacer búsqueda general (limitada)
        if (locations.length === 0) {
            const generalLocations = await this.searchInWorkspace(basePath, className, 20);
            locations.push(...generalLocations);
        }
        return locations;
    }
    /**
     * Busca la definición de clase en un archivo específico
     */
    async searchInFile(filePath, className) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const match = line.match(new RegExp(`define\\s+class\\s+${className}\\b`, 'i'));
                if (match) {
                    const position = new vscode.Position(i, match.index || 0);
                    const uri = vscode.Uri.file(filePath);
                    return new vscode.Location(uri, position);
                }
            }
        }
        catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
        }
        return null;
    }
    /**
     * Busca un archivo en todo el workspace
     */
    async findFileInWorkspace(basePath, fileName) {
        try {
            const files = await vscode.workspace.findFiles(new vscode.RelativePattern(basePath, `**/${fileName}`), '**/node_modules/**', 10);
            return files.length > 0 ? files[0].fsPath : null;
        }
        catch (error) {
            console.error(`Error searching for file ${fileName}:`, error);
            return null;
        }
    }
    /**
     * Busca definiciones de clase en todo el workspace (con límite para eficiencia)
     */
    async searchInWorkspace(basePath, className, maxFiles = 50) {
        const locations = [];
        try {
            const files = await vscode.workspace.findFiles(new vscode.RelativePattern(basePath, '**/*.{prg,PRG}'), '**/node_modules/**', maxFiles);
            for (const file of files) {
                const location = await this.searchInFile(file.fsPath, className);
                if (location) {
                    locations.push(location);
                }
            }
        }
        catch (error) {
            console.error('Error searching in workspace:', error);
        }
        return locations;
    }
}
exports.FoxProDefinitionProvider = FoxProDefinitionProvider;
//# sourceMappingURL=definitionProvider.js.map
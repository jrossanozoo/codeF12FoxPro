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
     * Extrae el parámetro de clase sin importar la posición del cursor en la línea
     */
    extractClassNameAndType(line, character) {
        // Limpiar la línea
        const cleanLine = line.trim();
        // Patterns para detectar instanciación de clases
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
            // _screen.zoo.instanciarentidad("nombre_de_entidad") - case insensitive
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
        // Buscar el patrón en la línea - CAMBIO IMPORTANTE: no verificar posición del cursor
        for (const pattern of patterns) {
            const match = cleanLine.match(pattern.regex);
            if (match) {
                const className = match[pattern.captureGroup];
                const filename = pattern.fileGroup ? match[pattern.fileGroup] : undefined;
                // Para las funciones del framework Organic, SIEMPRE extraer el parámetro
                // sin importar dónde esté posicionado el cursor
                if (pattern.type === 'instanciarentidad' ||
                    pattern.type === 'instanciarcomponente' ||
                    pattern.type === 'crearobjetoporproducto' ||
                    pattern.type === 'crearobjeto' ||
                    pattern.type === 'crearobjeto_with_file') {
                    return {
                        className: className,
                        type: pattern.type,
                        filename: filename
                    };
                }
                // Para otros tipos, verificar posición del cursor (comportamiento original)
                const startIndex = line.toLowerCase().indexOf(className.toLowerCase());
                if (startIndex !== -1) {
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
     * Maneja conversión de CamelCase a lowercase para nombres de archivos
     */
    async findEntityDefinitions(basePath, className) {
        const locations = [];
        // Generar variaciones del nombre de la clase
        const classNameVariations = [
            className,
            className.toLowerCase(),
            className.toUpperCase(),
            // Primera letra mayúscula, resto minúscula
            className.charAt(0).toUpperCase() + className.slice(1).toLowerCase()
        ];
        // Orden de prioridad para InstanciarEntidad con todas las variaciones
        for (const classVar of classNameVariations) {
            const entityPatterns = [
                `ent_${classVar}.prg`,
                `entColorYTalle_${classVar}.prg`,
                `din_Entidad${classVar}.prg`,
                `${classVar}.prg` // Fallback: nombre directo
            ];
            for (const pattern of entityPatterns) {
                console.log(`Buscando archivo de entidad: ${pattern}`);
                const filePath = await this.findFileInWorkspace(basePath, pattern);
                if (filePath) {
                    console.log(`Archivo encontrado: ${filePath}`);
                    // Buscar la definición de clase dentro del archivo
                    // Puede que la clase tenga un nombre diferente al archivo
                    const location = await this.searchInFileForAnyClassDefinition(filePath, classNameVariations);
                    if (location) {
                        locations.push(location);
                        return locations; // Encontrado, retornar inmediatamente
                    }
                }
            }
        }
        // Si no se encontró con patrones específicos, hacer búsqueda general en archivos .prg
        if (locations.length === 0) {
            console.log(`Búsqueda general para entidad: ${className}`);
            const generalLocations = await this.searchForClassInPrgFiles(basePath, className);
            locations.push(...generalLocations);
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
            `COMPONENTE${className}.prg`,
            `${className}.prg` // Fallback: nombre directo
        ];
        // Buscar con todos los casos posibles
        for (const basePattern of componentPatterns) {
            const patterns = [
                basePattern,
                basePattern.toLowerCase(),
                basePattern.toUpperCase()
            ];
            for (const pattern of patterns) {
                const filePath = await this.findFileInWorkspace(basePath, pattern);
                if (filePath) {
                    const location = await this.searchInFile(filePath, className);
                    if (location) {
                        locations.push(location);
                        return locations; // Encontrado, retornar inmediatamente
                    }
                }
            }
        }
        // Si no se encontró con patrones específicos, hacer búsqueda general en archivos .prg
        if (locations.length === 0) {
            const generalLocations = await this.searchForClassInPrgFiles(basePath, className);
            locations.push(...generalLocations);
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
            `COLORYTALLE_${className}.prg`,
            `${className}.prg` // Fallback: nombre directo
        ];
        // Buscar con todos los casos posibles
        for (const basePattern of productPatterns) {
            const patterns = [
                basePattern,
                basePattern.toLowerCase(),
                basePattern.toUpperCase()
            ];
            for (const pattern of patterns) {
                const filePath = await this.findFileInWorkspace(basePath, pattern);
                if (filePath) {
                    const location = await this.searchInFile(filePath, className);
                    if (location) {
                        locations.push(location);
                        return locations; // Encontrado, retornar inmediatamente
                    }
                }
            }
        }
        // Si no se encontró con patrones específicos, hacer búsqueda general en archivos .prg
        if (locations.length === 0) {
            const generalLocations = await this.searchForClassInPrgFiles(basePath, className);
            locations.push(...generalLocations);
        }
        return locations;
    }
    /**
     * Busca una clase en todos los archivos .prg del workspace
     * Esta es una búsqueda general que se usa como fallback
     */
    async searchForClassInPrgFiles(basePath, className) {
        const locations = [];
        try {
            // Buscar todos los archivos .prg en el workspace
            const files = await vscode.workspace.findFiles(new vscode.RelativePattern(basePath, '**/*.{prg,PRG}'), '**/node_modules/**', 100 // Límite para evitar sobrecarga
            );
            // Buscar la definición de la clase en cada archivo
            for (const file of files) {
                const location = await this.searchInFile(file.fsPath, className);
                if (location) {
                    locations.push(location);
                    // Continuar buscando para encontrar todas las posibles definiciones
                }
            }
        }
        catch (error) {
            console.error('Error searching for class in .prg files:', error);
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
        // 2. Buscar archivo con el mismo nombre de la clase (asegurando extensión .prg)
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
        // 3. Si no se encuentra nada, hacer búsqueda general en archivos .prg
        if (locations.length === 0) {
            const generalLocations = await this.searchForClassInPrgFiles(basePath, className);
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
     * Busca la definición de cualquiera de las variaciones del nombre de clase en un archivo
     */
    async searchInFileForAnyClassDefinition(filePath, classNameVariations) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Buscar cualquier definición de clase en el archivo
                const classMatch = line.match(/define\s+class\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
                if (classMatch) {
                    const foundClassName = classMatch[1];
                    // Verificar si alguna variación coincide con la clase encontrada
                    for (const variation of classNameVariations) {
                        if (foundClassName.toLowerCase() === variation.toLowerCase()) {
                            const position = new vscode.Position(i, classMatch.index || 0);
                            const uri = vscode.Uri.file(filePath);
                            console.log(`Clase encontrada: ${foundClassName} en ${filePath}:${i}`);
                            return new vscode.Location(uri, position);
                        }
                    }
                    // También verificar si la clase encontrada contiene alguna variación
                    // Por ejemplo: ent_OrdenDeProduccion vs OrdenDeProduccion
                    for (const variation of classNameVariations) {
                        if (foundClassName.toLowerCase().includes(variation.toLowerCase()) ||
                            variation.toLowerCase().includes(foundClassName.toLowerCase())) {
                            const position = new vscode.Position(i, classMatch.index || 0);
                            const uri = vscode.Uri.file(filePath);
                            console.log(`Clase relacionada encontrada: ${foundClassName} en ${filePath}:${i}`);
                            return new vscode.Location(uri, position);
                        }
                    }
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
     * DEPRECATED: Usar searchForClassInPrgFiles en su lugar
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
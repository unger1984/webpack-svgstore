import { Compilation, Compiler } from "webpack";
declare type WebpackSvgStoreOptions = {
    path?: string;
    fileName?: string;
    inlineSvg?: boolean;
    removeViewBox?: boolean;
    prefix?: string;
    publicPath?: string;
};
declare type TaskValue = {
    fileContent: string;
    fileName: string;
};
interface IWebpackSvgStore {
    options: WebpackSvgStoreOptions;
    tasks: {
        [file: string]: TaskValue[];
    };
}
declare class WebpackSvgStore implements IWebpackSvgStore {
    tasks: {
        [key: string]: TaskValue[];
    };
    options: Required<WebpackSvgStoreOptions>;
    constructor(options?: WebpackSvgStoreOptions, tasks?: {
        [key: string]: TaskValue[];
    });
    addTask(file: string, value: TaskValue): void;
    minify(file: string, removeViewBox: boolean): string;
    convertFilenameToId(filename: string, prefix: string): string;
    /**
     * [parseFiles description]
     * @return {[type]} [description]
     */
    parseFiles(files: string[], options: Required<WebpackSvgStoreOptions>): string;
    createTaskContext(): void;
    getPublicPath(compilation: Compilation): string;
    apply(compiler: Compiler): void;
}
export = WebpackSvgStore;

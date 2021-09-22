import path from "path";
import { validate } from "schema-utils";
import ConstDependency from "webpack/lib/dependencies/ConstDependency";
import NullFactory from "webpack/lib/NullFactory";
import { filesMapSync, parseFiles, hash, hashByString } from "./helpers/utils";

// schema for options object
const schema = {
  inlineSvg: "boolean",
  removeViewBox: "boolean",
  prefix: "string",
};

// Defaults
const defaults = {
  inlineSvg: false,
  removeViewBox: false,
  prefix: "",
};

class WebpackSvgStore {
  constructor(options = {}) {
    this.tasks = {};
    this.options = { ...defaults, ...options };

    validate(schema, this.options, {
      name: "WebpackSvgStore",
      baseDataPath: "options",
    });
  }

  addTask(file, value) {
    this.tasks[file]
      ? this.tasks[file].push(value)
      : (() => {
          this.tasks[file] = [];
          this.tasks[file].push(value);
        })();
  }

  createTaskContext(expr, parser) {
    const { current } = parser.state;

    const data = {
      path: "/**/*.svg",
      fileName: "[hash].sprite.svg",
      context: current.context,
    };

    expr.init.properties.forEach((prop) => {
      switch (prop.key.name) {
        case "name":
          data.fileName = prop.value.value;
          break;
        case "path":
          data.path = prop.value.value;
          break;
        default:
          break;
      }
    });

    const files = filesMapSync(path.join(data.context, data.path || ""));

    data.fileContent = parseFiles(files, this.options);
    data.fileName = hash(data.fileName, hashByString(data.fileContent));

    let replacement = `${expr.id.name} = { filename: "${this.options.publicPath}${data.fileName}" }`;
    let dep = new ConstDependency(replacement, expr.range);
    dep.loc = expr.loc;
    current.addDependency(dep);
    this.addTask(current.request, data);
  }

  getPublicPath(compilation) {
    const webpackPublicPath = compilation.getAssetPath(
      compilation.outputOptions.publicPath,
      { hash: compilation.hash }
    );

    let publicPath =
      webpackPublicPath !== "auto"
        ? webpackPublicPath
        : path
            .relative(
              path.resolve(compilation.options.output.path),
              compilation.options.output.path
            )
            .split(path.sep)
            .join("/");

    if (publicPath.length && publicPath.substr(-1, 1) !== "/") {
      publicPath += "/";
    }

    return publicPath;
  }

  apply(compiler) {
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;

    compiler.hooks.thisCompilation.tap("WebpackSvgStore", (compilation) => {
      this.options.publicPath = this.getPublicPath(compilation);

      compilation.dependencyFactories.set(ConstDependency, new NullFactory());
      compilation.dependencyTemplates.set(
        ConstDependency,
        new ConstDependency.Template()
      );

      compilation.hooks.processAssets.tap(
        {
          name: "WebpackSvgStore",
          stage: compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          Object.keys(this.tasks).map(async (key) => {
            this.tasks[key].forEach((task) => {
              compilation.emitAsset(
                task.fileName,
                new RawSource(task.fileContent)
              );
            });
          });
        }
      );
    });

    compiler.hooks.normalModuleFactory.tap("WebpackSvgStore", (factory) => {
      factory.hooks.parser
        .for("javascript/auto")
        .tap("WebpackSvgStore", (parser) => {
          parser.hooks.statement.tap("WebpackSvgStore", (expr) => {
            if (!expr.declarations || !expr.declarations.length) return;
            const thisExpr = expr.declarations[0];

            if (thisExpr.id.name === "__SVGSTORE__") {
              this.createTaskContext(thisExpr, parser);
            }
          });
        });
    });

    compiler.hooks.done.tap("WebpackSvgStore", () => {
      this.tasks = {};
    });
  }
}

module.exports = WebpackSvgStore;

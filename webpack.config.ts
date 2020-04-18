import { join, resolve } from "path";
import { readdirSync } from "fs";

module.exports = (env: object, options: object) => {

  const conf = {
    prodMode: process.env.NODE_ENV === "production",
    lambdaFunctionsDir: "./src",
  };

  console.info(
    `Building in ${conf.prodMode ? "production" : "development"} mode...\n`
  );

  const modules = readdirSync(conf.lambdaFunctionsDir);

  if (!env && options["watch"]) {
    console.warn(
      "You didn't pass the module to watch. Procesing all modules will take a while."
    );
    console.warn(
      "Run `webpack -w --env.module <module_name>` to watch only a specific module.",
      "The following modules are available:"
    );
    console.warn(modules.join("\n"));
  }

  const entries = {};

  modules
    .filter((module: string) => {
      return (
        !module.startsWith(".") &&
        (!env || (env && env["module"] && env["module"] === module))
      );
    })
    .map((module: string) => join(conf.lambdaFunctionsDir, module))
    .forEach((modulePath: string) => {
      readdirSync(modulePath)
        .filter((item: string) => item.endsWith(".ts"))
        .forEach((file: string) => {
          const fileName = file.replace(".ts", "");
          const dist = join(
            __dirname,
            modulePath.replace("src", "dist"),
            fileName,
            fileName
          );
          const src = join(__dirname, modulePath, file);
          entries[dist.replace(__dirname, ".")] = src.replace(__dirname, ".");
        });
    });

  return {
    entry: entries,
    target: "node",
    mode: conf.prodMode ? "production" : "development",
    watchOptions: {
      aggregateTimeout: 600,
      ignored: /node_modules/,
      poll: 3000,
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
        },
      ],
      exprContextCritical: false,
    },
    externals: [
      {
        "aws-sdk": "aws-sdk",
        commonjs: "commonjs",
      },
    ],
    resolve: {
      extensions: [".ts", ".js"],
    },
    output: {
      path: resolve(__dirname),
      filename: "[name].js",
      libraryTarget: "commonjs2",
    },
    optimization: {
      minimize: conf.prodMode,
      usedExports: true,
    },
    devtool: "source-map",
    plugins: [],
  };
};

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![install size][size]][size-url]

# @unger1984/webpack-svgstore

<br/>
<div align="center">
  <a href="http://www.w3.org/Graphics/SVG/">
  <img width="150" height="150" src="./example/static/svg/svg-logo.svg">
  </a>
  <a href="https://webpack.js.org/">
    <img width="150" height="150"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>
<br/>

This package is a modification of the original package from [David Bergmann](https://github.com/davidbepa/webpack-svgstore)

Combine svg files into one with `<symbol>` elements. Read more about this in [CSS Tricks article](http://css-tricks.com/svg-symbol-good-choice-icons/). This plugin was built for Webpack 5. It takes some ideas from [webpack-svgstore-plugin](https://github.com/mrsum/webpack-svgstore-plugin) and [gulp-svgstore](https://www.npmjs.com/package/gulp-svgstore).

## Install

```bash
npm i -D @unger1984/webpack-svgstore
```

## Usage

#### 1) Require the plugin in your webpack.config.js file

```javascript
//webpack.config.js
const SvgStore = require("@unger1984/webpack-svgstore");

module.exports = {
  plugins: [
    // create svgStore instance object
    new SvgStore({
      path: path.resolve(__dirname, "assets/svg/**/*.svg"),
      fileName: "svg-sprites.svg",
      prefix: "icon-",
    }),
  ],
};
```

#### 2) Add the sprites loader in your code

```javascript
import svgxhr from "@unger1984/webpack-svgstore/dist/helpers/svgxhr";

svgxhr("svg-sprites.svg");
```

#### 3) HTML code for using your icons

HTML:

```html
<svg>
  <use xlink:href="#icon-name"></use>
</svg>
```

JSX:

```html
<svg>
  <use xlinkHref="#icon-name" />
</svg>
```

## Plugin Options

|        Name         |     Type      |      Default      | Description                                                                                                                  |
| :-----------------: | :-----------: | :---------------: | :--------------------------------------------------------------------------------------------------------------------------- |
|     **`path`**      | _`{String}`_  |    `/**/*.svg`    | This option determines the path to the svg files that are going to be included in the sprites file.                          |
|   **`fileName`**    | _`{String}`_  | `svg-sprites.svg` | This option determines the name of the resulting sprites file.                                                               |
|   **`inlineSvg`**   | _`{Boolean}`_ |      `false`      | This option determines if the output should only contain the `<svg>` element without `<?xml ?>` and `DOCTYPE` to use inline. |
| **`removeViewBox`** | _`{Boolean}`_ |      `false`      | Allows removing the viewBox attribute from each element.                                                                     |
|    **`prefix`**     | _`{String}`_  |      `icon-`      | This option determines the prefix of each symbol's id .                                                                      |

## License

NPM package available here: [webpack-svgstore](https://github.com/users/unger1984/packages/npm/package/webpack-svgstore)

MIT © [Unger Andrey](http://unger1984.pro/)

[npm]: https://img.shields.io/npm/v/@unger1984/webpack-svgstore.svg
[npm-url]: https://npmjs.com/package/@unger1984/webpack-svgstore
[node]: https://img.shields.io/node/v/@unger1984/webpack-svgstore.svg
[node-url]: https://nodejs.org
[size]: https://packagephobia.now.sh/badge?p=@unger1984/webpack-svgstore
[size-url]: https://packagephobia.now.sh/result?p=@unger1984/webpack-svgstore
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

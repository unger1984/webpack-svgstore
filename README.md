[![npm][npm]][npm-url]
[![node][node]][node-url]
[![install size][size]][size-url]
[![semantic-release][semantic-release]][semantic-release-url]

# webpack-svgstore

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

Combine svg files into one with `<symbol>` elements. Read more about this in [CSS Tricks article](http://css-tricks.com/svg-symbol-good-choice-icons/). This plugin was built for for Webpack 5. It takes some ideas from [webpack-svgstore-plugin](https://github.com/mrsum/webpack-svgstore-plugin) and [gulp-svgstore](https://www.npmjs.com/package/gulp-svgstore).

## Install

Using npm:

```bash
npm i webpack-svgstore --save-dev
```

Using yarn:

```bash
yarn add webpack-svgstore -D
```

## Usage

#### 1) Require plugin in your webpack.config.js file

```javascript
//webpack.config.js
const SvgStore = require("webpack-svgstore");

module.exports = {
  plugins: [
    // create svgStore instance object
    new SvgStore({
      prefix: "icon-",
    }),
  ],
};
```

#### 2) Put function mark at your chunk

```javascript
// The plugin will find __SVGSTORE__ and build the sprites file
const __SVGSTORE__ = {
  path: "./assets/svg/**/*.svg",
  name: "assets/svg/[hash].svgsheet.svg",
};

// Add this line if you want to automatically load your sprites in your HTML
require("webpack-svgstore/dist/helpers/svgxhr")(__SVGSTORE__);
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

## Options

#### Plugin Options

|        Name         |     Type      | Default | Description                                                                                                                  |
| :-----------------: | :-----------: | :-----: | :--------------------------------------------------------------------------------------------------------------------------- |
|   **`inlineSvg`**   | _`{Boolean}`_ | `false` | This option determines if the output should only contain the `<svg>` element without `<?xml ?>` and `DOCTYPE` to use inline. |
| **`removeViewBox`** | _`{Boolean}`_ | `false` | Allows removing the viewBox attribute from each element.                                                                     |
|    **`prefix`**     | _`{String}`_  | `icon-` | This option determines the prefix of each symbol's id .                                                                      |

#### `__SVGSTORE__` Options

|    Name    |     Type     |       Default       | Description                                                                                                  |
| :--------: | :----------: | :-----------------: | :----------------------------------------------------------------------------------------------------------- |
| **`path`** | _`{String}`_ |     `/**/*.svg`     | This option determines the glob pattern for the svg files that are going to be included in the sprites file. |
| **`name`** | _`{String}`_ | `[hash].sprite.svg` | This option determines the name of the resulting sprites file.                                               |

## License

NPM package available here: [webpack-svgstore](https://www.npmjs.com/package/webpack-svgstore)

MIT © [David Bergmann](http://davidbergmann.com/)

[npm]: https://img.shields.io/npm/v/webpack-svgstore.svg
[npm-url]: https://npmjs.com/package/webpack-svgstore
[node]: https://img.shields.io/node/v/webpack-svgstore.svg
[node-url]: https://nodejs.org
[size]: https://packagephobia.now.sh/badge?p=webpack-svgstore
[size-url]: https://packagephobia.now.sh/result?p=webpack-svgstore
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release

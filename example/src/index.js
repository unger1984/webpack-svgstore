import svgxhr from "../../dist/helpers/svgxhr";

const __SVGSTORE__ = {
  path: "../static/svg/**/*.svg",
  name: "[hash].svgsheet.svg",
};

svgxhr(__SVGSTORE__);

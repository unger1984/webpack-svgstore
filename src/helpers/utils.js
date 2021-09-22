import fs from "fs";
import path from "path";
import { optimize } from "svgo";
import cheerio from "cheerio";
import crypto from "crypto";
import glob from "glob";

/**
 * Minify via SVGO
 * @param  {string}   file  filename
 * @param  {integer}  loop  loop count
 * @return {[type]}         minified source
 */
const _minify = (file, removeViewBox) => {
  const plugins = [
    { name: "removeTitle" },
    { name: "collapseGroups" },
    { name: "inlineStyles" },
    { name: "convertStyleToAttrs" },
    { name: "cleanupIDs" },
  ];

  if (removeViewBox) {
    plugins.push({ name: "removeViewBox" });
  }

  const result = optimize(file, { plugins });

  return result.data;
};

/**
 * Convert filename to id
 * @param  {string} filename [description]
 * @return {string}          [description]
 */
const _convertFilenameToId = (filename, prefix) => {
  return prefix + filename.split(".").join("-").toLowerCase();
};

/**
 * Create sprite
 * @param  {object} data
 * @param  {string} template
 * @return {string}
 */
export const createSprite = (data, template) => {
  return pug.renderFile(template, data);
};

/**
 * Build files map sync
 * @param  {string} input Destination path
 * @return {array}        Array of paths
 */
export const filesMapSync = (input) => {
  return glob.sync(input);
};

/**
 * [parseFiles description]
 * @return {[type]} [description]
 */
export const parseFiles = (files, options) => {
  let resultSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/></svg>';
  if (!options.inlineSvg) {
    resultSvg =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
      '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
      resultSvg;
  }

  const $ = cheerio.load(resultSvg, { xmlMode: true });
  const $combinedSvg = $("svg");
  const $combinedDefs = $("defs");

  files.forEach((file) => {
    // load and minify
    const buffer = _minify(
      fs.readFileSync(file, "utf8"),
      options.removeViewBox
    );

    // get filename for id generation
    const filename = path.basename(file, ".svg");

    const $svg = cheerio.load(buffer.toString(), { xmlMode: true })("svg");

    if ($svg.length === 0) return;

    const idAttr = _convertFilenameToId(filename, options.prefix);
    const viewBoxAttr = $svg.attr("viewBox");
    const preserveAspectRatioAttr = $svg.attr("preserveAspectRatio");
    const $symbol = $("<symbol/>");

    $symbol.attr("id", idAttr);
    if (viewBoxAttr) {
      $symbol.attr("viewBox", viewBoxAttr);
    }
    if (preserveAspectRatioAttr) {
      $symbol.attr("preserveAspectRatio", preserveAspectRatioAttr);
    }

    const $defs = $svg.find("defs");
    if ($defs.length > 0) {
      $combinedDefs.append($defs.contents());
      $defs.remove();
    }

    $symbol.append($svg.contents());
    $combinedSvg.append($symbol);
  });

  return $.xml();
};

/**
 * [_hash description]
 * @param  {[type]} buffer [description]
 * @param  {[type]} name   [description]
 * @return {[type]}        [description]
 */
export const hash = (str, hash) => {
  return str.indexOf("[hash]") >= 0 ? str.replace("[hash]", hash) : str;
};

/**
 * [_hashByString description]
 * @param {string} str
 * @return {[type]} [description]
 */
export const hashByString = (str) => {
  const sha = crypto.createHash("md5");
  sha.update(str);

  return sha.digest("hex");
};

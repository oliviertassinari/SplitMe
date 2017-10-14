
import blueimpTmpl from 'blueimp-tmpl';
import getLoadCSS from 'modules/loadCSS/getLoadCSS';
import indexHtml from './index.cordova.html';

const loadCSS = getLoadCSS(false);

module.exports = function index(templateParams) {
  /* eslint-disable */
  return blueimpTmpl(indexHtml, {
    loadCSS: loadCSS,
    sheets: '<style>html{background:#eee;-webkit-font-smoothing:antialiased}body{margin:0px;font-family:Roboto, sans-serif}</style>',
    markup: '<div><div><div style="width:100%;position:fixed;z-index:10;"><div style="background-color:#4caf50;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12);border-radius:0px;position:relative;z-index:1100;width:100%;display:flex;min-height:56px;padding-left:24px;padding-right:24px;"><div style="margin-top:4px;margin-right:8px;margin-left:-16px;"><div></div></div><h1 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;padding-top:0;letter-spacing:0;font-size:24px;font-weight:400;color:#ffffff;line-height:56px;box-flex:1;flex:1;"></h1></div></div></div></div>',
    files: templateParams.htmlWebpackPlugin.files,
  });
};

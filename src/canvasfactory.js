const assert = require("assert").strict;
const Canvas = require("canvas");

/* Largely copied from https://github.com/mozilla/pdf.js/blob/55f55f58594b9a6947fecaabf8ef4e3b02002023/examples/node/pdf2png/pdf2png.js#L20 */
class NodeCanvasFactory {
    create(width, height) {
        assert(width > 0 && height > 0, "Invalid canvas size");

        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext("2d");

        return { canvas, context };
    }

    reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, "Canvas is not specified");
        assert(width > 0 && height > 0, "Invalid canvas size");

        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }

    destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    }
}

module.exports = { NodeCanvasFactory };

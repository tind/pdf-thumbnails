#!/usr/bin/env node

const { readFileSync, createWriteStream } = require("fs");
const { promisify } = require("util");
const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const { NodeCanvasFactory } = require("./canvasfactory");

const env = process.env.NODE_ENV || "development";

async function doProcessing() {
    let config = { jobs: [] };

    try {
        const contents = readFileSync(0, "utf-8");
        config = {...config, ...JSON.parse(contents)};
    } catch {
        return { success: false, message: "Could not parse config object", ...config };
    }

    const canvasFactory = new NodeCanvasFactory();
    const results = [];

    for (const {sourcePath, outputPath, page: pageNum = 1, maxWidth = 300, quality = 1.0 } of config.jobs) {
        let result = {
            sourcePath: sourcePath,
            outputPath: outputPath,
            success: false
        };

        try {
            const loadingTask = pdfjsLib.getDocument(sourcePath);
            const document = await loadingTask.promise;
            const page = await document.getPage(pageNum);

            let viewport = page.getViewport({ scale: 1.0 });
            const scale = viewport.width < maxWidth ? 1.0 : maxWidth / viewport.width;
            viewport = page.getViewport({ scale: scale });

            const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
            const renderContext = {
                canvasContext: canvasAndContext.context,
                viewport: viewport,
                canvasFactory: canvasFactory
            };

            const renderTask = page.render(renderContext);
            await renderTask.promise;

            const image = canvasAndContext.canvas.createJPEGStream({ quality: quality });
            const output = createWriteStream(outputPath);

            image.pipe(output);

            const writeTask = new Promise((resolve, reject) => {
                image.on("error", err => {
                    output.close();
                    reject(err);
                });

                output.on("error", reject);

                output.on("finish", () => {
                    resolve({ success: true });
                });
            });

            result = { ...result, ...await writeTask };
        } catch (error) {
            result.message = error.message || error;
        } finally {
            results.push(result);
        }
    }

    return {
        success: results.length ? results.every(r => r.success) : false,
        values: results
    };
}

doProcessing()
    .then(res => {
        process.stdout.write(JSON.stringify(res, null, 2));
        process.exit(res.success ? 0 : 1);
    });

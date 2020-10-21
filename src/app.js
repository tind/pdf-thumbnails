const { readFileSync, createWriteStream } = require("fs");
const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const { NodeCanvasFactory } = require("./canvasfactory");

const env = process.env.NODE_ENV || "development";

function doProcessing() {
    return new Promise((resolve, reject) => {
        let config

        try {
            const contents = readFileSync(0, "utf-8");
            config = JSON.parse(contents);
        } catch (error) {
            reject(error)
        }

        const processes = config.jobs.map(({sourcePath, outputPath, page = 1, maxWidth = 300, quality = 1.0}) => {
            const result = {
                sourcePath: sourcePath,
                outputPath: outputPath
            };

            return new Promise((resolve, reject) => {
                let loadingTask = pdfjsLib.getDocument(sourcePath);

                loadingTask.promise.then(document => {
                    document.getPage(page).then(page => {
                        let viewport = page.getViewport({ scale: 1.0 });
                        const scale = viewport.width < maxWidth ? 1.0 : maxWidth / viewport.width;
                        viewport = page.getViewport({ scale: scale });

                        const canvasFactory = new NodeCanvasFactory();
                        const canvasAndContext = canvasFactory.create(
                            viewport.width,
                            viewport.height
                        );

                        const renderContext = {
                            canvasContext: canvasAndContext.context,
                            viewport: viewport,
                            canvasFactory: canvasFactory
                        };
                
                        const renderTask = page.render(renderContext);
                        renderTask.promise.then(() => {
                            const image = canvasAndContext.canvas.createJPEGStream({ quality: quality });
                            const output = createWriteStream(outputPath);

                            image.pipe(output);
                
                            image.on("error", err => {
                                output.close();
                                reject({...result, success: false, message: err});
                            });

                            output.on("error", err => {
                                reject({...result, success: false, message: err});
                            });

                            output.on("finish", () => {
                                resolve({...result, success: true});
                            });
                        }).catch(err => reject({...result, success: false, message: err}));
                    });
                }).catch(reason => {
                    reject({...result, success: false, message: reason.message});
                });
            })
        });

        Promise.allSettled(processes).then(results => {
            const processes = results.map(result => result.value || result.reason);

            if (!results.every(result => result.status == "fulfilled")) {
                reject(processes);
            } else {
                resolve(processes);
            }
        });
    });
}

let input

doProcessing()
    .then(res => {
        process.stdout.write(JSON.stringify(res));
        process.exit(0);
    })
    .catch(res => {
        process.stdout.write(JSON.stringify(res));
        process.exit(1);
    });

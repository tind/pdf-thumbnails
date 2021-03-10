#!/usr/bin/env node

const { readFile, writeFile } = require("fs").promises;
const { basename, join } = require("path");
const { getThumbnail, NodeCanvasFactory } = require("./lib");

const { Command, InvalidOptionArgumentError } = require('commander');

const program = new Command();

function _parseInt(value, dummyPrevious) {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        throw new InvalidOptionArgumentError('Not a number.');
    }
    return parsedValue;
}

function _parseFloat(value, dummyPrevious) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
        throw new InvalidOptionArgumentError("Not a float.");
    }
    return parsedValue;
}

program
    .name("pdf-thumbnails")
    .description("Generate image thumbnails for PDFs")
    .requiredOption("-o, --output <dir>", "output directory")
    .option("-p, --pagenum <pagenum>", "page number", _parseInt, 1)
    .option("-w, --width <width>", "width", _parseInt, 300)
    .option("-q, --quality <quality>", "jpeg quality", _parseFloat, 1.0)
    .arguments("<file...>")
    .action(async (files, options, command) => {
        const canvasFactory = new NodeCanvasFactory();
        try {
            for (const file of files) {
                const outputPath = join(options.output, basename(file, ".pdf") + ".jpg");
                const contents = await readFile(file);
                const jpegBuffer = await getThumbnail(contents, options.pagenum, options.width, options.quality, canvasFactory);

                await writeFile(outputPath, jpegBuffer);
            }
        } catch (error) {
            console.error(error);
            process.exit(1)
        }
        process.exit(0);
    })
    .parseAsync();

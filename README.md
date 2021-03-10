# TIND PDF Thumbnails

[<img src="https://img.shields.io/github/workflow/status/tind/pdf-thumbnails/build_and_test/master?style=flat-square">](https://github.com/tind/pdf-thumbnails/actions?query=workflow%3Abuild_and_test)

TIND PDF Thumbnails is a Node.js program to generate thumbnails from PDF files. It leverages the battle tested [PDF.js](https://mozilla.github.io/pdf.js/) library.

## Usage

Clone the repository and run `npm install` to fetch dependencies. Run the program with `node src/app.js`. Here are the command line options and arguments:

```
Usage: pdf-thumbnails [options] <file...>

Generate image thumbnails for PDFs

Options:
  -o, --output <dir>       output directory
  -p, --pagenum <pagenum>  page number (default: 1)
  -w, --width <width>      width (default: 300)
  -q, --quality <quality>  jpeg quality (default: 1)
  -h, --help               display help for command
```

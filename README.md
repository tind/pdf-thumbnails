# TIND PDF Thumbnails

[<img src="https://img.shields.io/github/workflow/status/tind/pdf-thumbnails/build_and_test/master?style=flat-square">](https://github.com/tind/pdf-thumbnails/actions?query=workflow%3Abuild_and_test)

TIND PDF Thumbnails is a Node.js program to generate thumbnails from PDF files. It leverages the battle tested [PDF.js](https://mozilla.github.io/pdf.js/) library.

## Usage

Clone the repository and run `yarn install` to fetch dependencies. Run the program with `node src/app.js`. The program reads a config object from stdin which describes the processing:

```json
{
    "jobs": [
        {
            "sourcePath": "/tmp/some.pdf",
            "outputPath": "/tmp/some.jpg"
        },
        {
            "sourcePath": "/tmp/foo.pdf",
            "outputPath": "/tmp/foo.jpg"
        }
    ]
}
```

It returns a result object describing each job:

```json
[
    {
        "sourcePath": "/tmp/some.pdf",
        "outputPath": "/tmp/some.jpg",
        "success": true
    },
    {
        "sourcePath": "/tmp/foo.pdf",
        "outputPath": "/tmp/foo.jpg",
        "success": false,
        "message": "Could not find file"
    }
]
```

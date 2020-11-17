#!/usr/bin/env node

const { readFileSync } = require("fs");
const { processJobs } = require("./processJobs");

const env = process.env.NODE_ENV || "development";

async function doProcessing() {
    let config = { jobs: [] };

    try {
        const contents = readFileSync(0, "utf-8");
        config = {...config, ...JSON.parse(contents)};
    } catch {
        return { success: false, message: "Could not parse config object", ...config };
    }

    const results = await processJobs(config);

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

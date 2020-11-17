const assert = require("assert");

const { processJobs } = require("../src/processJobs");

describe("ProcessFeaturedArticle", function() {
    const config = {
        jobs: [
            {
                sourcePath: "test/Herja.pdf",
                outputPath: "test/Herja.jpg"
            }
        ]
    }

    it("should successfully generate from wikipedia featured article", async function() {
        const results = await processJobs(config);
        for (const result of results) {
            assert.ok(result.success);
        }
    })
})

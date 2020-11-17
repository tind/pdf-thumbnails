const assert = require("assert");

const { processJobs } = require("../src/processJobs");

describe("ProcessFeaturedArticle", function() {
    const config = {
        jobs: [
            {
                sourcePath: "https://en.wikipedia.org/api/rest_v1/page/pdf/Wikipedia%3AToday%27s_featured_article",
                outputPath: "processfeaturedarticle.jpg"
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

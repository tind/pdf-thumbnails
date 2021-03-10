const assert = require("assert");
const { readFile } = require("fs").promises;

const { getThumbnail } = require("../src/lib");

describe("ProcessFeaturedArticle", function() {
    it("should successfully generate from wikipedia featured article", async function() {
        const data = await readFile("test/Herja.pdf");
        const jpegBuffer = await getThumbnail(data);

        assert.strictEqual(jpegBuffer.length, 50627);
    });
});

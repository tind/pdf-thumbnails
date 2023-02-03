const assert = require("assert");
const path = require("path");

const { readFile, writeFile } = require("fs").promises;

const { getThumbnail } = require("../src/lib");

describe("ProcessFeaturedArticle", function () {
  it("should successfully generate from wikipedia featured article", async function () {
    const data = await readFile("test/Herja.pdf");
    const jpegBuffer = await getThumbnail(data);

    await writeFile(path.join(__dirname, "thumbnail.jpg"), jpegBuffer);

    assert.strictEqual(jpegBuffer.length, 51013);
  });
});

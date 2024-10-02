import assert from "assert";

import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readFile, writeFile } from "fs/promises";

import { getThumbnail } from "../src/lib.js";

describe("ProcessFeaturedArticle", function () {
  it("should successfully generate from wikipedia featured article", async function () {
    const data = await readFile("test/Herja.pdf");
    const jpegBuffer = await getThumbnail(new Uint8Array(data));

    await writeFile(path.join(__dirname, "thumbnail.jpg"), jpegBuffer);

    assert.strictEqual(jpegBuffer.length, 51133);
  });
});

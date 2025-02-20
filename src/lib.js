import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function getThumbnail(data, pageNum = 1, width = 300, quality = 1.0, standardFonts = "/tmp/fonts/") {
  const loadingTask = pdfjsLib.getDocument({
    data: data,
    standardFontDataUrl: standardFonts,
  });
  const document = await loadingTask.promise;
  const page = await document.getPage(pageNum);

  let viewport = page.getViewport({ scale: 1.0 });
  const scale = width / viewport.width;
  viewport = page.getViewport({ scale: scale });

  const canvasFactory = document.canvasFactory;
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport: viewport,
  };

  const renderTask = page.render(renderContext);
  await renderTask.promise;

  return canvasAndContext.canvas.toBuffer("image/jpeg", {
    quality: quality,
    chromaSubsampling: false,
  });
}

export { getThumbnail };

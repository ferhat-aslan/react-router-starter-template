const express = require("express");
const multer = require("multer");
const {PDFDocument} = require("pdf-lib");
const cors = require("cors");

const upload = multer();
const app = express();
app.use(cors());

// helper: parse ranges string like "1-3,5" into sorted array of zero-based indices
function parseRanges(rangesStr, totalPages) {
  const selected = new Set();
  if (!rangesStr || rangesStr.trim() === "") return selected;
  const parts = rangesStr.split(",");
  for (let raw of parts) {
    const part = raw.trim();
    if (!part) continue;
    if (part.includes("-")) {
      const [sStr, eStr] = part.split("-");
      const s = parseInt(sStr, 10);
      const e = parseInt(eStr, 10);
      if (isNaN(s) || isNaN(e))
        throw new Error(`Invalid range token: '${part}'`);
      const start = Math.max(1, s);
      const end = Math.min(totalPages, e);
      if (start > end) throw new Error(`Invalid range order: '${part}'`);
      for (let p = start - 1; p <= end - 1; p++) selected.add(p);
    } else {
      const p = parseInt(part, 10);
      if (isNaN(p)) throw new Error(`Invalid page number: '${part}'`);
      if (p >= 1 && p <= totalPages) selected.add(p - 1);
    }
  }
  return Array.from(selected).sort((a, b) => a - b);
}

app.post("/split-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({error: "No file uploaded"});
    if (
      req.file.mimetype !== "application/pdf" &&
      !req.file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return res.status(400).json({error: "Uploaded file must be a PDF"});
    }

    // read optional form fields
    const rangesStr =
      req.body && req.body.ranges ? String(req.body.ranges) : "";
    const mode =
      req.body && req.body.mode ? String(req.body.mode).toLowerCase() : "keep";

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pageCount = pdfDoc.getPageCount();

    // determine pages to include in the resulting single PDF
    let pagesToOutput;
    if (!rangesStr || rangesStr.trim() === "") {
      pagesToOutput = Array.from({length: pageCount}, (_, i) => i);
    } else {
      let selected;
      try {
        selected = parseRanges(rangesStr, pageCount);
      } catch (err) {
        return res.status(400).json({error: err.message});
      }
      if (mode === "keep") {
        pagesToOutput = selected;
      } else if (mode === "remove") {
        const selSet = new Set(selected);
        pagesToOutput = [];
        for (let i = 0; i < pageCount; i++)
          if (!selSet.has(i)) pagesToOutput.push(i);
      } else {
        return res
          .status(400)
          .json({error: "Invalid mode. Use 'keep' or 'remove'."});
      }
    }

    if (!pagesToOutput || pagesToOutput.length === 0) {
      return res
        .status(400)
        .json({error: "No pages selected after applying ranges/mode."});
    }

    // create a single PDF containing chosen pages
    const outPdf = await PDFDocument.create();
    const copiedPages = await outPdf.copyPages(pdfDoc, pagesToOutput);
    copiedPages.forEach((p) => outPdf.addPage(p));
    const outBytes = await outPdf.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="split.pdf"',
    });
    return res.send(Buffer.from(outBytes));
  } catch (err) {
    console.error("Error splitting PDF:", err);
    res.status(500).json({error: "Internal server error", detail: String(err)});
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Split PDF server listening on http://localhost:${PORT}`);
});

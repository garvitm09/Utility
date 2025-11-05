import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { PythonShell } from "python-shell";

/**
 * Use Multer middleware configuration:
 * - For PDF/Word: upload.single("file")
 * - For image-to-pdf: upload.array("images", 10)
 */

export const uploadAndConvertFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    let inputPaths: string[] = [];
    let outputPath: string;
    let scriptPath: string;

    // Handle file fields according to type
    if (type === "image-to-pdf") {
      // Multiple files expected for images
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ message: "No images uploaded" });
        return;
      }
      inputPaths = files.map(f => path.resolve(f.path));
    } else {
      // Single file expected for pdf/word
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      inputPaths = [path.resolve(file.path)];
    }

    // Create output directory if needed
    const outputDir = path.resolve("src/converted");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // Build output path and script path
    switch (type) {
      case "pdf-to-word":
        outputPath = path.join(outputDir, path.basename(inputPaths[0], ".pdf") + "_converted.docx");
        scriptPath = path.resolve("src/python_scripts/pdf_to_word.py");
        break;
      case "word-to-pdf":
        outputPath = path.join(outputDir, path.basename(inputPaths[0], ".docx") + "_converted.pdf");
        scriptPath = path.resolve("src/python_scripts/word_to_pdf.py");
        break;
      case "image-to-pdf":
        // e.g., use timestamp for uniq output name
        outputPath = path.join(outputDir, `images_${Date.now()}.pdf`);
        scriptPath = path.resolve("src/python_scripts/image_to_pdf.py"); // You need the python code from previous answer
        break;
      default:
        res.status(400).json({ message: "Invalid conversion type" });
        return;
    }

    // Prepare python args (all image paths for images-to-pdf, else single input file)
    const pythonArgs =
      type === "image-to-pdf" ? [...inputPaths, outputPath] : [inputPaths[0], outputPath];

    const options = {
      args: pythonArgs,
      pythonPath: "python", // change if needed
    };

    // Run Python script
    const results = await PythonShell.run(scriptPath, options);
    console.log("Python output:", results);

    res.status(200).json({
      message: "Conversion successful",
      output: outputPath,
    });
  } catch (error: any) {
    console.error("Conversion error:", error.message);
    res.status(500).json({
      message: "Conversion failed",
      error: error.message,
    });
  }
};








// import path from "path";
// import fs from "fs";
// import { Request, Response } from "express";
// import { PythonShell } from "python-shell";

// export const uploadAndConvertFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const file = req.file;
//     const {type} = req.body;
//     console.log(type)
//     if (!file) {
//       res.status(400).json({ message: "No file uploaded" });
//       return;
//     }

//     const inputPath = path.resolve(file.path);
//     const outputDir = path.resolve("src/converted");
//     if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

//     let outputPath: string;
//     let scriptPath: string;

//     switch (type) {
//       case "pdf-to-word":
//         outputPath = path.join(outputDir, path.basename(inputPath, ".pdf") + ".docx");
//         scriptPath = path.resolve("src/python_scripts/pdf_to_word.py");
//         break;
//       case "word-to-pdf":
//         outputPath = path.join(outputDir, path.basename(inputPath, ".docx") + ".pdf");
//         scriptPath = path.resolve("src/python_scripts/word_to_pdf.py");
//         break;
//       case "image-to-pdf":
//         outputPath = path.join(outputDir, path.basename(inputPath, path.extname(inputPath)) + ".pdf");
//         scriptPath = path.resolve("src/python/image_to_pdf.py");
//         break;
//       default:
//         res.status(400).json({ message: "Invalid conversion type" });
//         return;
//     }

//     console.log("Running Python script at:", scriptPath);
//     console.log("Input file:", inputPath);
//     console.log("Output file:", outputPath);

//     const options = {
//       mode: "text" as const,
//       pythonOptions: ["-u"],
//       args: [inputPath, outputPath],
//     };

//     // Run Python script
//     await new Promise((resolve, reject) => {
//       const pyshell = new PythonShell(scriptPath, options);

//       pyshell.on("message", (message) => {
//         console.log("Python:", message);
//       });

//       pyshell.end((err, code, signal) => {
//         if (err) reject(err);
//         else resolve(code);
//       });
//     });

//     console.log("✅ Conversion completed. Sending file back to client...");

//     // Send the converted file to client
//     res.download(outputPath, (err) => {
//       if (err) {
//         console.error("Error sending file:", err);
//         res.status(500).json({ message: "Failed to send file" });
//       }
//     });
//   } catch (error: any) {
//     console.error("Conversion error:", error);
//     res.status(500).json({
//       message: "File upload or conversion failed",
//       error: error.message,
//     });
//   }
// };




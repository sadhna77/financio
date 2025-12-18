import React, { useState } from "react";
import { RiImageAiFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner"


const OCRScanner = ({ ScannedData }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    product: "",
    amount: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setText("");
    setFormData({ product: "", amount: "", date: "" });
  };

  const handleScan = async () => {
    if (!image) {
      toast.error("Please uplaod image");

      return;
    }

    setLoading(true);
    const ocrData = new FormData();
    ocrData.append("file", image);
    ocrData.append("apikey", "K89846781188957"); // 🔑 Use your OCR.space key
    ocrData.append("language", "eng");

    try {
      // Step 1: OCR API Call
      const ocrRes = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: ocrData,
      });
      const ocrJson = await ocrRes.json();
      const ocrText = ocrJson.ParsedResults?.[0]?.ParsedText || "";
      setText(ocrText);

      // Step 2: GPT Prompting
      const prompt = `
      Extract the following details from the given receipt text:
      
      1. Product name (only the main item, like shoes, pizza, etc.)
      2. Total amount paid:
         - If the amount is in INR (₹, Rs., etc.), return the numeric value as-is.
         - If the amount is in another currency (like $, €, etc.), convert it to INR using the rate: 1 USD = 83 INR, and return only the converted numeric value.
         - Do NOT include any symbols (like ₹, Rs., $, etc.) in the amount. Return only the numeric value.
      
      3. Date of transaction (if not available, use today's date in DD/MM/YYYY format)
      
      Return only in this strict JSON format:
      {
        "product": "Product Name",
        "amount": "Amount Paid in INR (numeric only)",
        "date": "DD/MM/YYYY"
      }
      
      Receipt text:
      ${ocrText}
      `;

      const gptRes = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const gptData = await gptRes.json();
      const reply = gptData.choices[0]?.message?.content || "";
      const cleaned = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setFormData(parsed);

      // yaha se maine ye data parent ko bhej lifting up
      ScannedData(parsed);
    } catch (err) {
      console.error(err);
      alert("Something went wrong during OCR or GPT processing");
    }

    setLoading(false);
  };

  return (
    <div className="p-5 flex items-center flex-col font-winky">
      {!image && (
        <>
          <label htmlFor="image-upload" className="cursor-pointer text-4xl">
            <RiImageAiFill />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-xs mt-1">Upload bills/receipt</p>
        </>
      )}

      {image && (
        <>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded"
            className="w-8 h-8 object-cover rounded shadow-md"
          />

          <p className="text-[10px] text-white-600 mt-1">
            Uploaded: {image.name}
          </p>
        </>
      )}

      <button
        onClick={handleScan}
        className="bg-purple-400 hover:bg-blue-700 text-white p-2 rounded animate-bloom "
        disabled={loading}
      >
        {loading ? <FaSpinner className="animate-spin" /> : "Scan Receipt"}
      </button>
    </div>
  );
};

export default OCRScanner;

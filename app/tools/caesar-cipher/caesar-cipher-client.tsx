"use client";

import { useState, ChangeEvent } from "react";
import { caesarCipher } from "../../../lib/caesar-cipher";

export default function CaesarCipherClient() {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(13);
  const [decoded, setDecoded] = useState("");

  const handleEncode = () => {
    setDecoded(caesarCipher(text, { shift }));
  };

  const handleDecode = () => {
    setDecoded(caesarCipher(text, { shift, decode: true }));
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  return (
    <section className="container-responsive py-20 text-gray-900 space-y-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">
        Caesar Cipher
      </h1>
      <p className="text-center text-gray-700 max-w-2xl mx-auto mb-6">
        Encode or decode messages with a customizable shift. Only runs in your
        browser for complete privacy.
      </p>
      <div className="max-w-xl mx-auto space-y-4">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center gap-4">
          <label htmlFor="shift" className="font-medium text-gray-800">
            Shift
          </label>
          <input
            id="shift"
            type="number"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value, 10) || 0)}
            className="w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleEncode} className="btn-primary">
            Encode
          </button>
          <button onClick={handleDecode} className="btn-primary">
            Decode
          </button>
        </div>
        <textarea
          readOnly
          value={decoded}
          placeholder="Result"
          className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </section>
  );
}

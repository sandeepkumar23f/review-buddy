"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function Home() {
  const [code, setCode] = useState<string>("// Write your code here");
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Enter code first");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const res = await fetch(`${API_URL}/ai/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.success) setReview(data.review);
      else setReview("AI failed to review");

    } catch (error) {
      setReview("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">

        <h1 className="text-4xl font-bold text-center mb-6 text-green-400">
          ReviewBuddy AI
        </h1>


        <div className="border border-gray-700 rounded-xl overflow-hidden">
          <Editor
            height="420px"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleReview}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold text-black"
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        {/* Output */}
        {review && (
          <div className="mt-8 bg-[#0d0d0d] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-green-400">
              AI Review Result
            </h2>

            <pre className="whitespace-pre-wrap text-sm text-gray-300">
              {review}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

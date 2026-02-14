"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Enter your Code first");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const res = await fetch("http://localhost:3000/ai/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (data.success) {
        setReview(data.review);
      } else {
        setReview("AI failed to review code");
      }
    } catch (err) {
      setReview("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">

        <h1 className="text-4xl font-bold text-center mb-6">
          ReviewBuddy
        </h1>

        <textarea
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-72 bg-[#111] border border-gray-700 rounded-xl p-4 text-sm outline-none focus:border-green-400"
        />

        <button
          onClick={handleReview}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 transition-all py-3 rounded-xl font-semibold text-black"
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        {review && (
          <div className="mt-8 bg-[#0d0d0d] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-green-400">
              ReviewBuddy Result
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

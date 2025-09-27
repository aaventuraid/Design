"use client";

import React, { useState } from "react";
import { showToast } from "@/lib/toast";
import type { GeneratedCopy } from "@/lib/ai-service";

export default function CopyGenerator() {
  const [expanded, setExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    category: "makanan"
  });
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);

  const generateCopy = async () => {
    if (!formData.productName.trim()) {
      showToast("Nama produk harus diisi", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("Gagal generate copy");
      const result = await response.json();
      setGeneratedCopy(result);
      showToast("Copy berhasil dibuat!", "success");
    } catch (error) {
      showToast("Terjadi kesalahan saat membuat copy", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Berhasil disalin ke clipboard!", "success");
  };
  
  return (
    <section className="section-padding bg-gradient-to-br from-primary-blue/5 to-primary-orange/5">
      <div className="container-brand">
        <div className="card-elevated bg-white/90">
          <div className="p-8">
            <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
              <h3 className="text-2xl">Generator Copy AI</h3>
            </button>
          </div>
          
          {expanded && (
            <div className="p-8">
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="Nama produk"
                  className="w-full p-3 border rounded"
                />
                <button onClick={generateCopy} disabled={isGenerating} className="btn-primary">
                  {isGenerating ? "Generating..." : "Generate Copy"}
                </button>
              </div>
              
              {generatedCopy && (
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-orange-50 rounded">
                    <h4>Judul</h4>
                    <p>{generatedCopy.title}</p>
                    <button onClick={() => copyToClipboard(generatedCopy.title)}>Copy</button>
                  </div>
                  <div className="p-4 bg-blue-50 rounded">
                    <h4>Deskripsi</h4>
                    <p>{generatedCopy.description}</p>
                    <button onClick={() => copyToClipboard(generatedCopy.description)}>Copy</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

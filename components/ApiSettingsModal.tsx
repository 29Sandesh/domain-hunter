"use client";

import React, { useState } from "react";
import { X, Key, Check, ShieldCheck } from "lucide-react";

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export function ApiSettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}: ApiSettingsModalProps) {
  const [inputVal, setInputVal] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputVal.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputVal("");
    onSaveApiKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-in space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">AI Engine Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info */}
        <div className="text-xs text-slate-600 leading-relaxed">
          DomainHunter AI includes a built-in procedural naming brain that works with <strong>zero API keys</strong>.
          Optionally, enter your Google Gemini API Key below for high-entropy LLM creative brainstorming.
        </div>

        {/* Input */}
        <div>
          <label className="text-xs font-semibold text-slate-700">Google Gemini API Key (Optional)</label>
          <input
            type="password"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="AIzaSy..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Your key is stored locally in your browser and never sent to third-party databases.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {inputVal ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 hover:underline"
            >
              Remove Key
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700"
            >
              {saved ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{saved ? "Saved!" : "Save Key"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

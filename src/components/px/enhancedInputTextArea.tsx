"use client";

import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { pxEncodedPayload } from "@/components/px/constant/pxEncodedPayload";
import { pxDecodedPayload } from "@/components/px/constant/pxDecodedPayload";

interface EnhancedInputTextAreaProps {
  decode: boolean;
  payload: string;
  setStartPayload?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  title?: string;
}

export default function EnhancedInputTextArea({
  decode,
  payload,
  setStartPayload,
  disabled,
  title = "Input"
}: EnhancedInputTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (setStartPayload) {
        setStartPayload(text);
      }
    } catch (err) {
      console.error('Failed to paste text: ', err);
    }
  }, [setStartPayload]);

  const handleClear = useCallback(() => {
    if (setStartPayload) {
      setStartPayload('');
    }
  }, [setStartPayload]);

  const getPlaceholder = () => {
    return decode ? pxEncodedPayload : pxDecodedPayload;
  };

  return (
    <div className="flex flex-col basis-1/2 h-full min-w-0">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
        <div className="flex gap-1">
          <button
            onClick={handlePaste}
            disabled={disabled}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200
              ${!disabled 
                ? 'text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer' 
                : 'text-slate-500 cursor-not-allowed'
              }
            `}
            title="Paste from clipboard"
          >
            <ClipboardIcon className="w-3 h-3" />
            Paste
          </button>
          {payload && (
            <button
              onClick={handleClear}
              disabled={disabled}
              className={`
                flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200
                ${!disabled 
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer' 
                  : 'text-slate-500 cursor-not-allowed'
                }
              `}
              title="Clear input"
            >
              <XMarkIcon className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className={`
        flex-1 border rounded-lg overflow-hidden shadow-lg transition-all duration-200
        ${isFocused 
          ? 'border-primary-500 ring-2 ring-primary-500/20' 
          : 'border-slate-600'
        }
        ${disabled ? 'opacity-50' : ''}
      `}>
        <textarea
          className={`
            w-full h-full p-4 bg-slate-900 resize-none text-white font-mono text-sm
            focus:outline-none placeholder-slate-500 leading-relaxed
            whitespace-pre-wrap break-words
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          onChange={(e) => setStartPayload?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={getPlaceholder()}
          disabled={disabled}
          value={payload}
        />
      </div>

      {/* Footer with stats */}
      {payload && (
        <div className="mt-2 text-xs text-slate-400 flex justify-between">
          <span>
            {payload.split('\n').length} lines, {payload.length} characters
          </span>
          <span>
            {payload.length > 1000 ? 'Large payload' : 'Ready'}
          </span>
        </div>
      )}
    </div>
  );
}

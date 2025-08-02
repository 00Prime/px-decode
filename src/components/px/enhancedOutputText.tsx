"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from "./loadingSpinner";
import { pxEncodedPayload } from "@/components/px/constant/pxEncodedPayload";
import {
  pxDecodedPayload,
  pxOrderedDecodedPayload,
} from "@/components/px/constant/pxDecodedPayload";

interface EnhancedOutputTextProps {
  decode: boolean;
  finalPayload?: string;
  orderPayloadKey: boolean;
  title?: string;
  isProcessing?: boolean;
}

export default function EnhancedOutputText({
  decode,
  finalPayload,
  orderPayloadKey,
  title = "Output",
  isProcessing = false
}: EnhancedOutputTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!finalPayload) return;
    
    try {
      await navigator.clipboard.writeText(finalPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [finalPayload]);

  const getLanguage = () => {
    if (!finalPayload) return 'text';
    
    // Try to detect if it's JSON
    try {
      JSON.parse(finalPayload);
      return 'json';
    } catch {
      // If not JSON, check if it looks like encoded data
      if (finalPayload.length > 50 && !finalPayload.includes(' ')) {
        return 'text';
      }
      return 'text';
    }
  };

  const getPlaceholder = () => {
    return decode
      ? orderPayloadKey
        ? pxOrderedDecodedPayload
        : pxDecodedPayload
      : pxEncodedPayload;
  };

  return (
    <div className="flex flex-col basis-1/2 h-full">
      {/* Header with title and copy button */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {title}
          {isProcessing && <LoadingSpinner size="sm" />}
        </h3>
        <button
          onClick={handleCopy}
          disabled={!finalPayload || isProcessing}
          className={`
            flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200
            ${finalPayload && !isProcessing
              ? 'text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer' 
              : 'text-slate-500 cursor-not-allowed'
            }
          `}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 border border-slate-600 rounded-lg overflow-hidden bg-slate-900 shadow-lg relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-300">
              <LoadingSpinner size="md" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        )}
        
        {finalPayload ? (
          <SyntaxHighlighter
            language={getLanguage()}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '16px',
              background: 'rgb(15 23 42)', // slate-900
              fontSize: '13px',
              lineHeight: '1.4',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              height: '100%',
              overflow: 'auto',
            }}
            showLineNumbers={getLanguage() === 'json'}
            wrapLines={true}
            wrapLongLines={true}
          >
            {finalPayload}
          </SyntaxHighlighter>
        ) : (
          <div className="p-4 h-full">
            <pre className="text-slate-500 text-sm whitespace-pre-wrap font-mono">
              {getPlaceholder()}
            </pre>
          </div>
        )}
      </div>

      {/* Footer with stats */}
      {finalPayload && (
        <div className="mt-2 text-xs text-slate-400 flex justify-between">
          <span>
            {finalPayload.split('\n').length} lines, {finalPayload.length} characters
          </span>
          <span className="capitalize">
            {getLanguage()}
          </span>
        </div>
      )}
    </div>
  );
}

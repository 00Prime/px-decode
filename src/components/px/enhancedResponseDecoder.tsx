"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon, CheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from "./loadingSpinner";

interface EnhancedResponseDecoderProps {
  responsePayload: string;
  setResponsePayload: (value: string) => void;
  responseVersion: string;
  setResponseVersion: (value: string) => void;
  decodedResponse: string;
  showResponseDecoder: boolean;
  setShowResponseDecoder: (value: boolean) => void;
  isProcessing?: boolean;
}

export default function EnhancedResponseDecoder({
  responsePayload,
  setResponsePayload,
  responseVersion,
  setResponseVersion,
  decodedResponse,
  showResponseDecoder,
  setShowResponseDecoder,
  isProcessing = false
}: EnhancedResponseDecoderProps) {
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleCopyInput = useCallback(async () => {
    if (!responsePayload) return;
    
    try {
      await navigator.clipboard.writeText(responsePayload);
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [responsePayload]);

  const handleCopyOutput = useCallback(async () => {
    if (!decodedResponse) return;
    
    try {
      await navigator.clipboard.writeText(decodedResponse);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [decodedResponse]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setResponsePayload(text);
    } catch (err) {
      console.error('Failed to paste text: ', err);
    }
  }, [setResponsePayload]);

  const isValidJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="mb-8">
      {/* Toggle Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowResponseDecoder(!showResponseDecoder)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {showResponseDecoder ? (
            <>
              <EyeSlashIcon className="w-4 h-4" />
              Hide Response Decoder
            </>
          ) : (
            <>
              <EyeIcon className="w-4 h-4" />
              Show Response Decoder
            </>
          )}
        </button>
      </div>

      {/* Response Decoder Section */}
      {showResponseDecoder && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary-300 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            PerimeterX Response Decoder
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          </h2>
          
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white">
                  Response Payload
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={handlePaste}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                    title="Paste from clipboard"
                  >
                    <ClipboardIcon className="w-3 h-3" />
                    Paste
                  </button>
                  <button
                    onClick={handleCopyInput}
                    disabled={!responsePayload}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200
                      ${responsePayload 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer' 
                        : 'text-slate-500 cursor-not-allowed'
                      }
                    `}
                    title="Copy payload"
                  >
                    {copiedInput ? (
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
              </div>
              <textarea
                value={responsePayload}
                onChange={(e) => setResponsePayload(e.target.value)}
                placeholder="Enter base64 encoded response payload..."
                className="w-full h-32 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Version
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={responseVersion}
                  onChange={(e) => setResponseVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <div className="flex flex-wrap gap-1">
                  {['1.0.0', '2.0.0', '3.0.0'].map((version) => (
                    <button
                      key={version}
                      onClick={() => setResponseVersion(version)}
                      className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
                        responseVersion === version
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white'
                      }`}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                API version (cached)
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-white flex items-center gap-2">
                Decoded Response
                {isProcessing && <LoadingSpinner size="sm" />}
              </label>
              <button
                onClick={handleCopyOutput}
                disabled={!decodedResponse || isProcessing}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200
                  ${decodedResponse && !isProcessing 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer' 
                    : 'text-slate-500 cursor-not-allowed'
                  }
                `}
                title="Copy decoded response"
              >
                {copiedOutput ? (
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

            <div className="border border-slate-600 rounded-lg overflow-hidden bg-slate-900 shadow-lg relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-slate-300">
                    <LoadingSpinner size="md" />
                    <span className="text-sm font-medium">Decoding response...</span>
                  </div>
                </div>
              )}
              
              {decodedResponse ? (
                isValidJson(decodedResponse) ? (
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '16px',
                      background: 'rgb(15 23 42)',
                      fontSize: '13px',
                      lineHeight: '1.4',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      minHeight: '200px',
                      maxHeight: '400px',
                      overflow: 'auto',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {decodedResponse}
                  </SyntaxHighlighter>
                ) : (
                  <div className="p-4 min-h-[200px] max-h-[400px] overflow-auto">
                    <pre className="text-red-400 text-sm whitespace-pre-wrap font-mono">
                      {decodedResponse}
                    </pre>
                  </div>
                )
              ) : (
                <div className="p-4 min-h-[200px]">
                  <pre className="text-slate-500 text-sm font-mono">
                    Decoded response will appear here...
                  </pre>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            {decodedResponse && (
              <div className="mt-2 text-xs text-slate-400 flex justify-between">
                <span>
                  {decodedResponse.split('\n').length} lines, {decodedResponse.length} characters
                </span>
                <span className={`font-medium ${
                  decodedResponse.startsWith('Error:') || decodedResponse.startsWith('Failed') 
                    ? 'text-red-400' 
                    : isValidJson(decodedResponse) 
                      ? 'text-green-400' 
                      : 'text-yellow-400'
                }`}>
                  {decodedResponse.startsWith('Error:') || decodedResponse.startsWith('Failed') 
                    ? 'Error' 
                    : isValidJson(decodedResponse) 
                      ? 'Valid JSON' 
                      : 'Plain Text'
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

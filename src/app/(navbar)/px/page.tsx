"use client";

import SettingToolBar from "@/components/px/settingToolbar";
import EnhancedInputTextArea from "@/components/px/enhancedInputTextArea";
import EnhancedOutputText from "@/components/px/enhancedOutputText";
import EnhancedResponseDecoder from "@/components/px/enhancedResponseDecoder";
import { ChangeEvent, useEffect, useMemo, useState, useCallback } from "react";
import { mode } from "@/components/px/constant/mode";
import obfuscatePayload from "@/module/px/js/encode";
import deobfuscate from "@/module/px/js/decode";
import { decodeResponse, parsePxResponse } from "@/module/px/js/obDecode";

export default function Px() {
  const [decode, setDecode] = useState(true);
  const [uuid, setUuid] = useState("");
  const [sts, setSts] = useState("");
  const [startPayload, setStartPayload] = useState("");
  const [finalPayload, setFinalPayload] = useState("");
  const [payload, setPayload] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [orderPayloadKey, setOrderPayloadKey] = useState(false);
  const [orderedFinalPayload, setOrderedFinalPayload] = useState("");

  // Response decoder states
  const [responsePayload, setResponsePayload] = useState("");
  const [responseVersion, setResponseVersion] = useState("");
  const [decodedResponse, setDecodedResponse] = useState("");
  const [showResponseDecoder, setShowResponseDecoder] = useState(true);
  const [isResponseProcessing, setIsResponseProcessing] = useState(false);

  // Load cached response version and decoder visibility on component mount
  useEffect(() => {
    const cachedVersion = localStorage.getItem('px-response-version');
    const cachedShowDecoder = localStorage.getItem('px-show-response-decoder');
    
    setResponseVersion(cachedVersion || "1.0.0");
    setShowResponseDecoder(cachedShowDecoder ? JSON.parse(cachedShowDecoder) : true);
  }, []);

  // Cache response version whenever it changes
  const updateResponseVersion = useCallback((version: string) => {
    setResponseVersion(version);
    localStorage.setItem('px-response-version', version);
  }, []);

  // Cache response decoder visibility whenever it changes
  const updateShowResponseDecoder = useCallback((show: boolean) => {
    setShowResponseDecoder(show);
    localStorage.setItem('px-show-response-decoder', JSON.stringify(show));
  }, []);

  const updateUuid = (props?: ChangeEvent<HTMLInputElement>, sent?: string) => {
    if (sent) {
      setUuid(() => sent);
    } else {
      setUuid(() => props!.target.value);
    }
  };

  const updateSts = (props?: ChangeEvent<HTMLInputElement>, sent?: string) => {
    if (sent) {
      setSts(() => sent);
    } else {
      setSts(() => props!.target.value);
    }
  };

  useEffect(() => {
    if (mode) {
      if (startPayload.includes("payload")) {
        try {
          const ParsedUuid: RegExpMatchArray | null =
            startPayload.match(`uuid=(.*)&ft`);
          if (ParsedUuid) {
            updateUuid(undefined, ParsedUuid[1]);
          }
          const ParsedPayload: RegExpMatchArray | null =
            startPayload.match(`payload=(.*)&appId`);
          if (ParsedPayload) {
            setPayload(() => ParsedPayload[1]);
          }
        } catch (error) {}
      } else {
        setPayload(() => startPayload);
      }
    } else {
      try {
        const payload = startPayload;

        setPayload(() => payload);
        const regex = /"PX10206":"(.*?)","/gm;
        let m;
        while (
          (m = regex.exec(JSON.stringify(JSON.parse(startPayload)))) !== null
        ) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }

          m.forEach((match) => {
            if (match.length === 36) {
              updateUuid(undefined, match);
              return;
            }
          });
        }
      } catch (error) {}
    }
  }, [startPayload]);

  const updateFinalPayload = (value: string) => {
    setFinalPayload(() => value);
  };

  useEffect(() => {
    setPayload(() => "");
    setStartPayload(() => "");
    setFinalPayload(() => "");
    setOrderedFinalPayload(() => "");
    setSts(() => "");
    setUuid(() => "");
    setResponsePayload(() => "");
    setDecodedResponse(() => "");
    setIsProcessing(false);
    setIsResponseProcessing(false);
  }, [decode]);

  useEffect(() => {
    const processPayload = async () => {
      if (payload === "") {
        updateFinalPayload("");
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      
      // Add a small delay to show the processing state
      await new Promise(resolve => setTimeout(resolve, 100));

      if (decode) {
        try {
          const decodedPayload = JSON.parse(deobfuscate(payload, uuid, sts));
          updateFinalPayload(JSON.stringify(decodedPayload, null, 4));

          for (let i = 0; i < Object.keys(decodedPayload).length; i++) {
            const orderedKey = Object.keys(decodedPayload[i]["d"])
              .sort()
              .reduce((obj, key) => {
                // @ts-ignore
                obj[key] = decodedPayload[i]["d"][key];
                return obj;
              }, {});
            decodedPayload[i]["d"] = orderedKey;
          }
          setOrderedFinalPayload(JSON.stringify(decodedPayload, null, 4));
        } catch (error) {
          updateFinalPayload(deobfuscate(payload, uuid, sts));
        }
      } else {
        try {
          updateFinalPayload(
            obfuscatePayload(JSON.stringify(JSON.parse(payload)), uuid, sts)
          );
        } catch (error) {
          if (payload == "") {
          } else {
            updateFinalPayload("Invalid JSON format");
          }
        }
      }
      
      setIsProcessing(false);
    };

    processPayload();
  }, [payload, uuid, sts]);

  // Response decoder effect
  useEffect(() => {
    const processResponse = async () => {
      if (responsePayload.trim() === "") {
        setDecodedResponse("");
        setIsResponseProcessing(false);
        return;
      }

      setIsResponseProcessing(true);
      
      // Add a small delay to show the processing state
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const decoded = decodeResponse(responsePayload, responseVersion);
        if (decoded) {
          const parsed = parsePxResponse(decoded);
          setDecodedResponse(JSON.stringify(parsed, null, 2));
        } else {
          setDecodedResponse("Failed to decode response payload");
        }
      } catch (error) {
        setDecodedResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      setIsResponseProcessing(false);
    };

    processResponse();
  }, [responsePayload, responseVersion]);

  return (
    <main className={"container h-5/6 mx-auto mb-auto px-3"}>
      <div className={"w-full h-full relative"}>
        {/* Main Header */}
        <div className="text-center mb-8">
          <h1 className={"text-4xl font-bold text-primary-300 mb-2"}>
            PerimeterX Payload {decode ? "Decoder" : "Encoder"}
          </h1>
          <p className="text-slate-400 text-lg">
            {decode 
              ? "Decode obfuscated PerimeterX payloads into readable JSON" 
              : "Encode JSON payloads into PerimeterX format"
            }
          </p>
        </div>

        {/* Enhanced Response Decoder */}
        <EnhancedResponseDecoder
          responsePayload={responsePayload}
          setResponsePayload={setResponsePayload}
          responseVersion={responseVersion}
          setResponseVersion={updateResponseVersion}
          decodedResponse={decodedResponse}
          showResponseDecoder={showResponseDecoder}
          setShowResponseDecoder={updateShowResponseDecoder}
          isProcessing={isResponseProcessing}
        />

        {/* Main Decoder/Encoder Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <SettingToolBar
            setDecode={setDecode}
            decode={decode}
            sts={sts}
            setSts={setSts}
            uuid={uuid}
            setUuid={setUuid}
            orderPayloadKey={orderPayloadKey}
            setOrderPayloadKey={setOrderPayloadKey}
            startPayload={startPayload}
            shareMode={false}
          />
          
          <div className={"flex md:flex-row flex-col gap-6 p-6 h-full min-h-[500px]"}>
            <EnhancedInputTextArea
              decode={decode}
              payload={payload}
              setStartPayload={setStartPayload}
              disabled={false}
              title={decode ? "Encoded Payload" : "JSON Payload"}
            />
            <EnhancedOutputText
              orderPayloadKey={orderPayloadKey}
              decode={decode}
              finalPayload={
                orderPayloadKey ? orderedFinalPayload : finalPayload
              }
              title={decode ? "Decoded JSON" : "Encoded Payload"}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

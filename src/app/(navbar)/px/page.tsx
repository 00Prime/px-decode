"use client";

import SettingToolBar from "@/components/px/settingToolbar";
import InputTextArea from "@/components/px/inputTextArea";
import OutputText from "@/components/px/outputText";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

  const [orderPayloadKey, setOrderPayloadKey] = useState(false);
  const [orderedFinalPayload, setOrderedFinalPayload] = useState("");

  // Response decoder states
  const [responsePayload, setResponsePayload] = useState("");
  const [responseVersion, setResponseVersion] = useState("1.0.0");
  const [decodedResponse, setDecodedResponse] = useState("");
  const [showResponseDecoder, setShowResponseDecoder] = useState(true);

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
  }, [decode]);

  useEffect(() => {
    if (decode) {
      try {
        if (payload == "") {
          updateFinalPayload("");
        }

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
          updateFinalPayload("Invalid Json");
        }
      }
    }
  }, [payload, uuid, sts]);

  // Response decoder effect
  useEffect(() => {
    if (responsePayload.trim() === "") {
      setDecodedResponse("");
      return;
    }

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
  }, [responsePayload, responseVersion]);

  return (
    <main className={"container h-5/6 mx-auto mb-auto px-3"}>
      <div className={"w-full h-full relative"}>
        <h1 className={"text-center text-3xl font-bold text-primary-300 mb-6"}>
          PerimeterX Payload {decode ? "Decode" : "Encode"}
        </h1>

        {/* Toggle for Response Decoder */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowResponseDecoder(!showResponseDecoder)}
            className="btn btn-primary"
          >
            {showResponseDecoder ? "Hide" : "Show"} Response Decoder
          </button>
        </div>

        {/* Response Decoder Section */}
        {showResponseDecoder && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-center mb-4 text-primary-300">PerimeterX Response Decoder</h2>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-2">
                  Response Payload
                </label>
                <textarea
                  value={responsePayload}
                  onChange={(e) => setResponsePayload(e.target.value)}
                  placeholder="Enter base64 encoded response payload..."
                  className="w-full h-32 p-3 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="w-48">
                <label className="block text-sm font-medium text-white mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={responseVersion}
                  onChange={(e) => setResponseVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Decoded Response
              </label>
              <textarea
                value={decodedResponse}
                readOnly
                placeholder="Decoded response will appear here..."
                className="w-full h-48 p-3 bg-slate-900 border border-slate-600 rounded-md text-primary-300 placeholder-slate-500 resize-none font-mono text-sm"
              />
            </div>
          </div>
        )}

        <div className="card h-full relative">
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
          ></SettingToolBar>
          <div className={"flex md:flex-row flex-col gap-6 px-4 h-full pb-20"}>
            <InputTextArea
              decode={decode}
              payload={payload}
              setStartPayload={setStartPayload}
              disabled={false}
            ></InputTextArea>
            <OutputText
              orderPayloadKey={orderPayloadKey}
              decode={decode}
              finalPayload={
                orderPayloadKey ? orderedFinalPayload : finalPayload
              }
            ></OutputText>
          </div>
        </div>
      </div>
    </main>
  );
}

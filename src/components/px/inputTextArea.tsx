import { pxEncodedPayload } from "@/components/px/constant/pxEncodedPayload";
import { pxDecodedPayload } from "@/components/px/constant/pxDecodedPayload";
import { Dispatch, SetStateAction } from "react";
export default function InputTextArea({
  decode,
  payload,
  setStartPayload,
  disabled,
}: {
  decode: boolean;
  payload: string;
  setStartPayload?: Dispatch<SetStateAction<string>>;
  disabled: boolean;
}) {
  return (
    <textarea
      className={
        "bg-slate-900 border border-slate-700 basis-1/2 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-transparent resize-none text-white p-3 h-full shadow-md"
      }
      // @ts-ignore
      onChange={(e) => setStartPayload(e.target.value)}
      placeholder={decode ? pxEncodedPayload : pxDecodedPayload}
      disabled={disabled}
      value={payload}
    ></textarea>
  );
}

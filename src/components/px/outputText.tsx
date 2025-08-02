import { pxEncodedPayload } from "@/components/px/constant/pxEncodedPayload";
import {
  pxDecodedPayload,
  pxOrderedDecodedPayload,
} from "@/components/px/constant/pxDecodedPayload";

export default function OutputText({
  decode,
  finalPayload,
  orderPayloadKey,
}: {
  decode: boolean;
  finalPayload?: string;
  orderPayloadKey: boolean;
}) {
  return (
    <textarea
      className={
        "bg-slate-900 border border-slate-700 basis-1/2 rounded-md focus:ring-0 focus:outline-0 resize-none text-primary-300 font-mono p-3 shadow-md"
      }
      placeholder={
        decode
          ? orderPayloadKey
            ? pxOrderedDecodedPayload
            : pxDecodedPayload
          : pxEncodedPayload
      }
      disabled={true}
      value={finalPayload}
    ></textarea>
  );
}

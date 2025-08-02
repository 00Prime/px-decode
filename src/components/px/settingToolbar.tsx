import SettingButton from "@/components/px/settingButton";
import { Dropdown } from "@/components/px/dropdown";
import { Dispatch, SetStateAction } from "react";
import JsonOrderToggleButton from "@/components/px/jsonOrderToggleButton";
import ShareButton from "@/components/px/shareButton";
import DeleteButton from "@/components/px/deleteButton";

export default function SettingToolBar({
  decode,
  setDecode,
  sts,
  setSts,
  uuid,
  setUuid,
  orderPayloadKey,
  setOrderPayloadKey,
  startPayload,
  shareMode,
  IsOwner,
}: {
  decode: boolean;
  setDecode: Dispatch<SetStateAction<boolean>>;
  sts: string;
  setSts: Dispatch<SetStateAction<string>>;
  uuid: string;
  setUuid: Dispatch<SetStateAction<string>>;
  orderPayloadKey: boolean;
  setOrderPayloadKey: Dispatch<SetStateAction<boolean>>;
  startPayload: string;
  shareMode: boolean;
  IsOwner?: boolean;
}) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <Dropdown
            decode={decode}
            setDecode={setDecode}
            disabled={shareMode}
          />
          <SettingButton
            buttonTitle={"UUID"}
            value={uuid}
            setValue={setUuid}
            disabled={shareMode}
          />
          <SettingButton
            buttonTitle={"STS"}
            value={sts}
            setValue={setSts}
            disabled={shareMode}
          />
          <JsonOrderToggleButton
            orderPayloadKey={orderPayloadKey}
            setOrderPayloadKey={setOrderPayloadKey}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {shareMode ? (
            IsOwner ? (
              <DeleteButton />
            ) : null
          ) : (
            <ShareButton decode={decode} payload={startPayload} />
          )}
        </div>
      </div>
    </div>
  );
}

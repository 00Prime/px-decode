"use client";
import { Dispatch, SetStateAction, useEffect } from "react";

import { Switch } from "@headlessui/react";

export default function JsonOrderToggleButton({
  orderPayloadKey,
  setOrderPayloadKey,
}: {
  orderPayloadKey: boolean;
  setOrderPayloadKey: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    // if (localStorage.getItem("orderPayloadKey") == null) {
    //   localStorage.setItem("orderPayloadKey", "false");
    // } else if (localStorage.getItem("orderPayloadKey") == "true") {
    //   setOrderPayloadKey(true);
    // }

    localStorage.setItem("orderPayloadKey", orderPayloadKey.toString());
  }, [orderPayloadKey]);

  return (
    <div className={"flex items-center"}>
      <p className={"text-primary-300 font-medium text-sm mr-2"}>
        {"Order Keys"}
      </p>
      <div>
        <Switch
          checked={orderPayloadKey}
          onChange={setOrderPayloadKey}
          className={`border border-primary-600 relative inline-flex h-[32px] w-[116px] items-center rounded-md shadow-md`}
        >
          <span
            className={`${
              orderPayloadKey ? "translate-x-[-1px]" : "translate-x-[60px]"
            } inline-block h-[30px] w-[55px] transform transition-all duration-200 relative bg-primary-600 rounded-md`}
          />
          <div
            className={"flex justify-between text-white w-full absolute px-4"}
          >
            <span className={orderPayloadKey ? "font-medium" : "text-slate-500"}>Yes</span>
            <span className={orderPayloadKey ? "text-slate-500" : "font-medium"}>No</span>
          </div>
        </Switch>
      </div>
    </div>
  );
}

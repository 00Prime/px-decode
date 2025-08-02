import { ChangeEvent, Dispatch, SetStateAction } from "react";

export default function SettingButton({
  buttonTitle,
  value,
  setValue,
  disabled,
}: {
  buttonTitle: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled: boolean;
}) {
  return (
    <div className="flex justify-start items-center">
      <label
        htmlFor={buttonTitle}
        className="mr-2 block text-sm font-medium text-primary-300"
      >
        {buttonTitle}
      </label>
      <div className="rounded-md shadow-md w-full">
        <input
          type="text"
          disabled={disabled}
          name={buttonTitle}
          className="block w-full rounded-md border border-slate-600 bg-slate-800 py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder={buttonTitle == "sts" ? "1651526936831" : "uuid"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

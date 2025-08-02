import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { mode } from "@/components/px/constant/mode";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function Dropdown({
  decode,
  setDecode,
  disabled,
}: {
  decode: boolean;
  setDecode: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
}) {
  return (
    <Listbox value={decode} onChange={setDecode} disabled={disabled}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="cursor-pointer rounded-md border border-slate-600 bg-slate-800 py-2 pl-3 pr-10 text-left sm:text-sm text-white w-full hover:border-primary-400 transition-colors">
              <span className="flex items-center">
                <span className="ml-2 block truncate font-medium">
                  {decode ? "Decode" : "Encode"}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-primary-600 focus:outline-none sm:text-sm">
                {mode.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-primary-600 text-white" : "text-slate-200",
                        "relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors"
                      )
                    }
                    value={option.id ? true : false}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-2 block truncate"
                            )}
                          >
                            {option.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-primary-300",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

export { Dropdown };

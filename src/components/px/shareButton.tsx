import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/navigation";

const ttlOptions = [
  { time: "1 hour", hourValue: 1 },
  { time: "12 hour", hourValue: 12 },
  { time: "1 day", hourValue: 24 },
  { time: "1 month", hourValue: 24 * 30 },
  { time: "Never", hourValue: 0 },
];

export default function ShareButton({
  payload,
  decode,
}: {
  payload: string;
  decode: boolean;
}) {
  const router = useRouter();

  const handleSelect = (ttlValue: number) => {
    if (payload == "") {
      return;
    }
    fetch(`/api/px/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ttl: ttlValue,
        payload: Buffer.from(payload, "utf8").toString("base64"),
        decode: decode,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          console.log(r.error);
        } else {
          router.push("/px/" + r.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className="flex items-center space-x-4">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center space-x-2 px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-opacity-75 text-sm text-white font-medium transition-all shadow-md">
            <ArrowTopRightOnSquareIcon
              className="h-4 w-4 mr-1 text-white group-hover:text-white"
              aria-hidden="true"
            />
            <span>Share</span>
          </Menu.Button>
        </div>
        <div>
          <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-slate-700 rounded-md bg-slate-800 shadow-lg ring-1 ring-primary-500 ring-opacity-50 focus:outline-none">
            {ttlOptions.map((option, i) => (
              <div className="px-1 py-1" key={i}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-primary-600 text-white" : "text-slate-200"
                      } group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors`}
                      onClick={() => handleSelect(option.hourValue)}
                    >
                      {option.time}
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </div>
      </Menu>
    </div>
  );
}

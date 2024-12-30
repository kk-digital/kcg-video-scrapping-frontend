import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col gap-4 items-center justify-center">
      <Link href="/ingress-video">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Ingress Videos
        </button>
      </Link>
      <Link href="/">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Video Channels(NOT COMPLETED)
        </button>
      </Link>
    </div>
  );
}

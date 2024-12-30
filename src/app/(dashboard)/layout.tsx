import DiskSpaceUsage from "@/components/DiskSpaceUsage/DiskSpaceUsage";
import ScrappingStatus from "@/components/ScrappingStatus/ScrappingStatus";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex flex-col gap-2  p-4 overflow-auto">
        <div className="flex-1 flex overflow-auto shadow-lg rounded-lg">
          {/* <div className="w-96 bg-red-50"></div> */}
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-auto">{children}</div>
        </div>
        <div className="flex items-center justify-between bg-white border-gray-100 rounded-lg p-1">
          <ScrappingStatus />
          <DiskSpaceUsage totalSpace={1000} usedSpace={750} />
        </div>
      </div>
    </>
  );
}

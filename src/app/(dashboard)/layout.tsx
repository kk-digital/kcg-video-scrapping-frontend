import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex flex-col gap-2  p-4 overflow-auto">
        <div className="flex-1 flex overflow-auto shadow-lg rounded-lg">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-auto">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
}

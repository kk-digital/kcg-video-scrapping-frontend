import { QUERY_STATUS } from "@/types/enums";
import QueryProcessingView from "@/views/QueryView";

export default function Page() {
  return <QueryProcessingView status={QUERY_STATUS.PENDING} />;
}

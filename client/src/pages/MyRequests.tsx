import { RequestCard } from "@/components/ui/request-card";

interface MyReqProps {
    data: Request[];
  }

export const MyRequests = ({ data }: MyReqProps) => {


    return (<>
    
        {/* Recent Requests */}
        <div className="space-y-4">
                {data.map((req) => (
                    <RequestCard key={req.id} request={req} />
                ))}
            </div>
    
    </>);

}
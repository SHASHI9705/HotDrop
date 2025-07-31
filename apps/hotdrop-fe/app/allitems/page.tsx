import { Suspense } from "react";
import AllItemsContent from "./AllItemsContent";

export default function AllItemsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllItemsContent />
    </Suspense>
  );
}

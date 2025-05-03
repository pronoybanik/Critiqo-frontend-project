interface ReviewCardProps {
    status: 'pending' | 'published' | 'unpublished';
  }
  
  export default function ReviewCard({ status }: ReviewCardProps) {
    // Mock example card
    return (
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col gap-2 border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sample Review Title</h2>
          <span className="text-sm text-gray-500 capitalize">{status}</span>
        </div>
        <p className="text-sm text-gray-600">Short description of the review...</p>
        <div className="flex justify-between items-center mt-2">
          <button className="text-green-600 hover:underline">Approve</button>
          <button className="text-red-600 hover:underline">Unpublish</button>
          <button className="text-gray-600 hover:underline">Moderate</button>
        </div>
      </div>
    );
  }
  
export default function ReviewAnalytics() {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow mt-6">
        <h3 className="font-semibold text-lg mb-4">Analytics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">Total Reviews: 120</div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">Published: 87</div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">Revenue: $2,340</div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">Most Popular: "X Review"</div>
        </div>
      </div>
    );
  }
  
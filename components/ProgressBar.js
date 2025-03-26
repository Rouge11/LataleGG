export default function ProgressBar({ min, max }) {
    const widthMin = Math.min(100, min);
    const widthMax = Math.min(100, max);
  
    return (
      <div className="w-full bg-gray-200 rounded h-4 relative">
        <div
          className="absolute top-0 left-0 h-4 bg-purple-500 rounded"
          style={{ width: `${widthMax}%`, zIndex: 1 }}
        />
        <div
          className="absolute top-0 left-0 h-4 bg-purple-800 rounded"
          style={{ width: `${widthMin}%`, zIndex: 2 }}
        />
      </div>
    );
  }
  
"use client";
export default function TopBar() {
  return (
    <div className="bg-white border-b-2 border-gray-300 shrink-0">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">GridLAB-D Cloud</h1>
          <div className="flex space-x-4 text-sm">
            {['File','Edit','View','Run','Help'].map(i => <button key={i} className="hover:text-[#ea580b]">{i}</button>)}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Ready</span>
          <button className="bg-[#ea580b] text-white px-4 py-1 text-sm font-semibold hover:bg-orange-700">Sign In</button>
        </div>
      </div>
    </div>
  );
}

// app/(marketing)/components/DemoVideo.js
// Replace src with your optimized MP4/WebM (<= ~2.5MB), provide poster for LCP.
export default function DemoVideo() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">See it in action</h2>
        <div className="mt-6">
          <video
            className="w-full aspect-video bg-black"
            controls
            preload="metadata"
            poster="/videos/demo-poster.jpg"
          >
            <source src="/videos/demo.webm" type="video/webm" />
            <source src="/videos/demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

export default function Researchers() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dti7egpsg/image/upload/c_fill,g_auto,h_250,w_970/b_rgb:000000,e_gradient_fade,y_-0.50/c_scale,co_rgb:ffffff,fl_relative,l_text:montserrat_25_style_light_align_center:Shop%20Now,w_0.5,y_0.18/v1757647179/SARAL%20Systems%20Blog/university_onk4zk.webp')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-white/75" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-end">
          <div className="w-full md:w-2/3 lg:w-1/2 text-right">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Ready for Researchers</h2>
            <p className="text-xl text-gray-700">
              Prototype quickly, run large scenario batches, and publish reproducible studies with
              modern collaboration tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";

export default function FeatureCard({ icon, title, children, imageSrc, imageAlt = "", delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="bg-white border border-gray-200 rounded-none p-6 transition-all duration-300 h-full">
        {imageSrc ? (
                      <div className="mb-4 overflow-hidden rounded-none border border-gray-200">
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className="w-full h-32 object-cover transform hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : null}
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-none mb-4 border border-orange-200">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
      </div>
    </Reveal>
  );
}


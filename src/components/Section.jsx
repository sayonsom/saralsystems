import Reveal from "./Reveal";

export default function Section({ children, className = "", id, disableReveal = false, fullBleed = false }) {
  const content = fullBleed ? (
    children
  ) : (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  );

  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      {disableReveal ? content : <Reveal>{content}</Reveal>}
    </section>
  );
}


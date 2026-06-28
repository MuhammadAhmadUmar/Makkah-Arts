const features = [
  {
    title: "Cash on Delivery",
    description:
      "Pay when your order arrives. Available nationwide across Pakistan.",
  },
  {
    title: "Authentic Lawn Fabric",
    description:
      "Premium quality lawn sourced from trusted suppliers in Faisalabad.",
  },
  {
    title: "Honest Availability",
    description:
      "We never show fake stock. Every status reflects real inventory.",
  },
  {
    title: "WhatsApp Support",
    description:
      "Order assistance and styling help via WhatsApp — fast and personal.",
  },
];

export function WhyShopWithUs() {
  return (
    <section className="container-main py-16 md:py-24">
      <p className="text-xs tracking-[0.25em] text-muted uppercase">
        The Makkah Arts Promise
      </p>
      <h2 className="mt-2 font-serif text-3xl md:text-4xl">Why Shop With Us</h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="border border-border bg-white p-6">
            <h3 className="font-serif text-xl">{feature.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

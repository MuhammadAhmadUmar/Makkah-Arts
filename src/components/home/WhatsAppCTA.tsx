import { WHATSAPP_NUMBER } from "@/lib/constants";

export function WhatsAppCTA() {
  return (
    <section className="bg-foreground py-16 text-background md:py-20">
      <div className="container-main text-center">
        <h2 className="font-serif text-3xl md:text-4xl">
          Need Help Choosing?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-background/75">
          Message us on WhatsApp for size guidance, fabric details, or to place
          a custom order. We respond quickly during business hours.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Makkah Arts! I'd like help with an order.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block bg-[#25D366] px-8 py-3 text-xs tracking-widest text-white uppercase transition hover:opacity-90"
        >
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}

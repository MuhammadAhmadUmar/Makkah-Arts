import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-main py-10 md:py-16">
      <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>
      <p className="mt-3 text-sm text-muted">
        No online payment required. Choose your preferred method and confirm via
        WhatsApp.
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}

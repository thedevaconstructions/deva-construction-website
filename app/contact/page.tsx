import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
  description:
    "Start a project with Deva Construction. Email, phone, or send us your plot and brief — we reply inside 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 lg:px-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
              Say hello
            </p>
          </Reveal>
          <Reveal delay={120} duration={900}>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
              Tell us about the <span className="italic">build.</span>
            </h1>
          </Reveal>
          <Reveal delay={280} duration={800}>
            <p className="mt-8 max-w-xl text-lg text-ink/75">
              A plot, a sketch, a wishlist, or nothing more than an idea — send it and we reply
              inside 24 hours with a first-read from the team.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8 text-sm">
            <Detail
              label="Email"
              href="mailto:thedeva.co@gmail.com"
              value="thedeva.co@gmail.com"
            />
            <Detail
              label="Phone / WhatsApp"
              href="tel:+919980144405"
              value="+91 99801 44405"
            />
            <div>
              <Label>Studio</Label>
              <address className="mt-2 not-italic text-ink/80">
                Deva Construction
                <br />
                114, BK Layout, Thindlu
                <br />
                Vidyaranyapura, Bengaluru
                <br />
                Karnataka 560097, India
              </address>
            </div>
            <div>
              <Label>Hours</Label>
              <p className="mt-2 text-ink/80">
                Mon – Sat · 9:30 to 6:30 IST
                <br />
                Sunday closed
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/75">
      {children}
    </span>
  );
}

function Detail({ label, href, value }: { label: string; href: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <a href={href} className="mt-2 block font-serif text-2xl text-ink hover:text-accent-deep">
        {value}
      </a>
    </div>
  );
}

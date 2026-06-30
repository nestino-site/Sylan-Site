import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 pt-24">
      <section className="luxury-card max-w-3xl p-10 text-center md:p-16">
        <p className="eyebrow justify-center">Not Found</p>
        <h1 className="mt-8 font-display text-display font-semibold text-charcoal">
          This part of the network is not live yet.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone">
          Return to the Nestino platform story or contact the team to start an enterprise conversation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact Nestino
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

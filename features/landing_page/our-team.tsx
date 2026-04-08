import Image from "next/image";

const TEAM = [
  {
    id: 1,
    name: "Lucas Alves",
    role: "Master Barber e Founder",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkF1q5p16-K8Hh8FPKTE0_OFzQKNzUg9jKcvJUi-NwjFdOJ1fG1CNAB1kl55TKxuVVQGn-PzzV92ZnDjufRnGnPcu2j4YqVe1g16v-u1njQ7AsqDm9mmW16ynGwLZViMioebW__3Y3RLD9jlSRR2wDJN_4dhtKS5MWWQT34oV-iELEfMjmeSVCOVS6SP9Yo27OHCQ7JTiVz5mUp-mqlWvvq5bWF-QR0bcX9EpbkvF_uqKMcW5rjIgJEZQcBxw34HeardwEJnIWR9w",
    featured: false,
  },
  {
    id: 2,
    name: "Thiago Silva",
    role: "Beard Specialist",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJmFdaV3nJ_baUNUtEndGBzxX-YfDZwn2nQT38qQrv8sGN9UbXcKgdxbT6ivRlae5XeO8wawfKFV3Bwk15fTPGAnbZQ3e_BylfhH5CW-VbT3hz4OTVh8Domt4wTfnffbo25ejYodH1361M9uNhBPRo1xk06Zjn2GX5jNzfgmY2R18RkT3dFPUfz7zN9zVGCAFkXHqU7OjoEtOTvoUTSWstx8Nf7ufvetP4ju-Edd4W-Y3cgtZvTd7cH8a_RKiu2UKtbYqOsE5sdEs",
    featured: true,
  },
  {
    id: 3,
    name: "Gabriel M.",
    role: "Modern Cuts Expert",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7yKCtQNwZqn1HcxMoIXsbLx-QrXoWL4Fv7OMK0Xko-HJcdIV_NBgGpUoAHyEVKTS4KfZoB7xcd5z2GpYKTMGLZvzfbyQwaj0irlfbsriQDZeXQ6CtLR1rZLC4swluDKg_-Syg6ZT5qb2xPthD2zPky6fREMWYaL7sdyQjNgezz8FP3B-fsDpqcukQF1fWR9TLX_AofMPZ-4xZMiiyd5ieIidND5JgZbWiFOeBTi6Z9nqHgUQbdpbVAQMxqjH4G2ScMFMm71qcYOQ",
    featured: false,
  },
];

export function OurTeam() {
  return (
    <section id="team" className="bg-zinc-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 block font-manrope font-semibold text-amber-300 text-xs uppercase tracking-[0.24em] sm:text-sm">
            Craftsmanship
          </span>
          <h2 className="font-poppins font-semibold text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
            Nossa equipe
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map(member => (
            <div
              key={member.id}
              className={`group ${member.featured ? "lg:mt-16" : ""}`}
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-950">
                <Image
                  fill
                  src={member.image}
                  alt={member.name}
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="mt-6">
                <h3 className="font-poppins font-semibold text-3xl text-zinc-100">
                  {member.name}
                </h3>
                <p className="mt-2 font-manrope text-amber-300 text-xs uppercase tracking-[0.22em]">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { AuroraText } from "@/shared/components/ui/aurora-text";
import Image from "next/image";

const galleryImages = [
  {
    src: "/portfolio/port-1.jpeg",
    alt: "Corte fade com acabamento preciso",
    offset: "",
  },
  {
    src: "/portfolio/port-4.jpeg",
    alt: "Ambiente interno da barbearia",
    offset: "md:translate-y-10",
  },
  {
    src: "/portfolio/port-2.jpeg",
    alt: "Aplicacao de espuma para barba",
    offset: "",
  },
  {
    src: "/portfolio/port-3.jpeg",
    alt: "Visual classico com barba longa",
    offset: "md:translate-y-10",
  },
];

export function Portfolio() {
  return (
    <section
      id="gallery"
      className="overflow-hidden bg-zinc-950 py-24 sm:py-32"
    >
      <div className="mx-auto mb-14 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-poppins font-semibold text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
          Portfólio e
          <AuroraText className="ml-3 italic" colors={["#FBBF24", "#D97706"]}>
            atmosfera
          </AuroraText>
        </h2>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {galleryImages.map((image, index) => (
          <div
            key={`image${image.src}-${index}`}
            className={`relative aspect-4/5 overflow-hidden rounded-xl border border-zinc-700/70 odd:translate-y-10`}
          >
            <Image
              fill
              src={image.src}
              alt={image.alt}
              className="object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

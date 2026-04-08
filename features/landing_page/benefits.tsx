import Image from "next/image";

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxuT_nx-tXZEJEy_o7AIjmOdoVFa8lrLyxhmQVpvSh9SOLYheurNzxuorC3ImiHMDNTIymD8VVkEVQDm041n9B85g1K_AqtSHtogFcVmibclyCE_oNkg2qy9ARS3804giQ1nweGmFrzG4-QLzh8X5Xbe7MQJ_bb9bCICxGr74mW1A6t5TS04mUD47-vVskDEt14hs3vKTQKlNo-Hi-_3sXX3jzM2FuyiLRwahINYxj-iaY7o_9lYl_1OF-9V_ALBXKlArNGqYlhfw",
    alt: "Corte fade com acabamento preciso",
    offset: "",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9hxjjU-aT3vKzDyBBjQH9sIVksqm-U0LuETAU7ljq-zeQLSMJVA8UoFfvp9CV2VQLENAErpR5IRhYjSZKz7eHiPFWB7V1DWT5qzzCv8qvZn4Xwi1Rfwl_IIIYIhsk06TSvha0u-9OGZAMgaY1i3CCgL0skGhE_a9YYBkcMkKiRKFjcDSMM5HE0Q0ss_jHj1N--KCEh4suq_naocP2iyPX9WGbRIW0AFOnGsMnx_ycvLOzLIrXjN7JeS2mXqiL8GVNljfyurhWg8E",
    alt: "Ambiente interno da barbearia",
    offset: "md:translate-y-10",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQeg0ruHUN5DU72371zZaBwpJ1aIu3wAHz9qeC4HgJuqS9sPQxfw6GEAx-bmRuw62lMcBK968ae1h-_QXA4HaNBTL7-_7VnoVQTp3FvuQvOOZwkTs_CcSbd3vHQ2mOzLhbgcrWBR6J6JsFyFl9poG2BG_dI8euoM9MOy85_vSh90CuPTXtUZ8-ZrCfTwlfDhfwPOABkeN_FkHbGCkWJfKEeThuVH33WCKUf1_OgCsn2L7TaeoMALSUphYt3i5OghHYM77Y8kvW3xM",
    alt: "Aplicacao de espuma para barba",
    offset: "",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO1MkqnFnT1C1Ws3k4ngSk_c5q24ROKbxHOuO08pmIUhu4oCaTUOnbbW6Fp6CFVVK56vSi3JoXiFOP-QOMqwTgYhACQd3N1KYpXba-PkCB3dYWTPMYFYoB7PsXsPG-ejOoOqypktMAmBfjk9e6RDqULEhJN2lfp1tkTMfq71o9aV58czqM5Ebc4EcdY5RKfDDspIuyipce0E9L9jSBRawIF0AQnKZyu7AkzJIYL8tgl2PzHfVdRsVA0kuqy2BtPwYwwNiIQIz3V5Q",
    alt: "Visual classico com barba longa",
    offset: "md:translate-y-10",
  },
];

export function Benefits() {
  return (
    <section
      id="gallery"
      className="overflow-hidden bg-zinc-950 py-24 sm:py-32"
    >
      <div className="mx-auto mb-14 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-poppins font-semibold text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
          Portfolio e
          <span className="ml-3 text-amber-300 italic">atmosfera</span>
        </h2>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {galleryImages.map(image => (
          <div
            key={image.src}
            className={`relative aspect-4/5 overflow-hidden rounded-xl border border-zinc-700/70 ${image.offset}`}
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

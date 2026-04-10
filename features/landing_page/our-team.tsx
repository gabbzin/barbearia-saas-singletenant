import Image from "next/image";

const TEAM = [
  {
    id: 1,
    name: "Lucas Alves",
    role: "Fundador e barbeiro principal",
    image: "/lucas.jpeg",
    featured: false,
  },
];

export function OurTeam() {
  const isSingleMember = TEAM.length === 1;

  return (
    <section id="team" className="bg-zinc-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-3 block font-manrope font-semibold text-amber-300 text-xs uppercase tracking-[0.24em] sm:text-sm">
            Equipe
          </span>
          <h2 className="font-poppins font-semibold text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
            Conheça nosso barbeiro
          </h2>
        </div>

        <div
          className={`mx-auto grid gap-10 ${
            isSingleMember
              ? "grid-cols-1 place-items-center"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
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

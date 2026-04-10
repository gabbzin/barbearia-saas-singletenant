import Image from "next/image";

export function HowItWork() {
  return (
    <section className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="relative md:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900">
            <Image
              fill
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl0X8vOeh2W2YLcuyfCKvcH9PA4AOjin5Rbfw5bttgjS1UW_u1QiMed8RNGut6NZwpSqbU-Datr6ew_RTELfCruXqKfY_UbzVCS6WBKNLqcirrgCHnL3bsdn2XxkfUQ-Dli-pEu8N-zwbYxaatiVTh7p07NTpIJxb2FgDkT4PU57GOwwn0DX9UIlZw1lkl85-TOqbHEk0uckeOLf0PaJe6n1syeR47zY8FdxphkyievIAypvEp6dE7FS4Aoh-NsIgNp2lTDmbxy_o"
              alt="Profissional modelando barba"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-amber-600/20 blur-3xl" />
        </div>

        <div className="md:col-span-7">
          <h2 className="font-poppins font-semibold text-4xl text-zinc-100 leading-tight sm:text-5xl lg:text-6xl">
            O atelier da
            <br />
            <span className="text-amber-300">masculinidade moderna</span>
          </h2>
          <p className="mt-7 max-w-2xl font-manrope text-lg text-zinc-300 leading-relaxed">
            Nascido da paixao pela precisao e pela arte da barbearia classica, o
            Lucas Alves Salao e Barbearia une tecnica contemporanea,
            exclusividade e experiencia premium em cada atendimento.
          </p>

          <div className="mt-10 grid gap-6 border-zinc-700/60 border-t pt-8 sm:grid-cols-2">
            <div>
              <h3 className="font-poppins font-semibold text-2xl text-amber-300">
                Exclusividade
              </h3>
              <p className="mt-2 font-manrope text-sm text-zinc-400 leading-relaxed">
                Atendimento personalizado com hora marcada e foco no seu estilo.
              </p>
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-2xl text-amber-300">
                Conforto Noir
              </h3>
              <p className="mt-2 font-manrope text-sm text-zinc-400 leading-relaxed">
                Ambiente climatizado, cafe premium e trilha sonora selecionada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

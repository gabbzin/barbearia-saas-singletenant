import Image from "next/image";
import Link from "next/link";

interface BarberItemProps {
  barber: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

const BarberItem = ({ barber }: BarberItemProps) => {
  return (
    <Link
      href={`/client/barbeiro/${barber.id}`}
      className="relative min-h-50 min-w-72.5 overflow-hidden rounded-xl border border-transparent shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/50"
    >
      <div className="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-linear-to-t from-black to-transparent"></div>
      <Image
        src={barber.imageUrl ?? ""}
        alt={barber.name}
        fill // Usamos fill para a imagem ocupar todo o espaço do container pai quando este tiver position relative
        className="rounded-xl object-cover"
      />
      <div className="absolute right-0 bottom-0 left-0 z-20 flex items-center gap-2 p-4">
        <h3 className="font-bold text-background text-lg dark:text-white">
          {barber.name}
        </h3>
        {/* Adicionar estrelas aos barbeiros */}
        <span className="font-semibold text-gold text-xs">★ 5.0</span>
      </div>
    </Link>
  );
};

export default BarberItem;

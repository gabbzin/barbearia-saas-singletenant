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
      className="relative min-h-50 min-w-72.5 rounded-xl shadow-md transition-transform hover:scale-105"
    >
      <div className="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-linear-to-t from-black to-transparent"></div>
      <Image
        src={barber.imageUrl ?? ""}
        alt={barber.name}
        fill // Usamos fill para a imagem ocupar todo o espaço do container pai quando este tiver position relative
        className="rounded-xl object-cover"
      />
      <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
        <h3 className="font-bold text-background text-lg dark:text-white">
          {barber.name}
        </h3>
      </div>
    </Link>
  );
};

export default BarberItem;

import { BARBERSHOPNAME } from "@/lib/consts";

export default function Footer() {
  const yearAtual = new Date().getFullYear();

  return (
    <footer className="bg-muted flex flex-col py-7 items-center justify-center mt-7 bottom-0 w-full">
      <div className="text-center text-foreground">
        &copy; {yearAtual} {BARBERSHOPNAME}.
      </div>
      <p className="text-center text-muted-foreground">
        Todos os direitos reservados.
      </p>
    </footer>
  );
}

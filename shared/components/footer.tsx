import { BARBERSHOPNAME } from "@/consts/consts";

export default function Footer() {
  const yearAtual = new Date().getFullYear();

  return (
    <footer className="bg-muted flex flex-col flex-1 items-center justify-center">
      <div className="p text-center text-foreground">
        &copy; {yearAtual} {BARBERSHOPNAME}.
      </div>
      <p className="text-center text-muted-foreground">
        Todos os direitos reservados.
      </p>
    </footer>
  );
}

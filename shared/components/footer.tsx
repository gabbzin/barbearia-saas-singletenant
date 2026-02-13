import { BARBERSHOPNAME } from "@/consts/consts";

export default function Footer() {
  const yearAtual = new Date().getFullYear();

  return (
    <footer className="bg-muted p-7">
      <div className="p text-center text-foreground">
        &copy; {yearAtual} {BARBERSHOPNAME}.
      </div>
      <p className="text-center text-muted-foreground">
        Todos os direitos reservados.
      </p>
    </footer>
  );
}

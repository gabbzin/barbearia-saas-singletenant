export default function Footer() {
  const yearAtual = new Date().getFullYear();

  return (
    <footer className="bg-muted p-7">
      <div className="p-4 text-center text-foreground">
        &copy; {yearAtual} Barbearia.
      </div>
      <p className="text-center text-muted-foreground">
        Todos os direitos reservados.
      </p>
    </footer>
  );
}

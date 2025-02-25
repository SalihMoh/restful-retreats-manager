
const Footer = () => {
  return (
    <footer className="bg-muted py-4 border-t">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Réservation d'Hôtel. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;

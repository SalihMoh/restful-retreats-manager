
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 border-t">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Hotel Booking. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

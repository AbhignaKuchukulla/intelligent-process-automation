import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-lg font-bold">IPA System</h1>
        <div>
          <Link href="/" className="px-3">Home</Link>
          <Link href="/dashboard" className="px-3">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

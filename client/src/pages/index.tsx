import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Intelligent Process Automation</title>
        <meta name="description" content="AI-powered process automation" />
      </Head>

      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">IPA System</h1>
        <div>
          <Link href="/login" className="text-gray-700 px-4">Login</Link>
          <Link href="/register" className="text-blue-600 px-4 font-semibold">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-4xl font-bold">Automate Your Business Processes with AI</h2>
        <p className="mt-4 text-lg">Leverage OCR, NLP, and AI-powered automation to streamline workflows.</p>
        <Link href="/dashboard" className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg shadow-md font-semibold">Get Started</Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h3 className="text-3xl font-semibold text-gray-800">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">OCR Processing</h4>
            <p className="text-gray-600 mt-2">Extract text from documents and automate data entry.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">Natural Language Processing</h4>
            <p className="text-gray-600 mt-2">Analyze and understand text data with AI.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">Workflow Automation</h4>
            <p className="text-gray-600 mt-2">Automate repetitive tasks and optimize processes.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} IPA System. All rights reserved.</p>
      </footer>
    </div>
  );
}

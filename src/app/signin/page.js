import Link from 'next/link';

export const metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 pt-24">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-600">
          The sign-in window should appear automatically. If it doesn't, use the
          Sign In button in the header or go back to the home page.
        </p>
        <div className="mt-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">Go home</Link>
        </div>
      </div>
    </main>
  );
}

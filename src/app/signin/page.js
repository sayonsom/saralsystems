import Header from '@/components/Header';

export const metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-600">
            The sign-in window should appear automatically. If it doesn't, use the
            Sign In button in the header or go back to the home page.
          </p>
          <div className="mt-6">
            <a href="/" className="text-orange-600 hover:text-orange-700 font-semibold">Go home</a>
          </div>
        </div>
      </main>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold">Resume Generator AI</h1>
          <div className="flex gap-4">
            <a
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            AI-Powered Resume
            <br />
            Tailored to Every Job
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Create professional, ATS-friendly resumes optimized for specific job descriptions.
            Our AI analyzes job postings and tailors your resume to match, increasing your chances of landing interviews.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="rounded-lg bg-zinc-900 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start Free
            </a>
            <a
              href="#features"
              className="rounded-lg border border-zinc-300 px-8 py-3 text-lg font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Learn More
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            5 free resume generations • No credit card required
          </p>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">AI-Powered Optimization</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Claude AI analyzes job descriptions and tailors your resume content to match requirements perfectly.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">ATS-Friendly Templates</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Professional templates designed to pass Applicant Tracking Systems while looking great.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Fast & Easy</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Generate a tailored resume in under 30 seconds. Just paste the job description and let AI do the work.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold">Simple Pricing</h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-4 text-4xl font-bold">$0</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Get started for free</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5 resume generations
                </li>
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All AI features
                </li>
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All templates
                </li>
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PDF export
                </li>
              </ul>
              <a
                href="/auth/signup"
                className="mt-8 block rounded-lg border border-zinc-300 px-4 py-2 font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Get Started
              </a>
            </div>

            <div className="rounded-lg border-2 border-zinc-900 bg-white p-8 dark:border-zinc-50 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-4 text-4xl font-bold">Coming Soon</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Unlimited everything</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited resumes
                </li>
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No watermark
                </li>
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Early access to features
                </li>
              </ul>
              <button
                disabled
                className="mt-8 block w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>Resume Generator AI - Powered by Claude</p>
        </div>
      </footer>
    </div>
  );
}

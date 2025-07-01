export default function EmailConfirmation() {
  return (
    <div className="flex justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-md text-center space-y-6">
        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 12H8m8-4H8m8 8H8m12-8v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          Check Your Email
        </h2>

        <p className="text-gray-600 text-sm">
          We sent a link to your email. Click the link to get access to your new
          AI UGC video.
        </p>

        <div className="w-full h-96 bg-gray-100 rounded-md" />

        <p className="text-xs text-gray-500">
          Didn’t receive an email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  );
}

"use client";

/**
 * Root error UI — must define <html> and <body> (does not use root layout).
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem" }}>
        <h1 style={{ fontSize: "1.25rem" }}>Something went wrong</h1>
        {error.digest ? (
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Digest: {error.digest}</p>
        ) : null}
        <button type="button" onClick={() => reset()} style={{ marginTop: "1rem" }}>
          Try again
        </button>
      </body>
    </html>
  );
}

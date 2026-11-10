// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert h-5 w-[100px]"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the{" "}
//             <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
//               page.tsx
//             </code>{" "}
//             file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert h-[14px] w-4"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={14}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setLink("");

    const payload: Record<string, unknown> = { content };
    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) setError(data.error ?? "Something went wrong");
    else setLink(data.url);
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            Simple. Secure. Shareable.
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Paste<span className="text-violet-400">bin</span>
          </h1>

          <p className="mt-4 text-base text-zinc-400 sm:text-lg">
            Share text instantly with a simple, unique link.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-2xl shadow-black/30 sm:p-8">

          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-200">
              Your content
            </label>
            <span className="text-xs text-zinc-500">
              Plain text
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here..."
            rows={8}
            className="w-full resize-y rounded-xl border border-white/10 bg-[#09090b] p-4 font-mono text-sm leading-7 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />

          {/* Settings */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Expiration time
              </label>
              <input
                type="number"
                min={1}
                placeholder="Seconds (optional)"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Maximum views
              </label>
              <input
                type="number"
                min={1}
                placeholder="Number of views (optional)"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-[0.99]"
          >
            Create paste
            <span aria-hidden="true">→</span>
          </button>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Share Link */}
          {link && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="mb-2 text-sm font-semibold text-emerald-400">
                Paste created successfully!
              </p>
              <p className="break-all text-sm text-zinc-300">
                Share link:{" "}
                <a
                  href={link}
                  className="text-emerald-400 underline decoration-emerald-400/40 underline-offset-4 hover:text-emerald-300"
                >
                  {link}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-zinc-600">
          Create a paste. Get a link. Share it anywhere.
        </p>
      </div>
    </main>
  );
}

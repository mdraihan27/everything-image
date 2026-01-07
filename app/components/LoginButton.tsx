import Link from "next/link";

type LoginButtonProps = {
  label?: string;
  href?: string;
  className?: string;
};

function ChevronRightIcon() {
  return (
    <svg
      className="h-5 w-5"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function LoginButton({
  label = "Login",
  href,
  className,
}: LoginButtonProps) {
  const classes =
    "group relative inline-block p-px font-semibold leading-6 text-white " +
    "rounded-xl bg-transparent shadow-2xl shadow-black/60 transition-transform duration-300 " +
    "ease-in-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-white/25 cursor-pointer" +
    (className ? ` ${className}` : "");

  const inner = (
    <>
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-blue-900 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10 block rounded-xl hover:bg-zinc-900 px-6 py-3">
        <span className="relative z-10 flex items-center gap-2">
          <span className="transition-transform duration-500 group-hover:translate-x-1">
            {label}
          </span>
          <span className="transition-transform duration-500 group-hover:translate-x-1">
            <ChevronRightIcon />
          </span>
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {inner}
    </button>
  );
}

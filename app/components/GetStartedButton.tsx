import Link from "next/link";

type GetStartedButtonProps = {
  label?: string;
  href?: string;
  className?: string;
};

function ArrowIcon() {
  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function GetStartedButton({
  label = "Get started",
  href,
  className,
}: GetStartedButtonProps) {
  const classes =
    "group relative inline-flex h-11 items-center overflow-hidden rounded-2xl " +
    "bg-gradient-to-r from-blue-600/40 to-sky-400 px-5 pr-14 text-[15px] font-medium " +
    "tracking-wide text-white shadow-lg shadow-sky-500/20 " +
    "transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-white/30 active:scale-[0.99] cursor-pointer" +
    (className ? ` ${className}` : "");

  const inner = (
    <>
      {label}
      <span
        className={
          "absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center " +
          "rounded-[0.9em] bg-white shadow-md shadow-violet-500/20 transition-all duration-300 " +
          "group-hover:w-[calc(100%-0.5rem)]"
        }
      >
        <span className="text-sky-500 transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowIcon />
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

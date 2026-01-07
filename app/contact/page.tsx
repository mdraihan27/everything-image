import { ArrowUpRight, Github, Globe2, LayoutTemplate, Linkedin, MessageCircle, Sparkles, Workflow } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 justify-center px-6 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-5xl text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500/30 text-sky-100">
              <MessageCircle className="h-3 w-3" />
            </span>
            Work with me
          </p>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Need a custom image workflow or a small tool built?
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            everything-image is just one example of the kind of fast, focused
            tools I like to build. If you need something tailored to your team,
            product, or day-to-day work, I am available for freelance projects
            and custom solutions.
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            Think: private dashboards for your content team, tiny internal
            utilities that fix annoying image chores, or automations that wire
            into the tools you already use.
          </p>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                <Globe2 className="h-3 w-3" />
                Web apps & tools
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                Small web apps that feel fast
              </p>
              <p className="mt-2 text-xs text-white/70">
                Dashboards, internal tools, and little utilities built with modern
                web stacks that load quickly and get out of your way.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                <LayoutTemplate className="h-3 w-3" />
                Websites & landing pages
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                Clean, focused marketing pages
              </p>
              <p className="mt-2 text-xs text-white/70">
                Simple sites for products, portfolios, and ideas &mdash; built to
                explain what you do without a lot of fluff.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                <Workflow className="h-3 w-3" />
                Integrations & automations
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                Glue between the tools you use
              </p>
              <p className="mt-2 text-xs text-white/70">
                Little scripts and services that connect forms, CRMs, storage,
                and image services so things happen automatically.
              </p>
            </div>
          </section>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <a
              href="https://www.upwork.com/freelancers/~01a59b547d87ae9c59"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-white/80 backdrop-blur-sm transition hover:border-emerald-300 hover:bg-emerald-400/15"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  Upwork
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  Hire me for scoped freelance work
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Best for longer engagements, ongoing support, or clearly
                  defined projects.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-200">
                <span>View Upwork profile</span>
                <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/mdraihanhossen"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-sky-400/40 bg-sky-400/10 p-4 text-sm text-white/80 backdrop-blur-sm transition hover:border-sky-300 hover:bg-sky-400/15"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">
                  LinkedIn
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  Connect and discuss ideas
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Great if you want to chat about fit, ideas, or future
                  collaborations.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-sky-200">
                <span>Open LinkedIn</span>
                <Linkedin className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>

            <a
              href="https://github.com/mdraihan27"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/80 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  GitHub
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  See more of my work
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Browse projects, experiments, and code to get a feel for how I
                  build things.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-white/80">
                <span>Visit GitHub</span>
                <Github className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          </div>

          <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500/30 text-violet-100">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  Custom-made solutions
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  Tell me what is slowing you down &mdash; we can probably build a
                  small tool to fix it.
                </p>
                <p className="mt-2 text-xs text-white/70">
                  If you have a specific workflow in mind (image pipelines,
                  dashboard widgets, little in-house utilities), mention it when
                  you reach out. The more real your use-case, the better the
                  solution we can design.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

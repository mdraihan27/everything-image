import GetStartedButton from "./components/GetStartedButton";
import FeaturesSection from "./components/FeaturesSection";
import WhyEverythingImageSection from "./components/WhyEverythingImageSection";
import EverythingInOnePlaceSection from "./components/EverythingInOnePlaceSection";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
      {/* Violet Storm Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 justify-center px-6 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Fast, free, and simple
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-b from-white via-white/80 to-white/0 bg-clip-text text-transparent">
              Your one stop solution for
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent text-5xl sm:text-7xl">
              Quick Image Manipulation
            </span>
          </h1>

          {/* <p className="mx-auto mt-5  text-base text-white/70 sm:text-lg">
            A tiny corner of the internet to fix images fast, without opening a heavy editor.
          </p> */}

          {/* <div className="mt-10 flex justify-center">
            <GetStartedButton label="Open Playground" href="/playground" />
          </div> */}

          <FeaturesSection />
          <EverythingInOnePlaceSection />
          <WhyEverythingImageSection />

          {/* SEO content section */}
          <section className="mt-20 w-full text-left text-white/80 leading-relaxed">
            <div className="mx-auto max-w-4xl space-y-10 text-sm sm:text-base">
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Online pro photo editor for quick image fixes
                </h2>
                <p className="mt-3">
                  Everything Image is a fast, browser-based pro photo editor where you can
                  crop, rotate, resize, and make basic color or tone tweaks without
                  installing heavy software. Open the multi-tool editor, adjust exposure,
                  contrast, temperature, and more, then download a clean, optimized image
                  in just a few clicks.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Remove image background online in one click
                </h2>
                <p className="mt-3">
                  Use the Remove BG tool to cut out subjects cleanly and create
                  transparent PNGs ready for thumbnails, product photos, and social
                  posts. The online background remover focuses on edges so you can
                  separate people, objects, and logos from busy scenes in seconds.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Convert image formats between PNG, JPG, WebP, AVIF and more
                </h2>
                <p className="mt-3">
                  Quickly convert images between more than 25 formats, including PNG,
                  JPEG, JPG, WebP, AVIF, and others. Upload a file, pick the format you
                  need, and download a high-quality result that works better for the web,
                  print, or apps without worrying about complex export settings.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Crop, rotate and resize images to the perfect dimensions
                </h2>
                <p className="mt-3">
                  The crop, rotate and resize tools make it easy to fix composition,
                  straighten a horizon, or prepare images for profile pictures, banners,
                  and social feeds. Set exact pixel sizes or drag handles visually, then
                  rotate or flip until your image looks just right.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Compress images without losing visible quality
                </h2>
                <p className="mt-3">
                  Use the image compressor to shrink file size while keeping photos sharp
                  and readable. Smaller images load faster on websites, emails, and chat
                  apps, helping you stay under upload limits and improving page speed
                  without re-editing from scratch.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Blur or mosaic sensitive parts of a photo
                </h2>
                <p className="mt-3">
                  The blur and mosaic tools let you hide faces, names, addresses, or any
                  sensitive detail before sharing screenshots and pictures. Select the
                  area you want to cover, choose between soft blur or pixelated mosaic,
                  and export a privacy-safe version instantly.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Add watermark text or logo to protect your images
                </h2>
                <p className="mt-3">
                  With the watermark tool you can add subtle text or a logo overlay to
                  your images. Control size, opacity, and placement so your watermark is
                  visible but not distracting, helping discourage unauthorized reuse
                  while keeping your work looking professional.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Add stylish text to images for social media
                </h2>
                <p className="mt-3">
                  The add text tool lets you place beautiful, customizable text anywhere
                  on your image. Choose fonts, colors, alignment, and layering to create
                  social posts, announcements, thumbnails, and simple graphics without
                  needing a full design app.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Enhance image quality and upscale small photos
                </h2>
                <p className="mt-3">
                  Use the enhance quality tool to gently sharpen, clean up noise, and
                  upscale smaller images so they look clearer on modern screens. It is an
                  easy way to refresh old pictures, screenshots, or low-resolution assets
                  before reusing them in new projects.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

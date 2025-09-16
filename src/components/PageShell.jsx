export default function PageShell({ title, subtitle, children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-hero text-4xl md:text-5xl tracking-wide title-outline">{title}</h1>
      {subtitle && (
        <p className="font-medieval text-stone-600 dark:text-stone-300 mt-1">{subtitle}</p>
      )}
      <div className="mt-6 prose prose-stone dark:prose-invert max-w-none
        prose-headings:font-medieval
        prose-headings:tracking-wide
        prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-3
        prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-2
        prose-h3:text-xl  prose-h3:mt-4 prose-h3:mb-1"
      >{children}</div>
    </div>
  )
}

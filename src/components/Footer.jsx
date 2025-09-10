export default function Footer() {
  return (
    <footer className="mt-6 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-center text-stone-600 dark:text-stone-400">
        © {new Date().getFullYear()} Ton Nom — Portfolio
      </div>
    </footer>
  )
}

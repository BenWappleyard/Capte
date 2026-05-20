import { ImportClient } from "./ImportClient";

export default function ImportPage() {
  return (
    <div className="px-5 pt-8">
      <h1 className="text-2xl font-semibold mb-2">Import cards</h1>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        Paste vocabulary from your Google Docs. Each line should be a word or phrase and its translation, separated by a dash, colon, tab, or pipe.
      </p>

      <div className="bg-[var(--color-accent-light)] rounded-2xl p-4 mb-6 text-sm text-[var(--color-accent)]">
        <p className="font-medium mb-1">Supported formats</p>
        <p className="font-mono opacity-80">bonjour - hello</p>
        <p className="font-mono opacity-80">merci: thank you</p>
        <p className="font-mono opacity-80">parler | to speak</p>
      </div>

      <ImportClient />
    </div>
  );
}

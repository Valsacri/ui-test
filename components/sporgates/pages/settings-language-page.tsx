"use client"

interface SettingsLanguagePageProps {
  onBack: () => void
}

const languages = ["English", "Spanish", "French", "Portuguese", "German"]

export function SettingsLanguagePage({ onBack }: SettingsLanguagePageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Language & Region</h1>
        <p className="text-sm text-muted-foreground">Choose your preferred language</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        {languages.map((language, index) => (
          <label key={language} className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3 text-sm">
            <span className="text-foreground">{language}</span>
            <input type="radio" name="language" defaultChecked={index === 0} className="h-4 w-4 accent-primary" />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
      >
        Back to Settings
      </button>
    </div>
  )
}

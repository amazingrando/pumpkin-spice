/**
 * Section themes: each band is the same markup with a different theme class.
 * Every color comes from Tailwind semantic utilities, so the band restyles
 * itself from the remapped tokens.
 */
const THEMES = ['light', 'subtle', 'dark', 'brand', 'accent'];

// Full class names so Tailwind can find them in source.
const STATUS_CLASSES = {
  destructive: 'bg-destructive-subtle text-destructive-subtle-foreground',
  success: 'bg-success-subtle text-success-subtle-foreground',
  warning: 'bg-warning-subtle text-warning-subtle-foreground',
  info: 'bg-info-subtle text-info-subtle-foreground',
};

function Sample({ theme }) {
  return (
    <section className={`theme-${theme} p-8`}>
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-semibold">theme-{theme}</h2>
        <p className="text-muted-foreground">
          Muted text on the section background, with a{' '}
          <a href="#theme" className="text-link underline hover:text-link-hover">
            link
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-control border-0 bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Primary
          </button>
          <button
            type="button"
            className="rounded-control border-0 bg-secondary px-4 py-2 font-semibold text-secondary-foreground hover:bg-secondary-hover"
          >
            Secondary
          </button>
          <input
            aria-label={`Example input in ${theme} theme`}
            placeholder="Input"
            className="rounded-control border border-input bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-container bg-card p-4 text-card-foreground shadow-raised">Card</div>
          <div className="rounded-container bg-muted p-4 text-muted-foreground">Muted</div>
          <div className="rounded-container border border-border-strong p-4">Strong border</div>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {Object.entries(STATUS_CLASSES).map(([status, classes]) => (
            <span key={status} className={`rounded-full px-3 py-1 ${classes}`}>
              {status}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default {
  title: 'Foundations/Section themes',
  parameters: { layout: 'fullscreen' },
};

export const AllThemes = {
  render: () => (
    <div>
      {THEMES.map((theme) => (
        <Sample key={theme} theme={theme} />
      ))}
    </div>
  ),
};

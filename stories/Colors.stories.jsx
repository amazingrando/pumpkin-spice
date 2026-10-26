import tokens from '@pumpkin-spice/tokens/json';

/**
 * Generated primitive scales and the semantic colors of the default theme.
 * Swatches read the CSS custom properties; labels show the resolved hex.
 */
const FAMILIES = ['brand', 'accent', 'neutral', 'red', 'amber', 'green', 'blue'];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const swatch = {
  height: '3rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
};

function Scales() {
  return (
    <div style={{ display: 'grid', gap: 'calc(var(--spacing) * 6)' }}>
      {FAMILIES.map((family) => (
        <section key={family}>
          <h3 className="text-lg font-semibold">
            {family}
            {['brand', 'accent'].includes(family) && (
              <span className="text-sm font-regular text-muted-foreground">
                {' '}
                · solid fill: {tokens.primitives[`${family}-solid`]}
              </span>
            )}
          </h3>
          <ol
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
              gap: 'calc(var(--spacing) * 2)',
              padding: 0,
              listStyle: 'none',
            }}
          >
            {STEPS.map((step) => (
              <li key={step} className="text-xs">
                <div style={{ ...swatch, background: `var(--${family}-${step})` }} />
                <div className="font-semibold">{step}</div>
                <code className="text-muted-foreground">{tokens.primitives[`${family}-${step}`]}</code>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

/** Semantic color groups, in the order of docs/tokens.md. */
const SEMANTIC_GROUPS = {
  Page: ['background', 'foreground'],
  Containers: ['card', 'card-foreground', 'popover', 'popover-foreground'],
  Quiet: ['muted', 'muted-foreground'],
  Actions: [
    'primary',
    'primary-foreground',
    'primary-hover',
    'secondary',
    'secondary-foreground',
    'secondary-hover',
  ],
  Highlight: ['accent', 'accent-foreground'],
  Danger: ['destructive', 'destructive-foreground', 'destructive-hover'],
  Status: ['success', 'success-foreground', 'warning', 'warning-foreground', 'info', 'info-foreground'],
  'Soft status': [
    'destructive-subtle',
    'destructive-subtle-foreground',
    'success-subtle',
    'success-subtle-foreground',
    'warning-subtle',
    'warning-subtle-foreground',
    'info-subtle',
    'info-subtle-foreground',
  ],
  Links: ['link', 'link-hover'],
  Lines: ['border', 'border-strong', 'input', 'ring'],
};

/** The text color drawn on a surface swatch: its -foreground pair, if any. */
function pairedForeground(name, colors) {
  const base = name.replace(/-hover$/, '');
  return colors[`${base}-foreground`] ? `var(--${base}-foreground)` : null;
}

function Semantic({ theme }) {
  const colors = tokens.themes[theme] ?? tokens.themes.light;
  const grouped = new Set(Object.values(SEMANTIC_GROUPS).flat());
  // Anything new that isn't in a group yet still shows up for review.
  const ungrouped = Object.keys(colors).filter((name) => !grouped.has(name));
  const groups = Object.entries(SEMANTIC_GROUPS);
  if (ungrouped.length) groups.push(['Other', ungrouped]);

  return (
    <div style={{ display: 'grid', gap: 'calc(var(--spacing) * 8)' }}>
      {groups.map(([group, names]) => (
        <section key={group}>
          <h3 className="text-lg font-semibold">{group}</h3>
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
              gap: 'calc(var(--spacing) * 4)',
              padding: 0,
              listStyle: 'none',
            }}
          >
            {names.map((name) => {
              const foreground = pairedForeground(name, colors);
              return (
                <li key={name} className="text-sm">
                  <div
                    style={{
                      ...swatch,
                      display: 'grid',
                      placeItems: 'center',
                      background: `var(--${name})`,
                      color: foreground ?? undefined,
                    }}
                  >
                    {foreground && <span className="text-lg font-semibold">Aa</span>}
                  </div>
                  <code>--{name}</code>
                  <div className="text-muted-foreground">{colors[name]}</div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};

export const PrimitiveScales = { render: () => <Scales /> };

/** Hex labels follow the toolbar's section theme, matching the swatches. */
export const SemanticColors = {
  render: (args, { globals, parameters }) => (
    <Semantic theme={parameters.themes?.themeOverride ?? globals.theme ?? 'light'} />
  ),
};

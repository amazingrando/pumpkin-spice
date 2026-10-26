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

function Semantic() {
  const colors = tokens.themes.light;
  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
        gap: 'calc(var(--spacing) * 4)',
        padding: 0,
        listStyle: 'none',
      }}
    >
      {Object.entries(colors).map(([name, hex]) => (
        <li key={name} className="text-sm">
          <div style={{ ...swatch, background: `var(--${name})` }} />
          <code>--{name}</code>
          <div className="text-muted-foreground">{hex}</div>
        </li>
      ))}
    </ul>
  );
}

export default {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};

export const PrimitiveScales = { render: () => <Scales /> };

export const SemanticColors = { render: () => <Semantic /> };

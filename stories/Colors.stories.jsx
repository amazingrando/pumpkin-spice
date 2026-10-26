import tokens from '@pumpkin-spice/tokens/json';

/**
 * Semantic color tokens: the colors available as Tailwind utilities
 * (bg-brand-primary, text-text-muted, ...) and as --psds-color-* properties.
 */
const semanticColors = Object.entries(tokens.color)
  .filter(([group]) => group !== 'palette')
  .flatMap(([group, values]) =>
    Object.entries(values).map(([name, value]) => ({
      name: `${group}-${name}`,
      value,
    })),
  );

function Swatches() {
  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
        gap: 'var(--psds-space-4)',
        padding: 0,
        listStyle: 'none',
      }}
    >
      {semanticColors.map(({ name, value }) => (
        <li key={name}>
          <div
            style={{
              height: '4rem',
              borderRadius: 'var(--psds-radius-md)',
              border: '1px solid var(--psds-color-border-default)',
              background: `var(--psds-color-${name})`,
            }}
          />
          <code>--psds-color-{name}</code>
          <div style={{ color: 'var(--psds-color-text-muted)' }}>{value}</div>
        </li>
      ))}
    </ul>
  );
}

export default {
  title: 'Foundations/Colors',
  component: Swatches,
  parameters: { layout: 'padded' },
};

export const Semantic = {};

/**
 * The t-shirt type scale (Tailwind text-* utilities) and prose styles.
 */
// Full class names so Tailwind can find them in source.
const SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

function Scale() {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(SIZES).map(([size, className]) => (
        <div key={size} className="flex items-baseline gap-6">
          <code className="w-16 shrink-0 text-sm text-muted-foreground">{size}</code>
          <span className={`${className} truncate`}>Pumpkin spice</span>
        </div>
      ))}
    </div>
  );
}

function ProseSample() {
  return (
    <article className="prose" style={{ maxWidth: '42rem' }}>
      <h1>Heading one</h1>
      <p className="lead">A lead paragraph introduces the content in a larger, quieter style.</p>
      <p>
        Body copy with <strong>strong text</strong>, a <a href="#prose">link</a>, and{' '}
        <code>inline code</code>. <small>Small print sits beside it.</small>
      </p>
      <h2>Heading two</h2>
      <p>Paragraph after a second-level heading.</p>
      <h3>Heading three</h3>
      <ul>
        <li>First list item</li>
        <li>Second list item</li>
      </ul>
      <h4>Heading four</h4>
      <blockquote>A blockquote, set a little larger with a strong border.</blockquote>
      <h5>Heading five</h5>
      <pre>
        <code>{'const spice = ["cinnamon", "ginger", "nutmeg"];'}</code>
      </pre>
      <h6>Heading six</h6>
      <figure>
        <figcaption>A figure caption.</figcaption>
      </figure>
      <hr />
      <p>Text after a rule.</p>
    </article>
  );
}

export default {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};

export const TypeScale = { render: () => <Scale /> };

export const Prose = { render: () => <ProseSample /> };

export const ProseOnDark = {
  render: () => (
    <div className="theme-dark p-8">
      <ProseSample />
    </div>
  ),
};

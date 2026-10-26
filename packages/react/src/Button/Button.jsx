import '../../../../src/components/button/button.scss';

/**
 * Button, or a link styled as a button when `url` is set.
 * Mirrors src/components/button/button.twig.
 */
export function Button({
  text,
  url,
  variant = 'primary',
  type = 'button',
  className,
  ...rest
}) {
  const classes = ['psds-button', `psds-button--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  if (url) {
    return (
      <a href={url} className={classes} {...rest}>
        {text}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {text}
    </button>
  );
}

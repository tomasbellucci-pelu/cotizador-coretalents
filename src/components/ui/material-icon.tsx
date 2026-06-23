interface Props {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}

export function Icon({ name, size = 20, fill = false, className }: Props) {
  return (
    <span
      className={`material-symbols-rounded select-none ${className ?? ""}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
      }}
    >
      {name}
    </span>
  );
}

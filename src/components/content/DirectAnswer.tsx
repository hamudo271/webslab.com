type Props = { children: React.ReactNode };

export function DirectAnswer({ children }: Props) {
  return (
    <p className="mt-6 text-lg font-medium leading-relaxed text-text-primary">
      <strong>한 줄 답</strong> · {children}
    </p>
  );
}

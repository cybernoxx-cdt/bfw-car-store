interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({ label, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      {label && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-ignition">
          {label}
        </p>
      )}
      <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-bone sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-base text-bone-dim">{description}</p>
      )}
    </div>
  );
}

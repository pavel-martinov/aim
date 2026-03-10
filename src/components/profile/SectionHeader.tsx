interface SectionHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

/**
 * Reusable page-level heading block used in all profile sub-sections.
 */
export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl uppercase text-white font-display md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-white/50 font-sans">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

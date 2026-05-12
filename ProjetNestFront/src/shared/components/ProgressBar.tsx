interface ProgressBarProps {
  read: number;
  total: number;
}

export function ProgressBar({ read, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((read / total) * 100) : 0;
  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-slate-200">
        {read} / {total}
        <span className="ml-2 text-xs font-normal text-slate-500">{percent}%</span>
      </p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

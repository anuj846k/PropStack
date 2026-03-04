import { Building2 } from "lucide-react";

export function PropLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-blue-600 rounded-lg flex items-center justify-center p-1.5 shadow-sm text-white">
        <Building2 size={size - 8} strokeWidth={2.5} />
      </div>
    </div>
  );
}

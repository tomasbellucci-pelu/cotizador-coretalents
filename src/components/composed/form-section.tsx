import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-2xl border border-slate-200/80", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-sm text-slate-500 mt-0.5">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

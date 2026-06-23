import { cn } from "@/lib/utils";

/**
 * Standard page wrapper. Every screen should use this structure:
 *
 * <Page>
 *   <PageHeader ... />
 *   <PageBody>
 *     {content}
 *   </PageBody>
 * </Page>
 */
export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}

/**
 * Content area below PageHeader.
 * Use `narrow` for forms that should be centered and max-width constrained.
 */
export function PageBody({
  children,
  narrow,
  className,
}: {
  children: React.ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(narrow ? "mx-auto w-full max-w-2xl" : "max-w-none", className)}>
      {children}
    </div>
  );
}

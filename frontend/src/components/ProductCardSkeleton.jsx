export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 w-4/5 rounded skeleton" />
        <div className="h-3 w-2/5 rounded skeleton" />
        <div className="h-5 w-3/5 rounded skeleton" />
        <div className="h-9 w-full rounded-xl skeleton mt-1" />
      </div>
    </div>
  );
}

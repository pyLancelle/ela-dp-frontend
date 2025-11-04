export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Hello World
        </h1>
        <p className="text-center text-muted-foreground">
          Welcome to your shadcn/ui application
        </p>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">It works</h1>
        <p className="text-muted-foreground mt-2">
          Edit <code className="font-mono">src/app.tsx</code> and start building.
        </p>
      </div>
    </main>
  )
}

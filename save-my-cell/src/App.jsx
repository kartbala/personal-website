import { useEffect, useState } from 'react'
import { estimateSavings } from './utils'
import './index.css'

function App() {
  const [plans, setPlans] = useState([])
  const [bill, setBill] = useState('')
  const [lines, setLines] = useState(1)
  const [data, setData] = useState(5)
  const [results, setResults] = useState([])
  const [contrast, setContrast] = useState(false)

  useEffect(() => {
    fetch('/plans.json')
      .then((res) => res.json())
      .then(setPlans)
      .catch(() => {})
  }, [])

  function calculate() {
    if (!bill) return
    const billNum = Number(bill)
    const cheaper = plans
      .filter((p) => p.priceMonthly < billNum)
      .slice(0, 5)
      .map((p) => ({
        ...p,
        yearly: estimateSavings(billNum, p.priceMonthly),
      }))
    setResults(cheaper)
  }

  return (
    <div className={contrast ? 'dark bg-black text-white p-4' : 'p-4'}>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold" tabIndex="0">
          Save My Cell
        </h1>
        <button
          onClick={() => setContrast(!contrast)}
          className="border px-2 py-1 rounded focus:outline focus:outline-2"
        >
          {contrast ? 'Normal' : 'High Contrast'}
        </button>
      </header>
      <form
        aria-label="Savings form"
        className="space-y-3 mb-6"
        onSubmit={(e) => {
          e.preventDefault()
          calculate()
        }}
      >
        <div>
          <label htmlFor="bill" className="block font-medium">
            Current monthly bill ($)
          </label>
          <input
            id="bill"
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="lines" className="block font-medium">
            Number of lines
          </label>
          <input
            id="lines"
            type="number"
            min="1"
            value={lines}
            onChange={(e) => setLines(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="data" className="block font-medium">
            Monthly data need (GB)
          </label>
          <input
            id="data"
            type="range"
            min="1"
            max="100"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full"
          />
          <span>{data} GB</span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded focus:outline focus:outline-2"
        >
          Calculate
        </button>
      </form>
      <section aria-live="polite">
        {results.map((p) => (
          <article
            key={p.id}
            className="border rounded p-4 mb-4"
            tabIndex="0"
          >
            <h2 className="text-xl font-semibold mb-2">
              {p.carrier} {p.planName}
            </h2>
            <p>
              ${p.priceMonthly}/mo — Save ${p.yearly.toFixed(0)} per year
            </p>
            <ul className="list-disc ml-5">
              {p.data.highSpeedGB && (
                <li>{p.data.highSpeedGB} GB high-speed data</li>
              )}
              {p.hotspotMbps && <li>{p.hotspotMbps} Mbps hotspot</li>}
              <li>Network: {p.network}</li>
            </ul>
            <a
              href={`https://${p.carrier.replace(/\s+/g, '').toLowerCase()}.com`}
              className="text-blue-600 underline"
            >
              Visit carrier
            </a>
          </article>
        ))}
      </section>
    </div>
  )
}

export default App

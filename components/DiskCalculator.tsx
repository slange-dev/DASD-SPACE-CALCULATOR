// components/DiskCalculator.tsx
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function DiskCalculator() {
  const [inputSize, setInputSize] = useState('')
  const [unit, setUnit] = useState('MB')

  const diskTypes = [
    { model: '3380-J', cyls: 885, byteTrack: 47476, byteCyl: 712140, byteVol: 630 * 1024 * 1024 },
    { model: '3380-E', cyls: 1770, byteTrack: 47476, byteCyl: 712140, byteVol: 1.26 * 1024 * 1024 * 1024 },
    { model: '3380-K', cyls: 2655, byteTrack: 47476, byteCyl: 712140, byteVol: 1.89 * 1024 * 1024 * 1024 },
    { model: '3390-1', cyls: 1113, byteTrack: 56664, byteCyl: 849960, byteVol: 946 * 1024 * 1024 },
    { model: '3390-2', cyls: 2226, byteTrack: 56664, byteCyl: 849960, byteVol: 1.89 * 1024 * 1024 * 1024 },
    { model: '3390-3', cyls: 3339, byteTrack: 56664, byteCyl: 849960, byteVol: 2.83 * 1024 * 1024 * 1024 },
    { model: '3390-9', cyls: 10017, byteTrack: 56664, byteCyl: 849960, byteVol: 8.51 * 1024 * 1024 * 1024 },
    { model: '9345-1', cyls: 1440, byteTrack: 46456, byteCyl: 696840, byteVol: 1.0 * 1024 * 1024 * 1024 },
    { model: '9345-2', cyls: 2156, byteTrack: 46456, byteCyl: 696840, byteVol: 1.5 * 1024 * 1024 * 1024 }
  ]

  const calculateRequirements = (size: string) => {
    if (!size) return []
    
    // Convert input to bytes
    let bytes
    const numSize = parseFloat(size)
    switch (unit) {
      case 'GB':
        bytes = numSize * 1024 * 1024 * 1024
        break
      case 'MB':
        bytes = numSize * 1024 * 1024
        break
      case 'KB':
        bytes = numSize * 1024
        break
      default:
        bytes = numSize
    }

    return diskTypes.map(disk => {
      const tracks = Math.ceil(bytes / disk.byteTrack)
      const cylinders = Math.ceil(bytes / disk.byteCyl)
      const percentageUsed = (bytes / disk.byteVol) * 100

      return {
        ...disk,
        tracksNeeded: tracks,
        cylindersNeeded: cylinders,
        percentageUsed: percentageUsed
      }
    })
  }

  const results = calculateRequirements(inputSize)

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Disk Space Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="size">Required Space</Label>
            <Input
              id="size"
              type="number"
              value={inputSize}
              onChange={(e) => setInputSize(e.target.value)}
              placeholder="Enter size"
              className="mt-1"
            />
          </div>
          <div className="w-32">
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="GB">GB</option>
              <option value="MB">MB</option>
              <option value="KB">KB</option>
              <option value="B">Bytes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left border">Model</th>
                <th className="p-2 text-right border">Tracks Needed</th>
                <th className="p-2 text-right border">Cylinders Needed</th>
                <th className="p-2 text-right border">Disk Usage</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.model}>
                  <td className="p-2 border font-medium">{result.model}</td>
                  <td className="p-2 border text-right">{result.tracksNeeded.toLocaleString()}</td>
                  <td className="p-2 border text-right">{result.cylindersNeeded.toLocaleString()}</td>
                  <td className="p-2 border text-right">
                    {result.percentageUsed < 0.01 
                      ? '<0.01%' 
                      : `${result.percentageUsed.toFixed(2)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
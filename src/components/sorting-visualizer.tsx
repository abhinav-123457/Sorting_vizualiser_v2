"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shuffle, Play, Pause, BarChart, Info } from "lucide-react"

// Define algorithm types
type SortingAlgorithm = "Bubble Sort" | "Insertion Sort" | "Quick Sort" | "Merge Sort" | "Selection Sort" | null

// Define algorithm info
const algorithmInfo = {
  "Bubble Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  },
  "Insertion Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Builds the sorted array one item at a time by comparing each with the items before it.",
  },
  "Quick Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description:
      "Divides the array into smaller sub-arrays using a pivot element, then recursively sorts the sub-arrays.",
  },
  "Merge Sort": {
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Divides the array into halves, sorts them separately, then merges them back together.",
  },
  "Selection Sort": {
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
  },
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [arraySize, setArraySize] = useState<number>(30)
  const [speed, setSpeed] = useState<number>(50)
  const [isSorting, setIsSorting] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [sortingAlgorithm, setSortingAlgorithm] = useState<SortingAlgorithm>(null)
  const [isSorted, setIsSorted] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [comparisons, setComparisons] = useState<number>(0)
  const [swaps, setSwaps] = useState<number>(0)
  const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false)
  const [selectedAlgorithmInfo, setSelectedAlgorithmInfo] = useState<SortingAlgorithm>(null)
  const [activeTab, setActiveTab] = useState<string>("visualizer")

  // Reference to control sorting pause/resume
  const pauseRef = useRef<boolean>(false)

  const generateArray = () => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 400) + 10)
    setArray(arr)
    setIsSorted(false)
    setStatusMessage("")
    setComparisons(0)
    setSwaps(0)
  }

  const sleep = (ms: number) => {
    return new Promise<void>((resolve) => {
      const checkPause = () => {
        if (pauseRef.current) {
          setTimeout(checkPause, 100)
        } else {
          setTimeout(resolve, ms)
        }
      }
      checkPause()
    })
  }

  // Check if array is sorted
  const checkIfSorted = (arr: number[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false
    }
    return true
  }

  const handleSorting = async (sortFunc: () => Promise<void>) => {
    if (checkIfSorted(array)) {
      setStatusMessage("Array is already sorted!")
      return
    }
    setStatusMessage("Sorting in progress...")
    setComparisons(0)
    setSwaps(0)
    pauseRef.current = false
    setIsPaused(false)
    await sortFunc()
  }

  const togglePause = () => {
    pauseRef.current = !pauseRef.current
    setIsPaused(!isPaused)
    setStatusMessage(pauseRef.current ? "Sorting paused" : "Sorting resumed...")
  }

  const bubbleSort = async () => {
    setSortingAlgorithm("Bubble Sort")
    setIsSorting(true)
    const arr = [...array]
    let localComparisons = 0
    let localSwaps = 0

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        localComparisons++
        setComparisons(localComparisons)

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          localSwaps++
          setSwaps(localSwaps)
          setArray([...arr])
          await sleep(speed)
        }
      }
    }

    setIsSorting(false)
    setSortingAlgorithm(null)
    setIsSorted(true)
    setStatusMessage("Array sorted successfully!")
  }

  const insertionSort = async () => {
    setSortingAlgorithm("Insertion Sort")
    setIsSorting(true)
    const arr = [...array]
    let localComparisons = 0
    let localSwaps = 0

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1

      while (j >= 0) {
        localComparisons++
        setComparisons(localComparisons)

        if (arr[j] > key) {
          arr[j + 1] = arr[j]
          localSwaps++
          setSwaps(localSwaps)
          j--
          setArray([...arr])
          await sleep(speed)
        } else {
          break
        }
      }

      arr[j + 1] = key
      setArray([...arr])
      await sleep(speed)
    }

    setIsSorting(false)
    setSortingAlgorithm(null)
    setIsSorted(true)
    setStatusMessage("Array sorted successfully!")
  }

  const selectionSort = async () => {
    setSortingAlgorithm("Selection Sort")
    setIsSorting(true)
    const arr = [...array]
    let localComparisons = 0
    let localSwaps = 0

    for (let i = 0; i < arr.length; i++) {
      let minIdx = i

      for (let j = i + 1; j < arr.length; j++) {
        localComparisons++
        setComparisons(localComparisons)

        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        localSwaps++
        setSwaps(localSwaps)
        setArray([...arr])
        await sleep(speed)
      }
    }

    setIsSorting(false)
    setSortingAlgorithm(null)
    setIsSorted(true)
    setStatusMessage("Array sorted successfully!")
  }

  const quickSort = async (arr = [...array], start = 0, end = array.length - 1, isInitial = true) => {
    if (isInitial) {
      setSortingAlgorithm("Quick Sort")
      setIsSorting(true)
    }

    if (start < end) {
      const pivotIndex = await partition(arr, start, end)
      await quickSort(arr, start, pivotIndex - 1, false)
      await quickSort(arr, pivotIndex + 1, end, false)
    }

    if (isInitial) {
      setArray([...arr])
      setIsSorting(false)
      setSortingAlgorithm(null)
      setIsSorted(true)
      setStatusMessage("Array sorted successfully!")
    }
  }

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high]
    let i = low - 1
    let localComparisons = comparisons
    let localSwaps = swaps

    for (let j = low; j < high; j++) {
      localComparisons++
      setComparisons(localComparisons)

      if (arr[j] < pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        localSwaps++
        setSwaps(localSwaps)
        setArray([...arr])
        await sleep(speed)
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    localSwaps++
    setSwaps(localSwaps)
    setArray([...arr])
    await sleep(speed)
    return i + 1
  }

  const mergeSort = async (arr = [...array], l = 0, r = array.length - 1, isInitial = true) => {
    if (isInitial) {
      setSortingAlgorithm("Merge Sort")
      setIsSorting(true)
    }

    if (l < r) {
      const m = Math.floor((l + r) / 2)
      await mergeSort(arr, l, m, false)
      await mergeSort(arr, m + 1, r, false)
      await merge(arr, l, m, r)
    }

    if (isInitial) {
      setArray([...arr])
      setIsSorting(false)
      setSortingAlgorithm(null)
      setIsSorted(true)
      setStatusMessage("Array sorted successfully!")
    }
  }

  const merge = async (arr: number[], l: number, m: number, r: number) => {
    const n1 = m - l + 1
    const n2 = r - m
    const left = new Array(n1),
      right = new Array(n2)
    let localComparisons = comparisons
    let localSwaps = swaps

    for (let i = 0; i < n1; i++) left[i] = arr[l + i]
    for (let i = 0; i < n2; i++) right[i] = arr[m + 1 + i]

    let i = 0,
      j = 0,
      k = l
    while (i < n1 && j < n2) {
      localComparisons++
      setComparisons(localComparisons)

      if (left[i] <= right[j]) {
        arr[k] = left[i]
        i++
      } else {
        arr[k] = right[j]
        j++
      }

      localSwaps++
      setSwaps(localSwaps)
      setArray([...arr])
      await sleep(speed)
      k++
    }

    while (i < n1) {
      arr[k] = left[i]
      i++
      k++
      setArray([...arr])
      await sleep(speed)
    }

    while (j < n2) {
      arr[k] = right[j]
      j++
      k++
      setArray([...arr])
      await sleep(speed)
    }
  }

  const showAlgorithmInfo = (algorithm: SortingAlgorithm) => {
    if (!algorithm) return
    setSelectedAlgorithmInfo(algorithm)
    setInfoDialogOpen(true)
  }

  useEffect(() => {
    generateArray()
  }, [arraySize])

  const getBarColor = (value: number, index: number) => {
    if (isSorted) return "bg-emerald-500"
    return "bg-violet-500"
  }

  return (
    <div className="container mx-auto py-0 px-0 sm:py-6 sm:px-4">
      <Card className="overflow-hidden bg-background">
        <CardHeader className="border-b pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">Sorting Visualizer</CardTitle>
              <CardDescription>Visualize different sorting algorithms in action</CardDescription>
            </div>
            {sortingAlgorithm && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart className="h-3.5 w-3.5" />
                <span>{sortingAlgorithm}</span>
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
              <TabsTrigger value="metrics">Metrics & Info</TabsTrigger>
            </TabsList>

            <TabsContent value="visualizer" className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="default"
                  onClick={generateArray}
                  disabled={isSorting}
                  className="flex items-center gap-2"
                >
                  <Shuffle className="h-4 w-4" />
                  New Array
                </Button>

                <Select
                  disabled={isSorting}
                  onValueChange={(value) => {
                    const algo = value as SortingAlgorithm
                    if (algo === "Bubble Sort") handleSorting(bubbleSort)
                    else if (algo === "Insertion Sort") handleSorting(insertionSort)
                    else if (algo === "Quick Sort") handleSorting(() => quickSort())
                    else if (algo === "Merge Sort") handleSorting(() => mergeSort())
                    else if (algo === "Selection Sort") handleSorting(selectionSort)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bubble Sort">Bubble Sort</SelectItem>
                    <SelectItem value="Insertion Sort">Insertion Sort</SelectItem>
                    <SelectItem value="Quick Sort">Quick Sort</SelectItem>
                    <SelectItem value="Merge Sort">Merge Sort</SelectItem>
                    <SelectItem value="Selection Sort">Selection Sort</SelectItem>
                  </SelectContent>
                </Select>

                {isSorting && (
                  <Button variant="outline" onClick={togglePause} className="flex items-center gap-2">
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => showAlgorithmInfo(sortingAlgorithm || "Bubble Sort")}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Algorithm Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View algorithm details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Array Size: {arraySize}</span>
                  </div>
                  <Slider
                    value={[arraySize]}
                    min={5}
                    max={100}
                    step={1}
                    onValueChange={(value) => setArraySize(value[0])}
                    disabled={isSorting}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Sorting Speed: {speed} ms</span>
                  </div>
                  <Slider
                    value={[speed]}
                    min={10}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setSpeed(value[0])}
                    disabled={isSorting}
                  />
                </div>
              </div>

              {statusMessage && (
                <Alert variant={isSorted ? "default" : isPaused ? "destructive" : "default"} className="my-4">
                  <AlertDescription>{statusMessage}</AlertDescription>
                </Alert>
              )}

              <div className="h-[400px] flex items-end justify-center gap-[2px] border-b pb-2 overflow-hidden">
                {array.map((value, idx) => (
                  <div
                    key={idx}
                    className={`${getBarColor(value, idx)} transition-all duration-100 rounded-t-sm`}
                    style={{
                      height: `${value}px`,
                      width: `${Math.max(2, Math.min(20, 800 / arraySize))}px`,
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-xs text-muted-foreground mb-2">Comparisons</div>
                    <div className="text-2xl font-mono font-semibold">{comparisons}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-xs text-muted-foreground mb-2">Swaps</div>
                    <div className="text-2xl font-mono font-semibold">{swaps}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-xs text-muted-foreground mb-2">Array Size</div>
                    <div className="text-2xl font-mono font-semibold">{array.length}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Algorithm Complexities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(algorithmInfo).map(([name, info]) => (
                    <Card key={name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-xs text-muted-foreground">Time</div>
                          <div className="text-sm font-mono">{info.timeComplexity}</div>
                          <div className="text-xs text-muted-foreground">Space</div>
                          <div className="text-sm font-mono">{info.spaceComplexity}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        {selectedAlgorithmInfo && algorithmInfo[selectedAlgorithmInfo] && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedAlgorithmInfo}</DialogTitle>
              <DialogDescription>{algorithmInfo[selectedAlgorithmInfo].description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Time Complexity</div>
                <div className="text-lg font-mono font-medium">
                  {algorithmInfo[selectedAlgorithmInfo].timeComplexity}
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Space Complexity</div>
                <div className="text-lg font-mono font-medium">
                  {algorithmInfo[selectedAlgorithmInfo].spaceComplexity}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

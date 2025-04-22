"use client"

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModernButton } from "@/components/ui/modern-button"

// Simple placeholder component instead of Three.js to avoid scope errors
function SimplePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl">
      <div className="text-center">
        <div className="inline-block p-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4 animate-pulse">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 border-dashed animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold">Interactive 3D Experience</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize dynamic 3D elements with interactive controls</p>
      </div>
    </div>
  )
}

export default function ThreeDSection() {
  const sectionRef = useRef(null)
  const [activeTab, setActiveTab] = useState("tab1")
  const [isLoading, setIsLoading] = useState(false)

  const handleButtonClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <section ref={sectionRef} className="py-20 px-4" id="projects">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
          Immersive 3D Experience
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Interact with our 3D elements for a unique visual experience.
        </p>

        <div className="h-[500px] mb-8 bg-gradient-to-b from-gray-900/20 to-emerald-900/20 dark:from-gray-900/50 dark:to-emerald-900/30 rounded-xl overflow-hidden">
          <SimplePlaceholder />
        </div>

        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="tab1" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Perspective 1</TabsTrigger>
              <TabsTrigger value="tab2">Perspective 2</TabsTrigger>
              <TabsTrigger value="tab3">Perspective 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Dynamic Geometry</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Experience the beauty of mathematical precision with our dynamic 3D models.
              </p>
              <ModernButton isLoading={isLoading && activeTab === "tab1"} onClick={handleButtonClick}>
                LEARN MORE
              </ModernButton>
            </TabsContent>
            <TabsContent value="tab2" className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Interactive Elements</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Engage with responsive 3D objects that react to your interactions.
              </p>
              <ModernButton isLoading={isLoading && activeTab === "tab2"} onClick={handleButtonClick}>
                EXPLORE FEATURES
              </ModernButton>
            </TabsContent>
            <TabsContent value="tab3" className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Immersive Environment</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Dive into a fully realized 3D space with realistic lighting and effects.
              </p>
              <ModernButton isLoading={isLoading && activeTab === "tab3"} onClick={handleButtonClick}>
                VIEW GALLERY
              </ModernButton>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

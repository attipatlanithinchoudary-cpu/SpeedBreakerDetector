// Fallback storage when Firebase is not available
const STORAGE_KEY = "roadguard_hazards"

const DEMO_HAZARDS = [
  {
    id: "demo_speed_breaker_1",
    type: "speed_breaker",
    severity: "high",
    lat: 28.6139,
    lng: 77.209,
    source: "demo_motion_detection",
    confidence: 0.92,
    voteYes: 18,
    voteNo: 1,
    verified: true,
    isDemo: true,
  },
  {
    id: "demo_pothole_1",
    type: "pothole",
    severity: "medium",
    lat: 28.6152,
    lng: 77.2111,
    source: "demo_community_report",
    confidence: 0.76,
    voteYes: 11,
    voteNo: 2,
    verified: false,
    isDemo: true,
  },
  {
    id: "demo_manhole_1",
    type: "manhole",
    severity: "low",
    lat: 28.6124,
    lng: 77.2076,
    source: "demo_route_scan",
    confidence: 0.64,
    voteYes: 7,
    voteNo: 0,
    verified: false,
    isDemo: true,
  },
]

export const saveHazardLocally = (hazardData) => {
  try {
    const hazards = getLocalHazards()
    const newHazard = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...hazardData,
      createdAt: new Date().toISOString(),
      voteYes: 0,
      voteNo: 0,
      isLocal: true, // Mark as local-only
    }
    hazards.push(newHazard)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hazards))
    console.log("[v0] Hazard saved locally:", newHazard.id)
    return newHazard.id
  } catch (error) {
    console.error("[v0] Error saving to localStorage:", error)
    return null
  }
}

export const getLocalHazards = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const hazards = stored ? JSON.parse(stored) : DEMO_HAZARDS

    // Normalize legacy hazard types
    return hazards.map((hazard) => ({
      ...hazard,
      type: hazard.type === "manhole" ? "pothole" : hazard.type,
    }))
  } catch (error) {
    console.error("[v0] Error reading from localStorage:", error)
    return []
  }
}


// export const getLocalHazards = () => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY)
//     return stored ? JSON.parse(stored) : []
//   } catch (error) {
//     console.error("[v0] Error reading from localStorage:", error)
//     return []
//   }
// }

export const updateLocalHazard = (hazardId, updates) => {
  try {
    const hazards = getLocalHazards()
    const index = hazards.findIndex((h) => h.id === hazardId)
    if (index !== -1) {
      hazards[index] = { ...hazards[index], ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hazards))
    }
  } catch (error) {
    console.error("[v0] Error updating localStorage:", error)
  }
}

export const deleteLocalHazard = (hazardId) => {
  try {
    const hazards = getLocalHazards().filter((h) => h.id !== hazardId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hazards))
  } catch (error) {
    console.error("[v0] Error deleting from localStorage:", error)
  }
}

export const clearLocalHazards = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("[v0] Error clearing localStorage:", error)
  }
}

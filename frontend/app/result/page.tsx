'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ArrowLeft, MapPin, Clock, DollarSign, Mountain, Microscope, AlertTriangle, Sparkles, Camera, Footprints, UtensilsCrossed, BookOpen, Eye, Shield, Car, Calendar, Search, Hotel, Compass, Sun, Sunset, Moon, Users } from 'lucide-react'
import Image from 'next/image'

const RouteMap = dynamic(() => import('../components/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-carbon-light rounded-lg flex items-center justify-center">
      <p className="text-off-white/50">Loading map...</p>
    </div>
  ),
})

interface TimeBlock {
  start_time: string
  duration_minutes: number
  activity: string
  photo_tip?: string
  logistics?: string
  dining_tip?: string
}

interface DailyItinerary {
  day_number: number
  location: string
  image_keyword: string
  morning?: TimeBlock
  afternoon?: TimeBlock
  evening?: TimeBlock
  daily_driving_time?: string
  vehicle_safety?: string
  daily_budget_per_person?: number
  accommodation_search_query?: string
  viator_activity_query?: string
}

interface VehicleRecommendation {
  drivetrain: string
  clearance: string
  safety_gear: string[]
  notes: string
}

interface Marker {
  sequence: number
  name: string
  type: string
  coordinates: { lat: number; lon: number }
}

interface InterestHighlight {
  category: string
  advice: string
}

interface Itinerary {
  itinerary_id: string
  created_at: string
  trip_summary: string
  season_info: string
  itinerary_markdown: string
  itinerary_daily?: DailyItinerary[]
  vehicle_recommendation?: VehicleRecommendation
  route_coordinates?: Array<{ lat: number; lon: number }>
  is_round_trip?: boolean
  markers?: Marker[]
  interest_highlights?: InterestHighlight[]
  logistics: {
    total_distance_km: number
    estimated_driving_hours: number
    fuel_stops: any[]
    accommodation_points: any[]
    safety_warnings: string[]
  }
  budget: {
    number_of_persons?: number
    fuel_cost: number
    toll_fees: number
    accommodation: number
    meals: number
    activities: number
    subtotal: number
    buffer_fund: number
    total: number
  }
  activities: any[]
  science_points: any[]
  risk_warnings: string[]
  packing_list: string[]
  payment_status: string
}

export default function ResultPage() {
  const router = useRouter()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [showGenieDialog, setShowGenieDialog] = useState(false)
  const [refinementRequest, setRefinementRequest] = useState('')
  const [refining, setRefining] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleImageError = (imageKey: string) => {
    setFailedImages(prev => new Set(prev).add(imageKey))
  }

  useEffect(() => {
    const data = sessionStorage.getItem('itinerary')
    if (!data) {
      console.error('No itinerary data found in sessionStorage')
      router.push('/')
      return
    }
    try {
      const parsedData = JSON.parse(data)
      console.log('Loaded itinerary:', parsedData)
      setItinerary(parsedData)
    } catch (error) {
      console.error('Failed to parse itinerary data:', error)
      router.push('/')
    }
  }, [router])

  const handleRefinement = async () => {
    if (!refinementRequest.trim() || !itinerary) return

    setRefining(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${baseUrl}/api/itinerary/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_itinerary: itinerary,
          refinement_request: refinementRequest
        }),
      })

      if (!response.ok) throw new Error('Refinement failed')

      const refinedData = await response.json()
      console.log('[REFINE] Success:', refinedData)

      setItinerary(refinedData)
      sessionStorage.setItem('itinerary', JSON.stringify(refinedData))
      setShowGenieDialog(false)
      setRefinementRequest('')
      alert('Genie has refined your itinerary!')
    } catch (error) {
      console.error('Refinement error:', error)
      alert('Genie encountered an issue. Please try again.')
    } finally {
      setRefining(false)
    }
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
        <p className="text-off-white/70">Loading itinerary...</p>
      </div>
    )
  }

  const budgetData = [
    { name: 'Fuel', value: itinerary.budget?.fuel_cost || 0, color: '#2D5A27' },
    { name: 'Accommodation', value: itinerary.budget?.accommodation || 0, color: '#3A7A35' },
    { name: 'Meals', value: itinerary.budget?.meals || 0, color: '#4A9A45' },
    { name: 'Activities', value: itinerary.budget?.activities || 0, color: '#5BAF60' },
    { name: 'Buffer (10%)', value: itinerary.budget?.buffer_fund || 0, color: '#004A7C' },
  ]

  const interestIcons: Record<string, { icon: React.ReactNode; label: string }> = {
    photography: { icon: <Camera className="w-4 h-4" />, label: 'Photography' },
    geology: { icon: <Microscope className="w-4 h-4" />, label: 'Geology' },
    hiking: { icon: <Footprints className="w-4 h-4" />, label: 'Hiking' },
    local_food: { icon: <UtensilsCrossed className="w-4 h-4" />, label: 'Local Food' },
    history: { icon: <BookOpen className="w-4 h-4" />, label: 'History' },
    architecture: { icon: <Mountain className="w-4 h-4" />, label: 'Architecture' },
    adventure_sports: { icon: <Compass className="w-4 h-4" />, label: 'Adventure Sports' },
    wellness: { icon: <Sparkles className="w-4 h-4" />, label: 'Wellness' },
    general: { icon: <Eye className="w-4 h-4" />, label: 'General' },
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-carbon-light">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-off-white/70 hover:text-off-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-forest-green" />
            <span className="font-semibold">AI Roadtrip Genie</span>
          </div>

          <button className="bg-forest-green hover:bg-forest-green-light px-6 py-2 rounded-lg transition-colors">
            Export PDF
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl overflow-hidden"
            >
              {!failedImages.has('hero-banner') ? (
                <div className="relative w-full h-64">
                  <Image
                    src="https://loremflickr.com/1200/400/roadtrip,mountains,landscape"
                    alt="Trip banner"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => handleImageError('hero-banner')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-4xl font-bold text-gradient drop-shadow-lg">
                      {itinerary.trip_summary}
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="w-full py-8 px-6 bg-gradient-to-r from-arcteryx-blue/20 to-arcteryx-cyan/20">
                  <h1 className="text-4xl font-bold text-gradient">
                    {itinerary.trip_summary}
                  </h1>
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap gap-4 text-sm text-off-white/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{itinerary.logistics?.total_distance_km || 0} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{itinerary.logistics?.estimated_driving_hours || 0} hrs driving</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>${(itinerary.budget?.total || 0).toFixed(2)} total</span>
                  </div>
                  {itinerary.is_round_trip && (
                    <div className="flex items-center gap-1 text-arcteryx-cyan">
                      <span>Round Trip</span>
                    </div>
                  )}
                </div>
                {itinerary.season_info && (
                  <div className="mt-4 px-4 py-2 bg-forest-green/20 border border-forest-green rounded-lg text-sm">
                    {itinerary.season_info}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Gear & Safety Card - Vehicle Recommendation */}
            {itinerary.vehicle_recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="glass-effect rounded-xl p-6 border border-arcteryx-blue/30"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-arcteryx-blue" />
                  Gear &amp; Safety
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-arcteryx-blue/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-4 h-4 text-arcteryx-cyan" />
                      <span className="text-xs font-semibold text-arcteryx-cyan">Drivetrain</span>
                    </div>
                    <p className="text-lg font-bold text-off-white">{itinerary.vehicle_recommendation.drivetrain}</p>
                  </div>
                  <div className="p-4 bg-arcteryx-blue/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mountain className="w-4 h-4 text-arcteryx-cyan" />
                      <span className="text-xs font-semibold text-arcteryx-cyan">Ground Clearance</span>
                    </div>
                    <p className="text-lg font-bold text-off-white">{itinerary.vehicle_recommendation.clearance}</p>
                  </div>
                  <div className="p-4 bg-arcteryx-blue/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-arcteryx-cyan" />
                      <span className="text-xs font-semibold text-arcteryx-cyan">Safety Gear</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(itinerary.vehicle_recommendation.safety_gear || []).map((gear, i) => (
                        <span key={i} className="text-xs bg-arcteryx-blue/20 text-arcteryx-cyan px-2 py-1 rounded">
                          {gear}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {itinerary.vehicle_recommendation.notes && (
                  <p className="mt-4 text-sm text-off-white/70 italic">{itinerary.vehicle_recommendation.notes}</p>
                )}
              </motion.div>
            )}

            {/* Daily Itinerary Cards */}
            {itinerary.itinerary_daily && itinerary.itinerary_daily.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gradient">Daily Itinerary</h2>
                {itinerary.itinerary_daily.map((day, index) => {
                  const gradients = [
                    'from-arcteryx-blue to-arcteryx-cyan',
                    'from-forest-green to-forest-green-light',
                    'from-arcteryx-cyan to-forest-green',
                  ]
                  const gradient = gradients[index % gradients.length]

                  return (
                    <motion.div
                      key={day.day_number}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                      className="glass-effect rounded-xl overflow-hidden"
                    >
                      {/* Hero Image with fallback */}
                      {!failedImages.has(`day-${day.day_number}`) ? (
                        <div className="relative w-full h-64">
                          <Image
                            src={`https://loremflickr.com/1200/600/${encodeURIComponent(day.image_keyword || 'landscape')}`}
                            alt={`Day ${day.day_number}: ${day.location}`}
                            fill
                            className="object-cover"
                            unoptimized
                            onError={() => handleImageError(`day-${day.day_number}`)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/70 to-transparent" />

                          {/* Day Badge */}
                          <div className={`absolute top-4 left-4 bg-gradient-to-r ${gradient} px-6 py-2 rounded-full shadow-lg`}>
                            <span className="text-white font-bold">Day {day.day_number}</span>
                          </div>

                          {/* Daily Budget + Driving Time Badges */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            {day.daily_driving_time && (
                              <div className="bg-carbon/80 backdrop-blur-sm px-3 py-2 rounded-full">
                                <span className="text-arcteryx-cyan font-semibold text-xs">{day.daily_driving_time}</span>
                              </div>
                            )}
                            {day.daily_budget_per_person != null && day.daily_budget_per_person > 0 && (
                              <div className="bg-carbon/80 backdrop-blur-sm px-3 py-2 rounded-full">
                                <span className="text-forest-green-light font-semibold text-xs">${day.daily_budget_per_person.toFixed(0)}/person</span>
                              </div>
                            )}
                          </div>

                          {/* Location Title */}
                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                              {day.location}
                            </h3>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full py-6 px-6 bg-gradient-to-r from-arcteryx-blue/20 to-arcteryx-cyan/20">
                          {/* Day Badge */}
                          <div className={`inline-block bg-gradient-to-r ${gradient} px-6 py-2 rounded-full shadow-lg mb-4`}>
                            <span className="text-white font-bold">Day {day.day_number}</span>
                          </div>
                          {/* Badges */}
                          <div className="flex gap-2 mb-4">
                            {day.daily_driving_time && (
                              <div className="bg-carbon/80 backdrop-blur-sm px-3 py-2 rounded-full">
                                <span className="text-arcteryx-cyan font-semibold text-xs">{day.daily_driving_time}</span>
                              </div>
                            )}
                            {day.daily_budget_per_person != null && day.daily_budget_per_person > 0 && (
                              <div className="bg-carbon/80 backdrop-blur-sm px-3 py-2 rounded-full">
                                <span className="text-forest-green-light font-semibold text-xs">${day.daily_budget_per_person.toFixed(0)}/person</span>
                              </div>
                            )}
                          </div>
                          {/* Location Title */}
                          <h3 className="text-3xl font-bold text-white">
                            {day.location}
                          </h3>
                        </div>
                      )}

                      {/* V2.0 Morning/Afternoon/Evening Structure */}
                      <div className="p-6 space-y-4">
                        {/* Morning Block */}
                        {day.morning && (
                          <div className="p-4 bg-amber-900/10 border border-amber-700/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Sun className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-semibold text-amber-400">Morning</span>
                              <span className="text-xs text-off-white/50 font-mono">{day.morning.start_time}</span>
                              <span className="text-xs text-off-white/40">({day.morning.duration_minutes} min)</span>
                            </div>
                            <p className="text-sm text-off-white/85 leading-relaxed mb-2">{day.morning.activity}</p>
                            {day.morning.photo_tip && (
                              <p className="text-xs text-amber-300/70 italic flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {day.morning.photo_tip}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Afternoon Block */}
                        {day.afternoon && (
                          <div className="p-4 bg-arcteryx-cyan/10 border border-arcteryx-cyan/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Sunset className="w-4 h-4 text-arcteryx-cyan" />
                              <span className="text-xs font-semibold text-arcteryx-cyan">Afternoon</span>
                              <span className="text-xs text-off-white/50 font-mono">{day.afternoon.start_time}</span>
                              <span className="text-xs text-off-white/40">({day.afternoon.duration_minutes} min)</span>
                            </div>
                            <p className="text-sm text-off-white/85 leading-relaxed mb-2">{day.afternoon.activity}</p>
                            {day.afternoon.logistics && (
                              <p className="text-xs text-arcteryx-cyan/70 italic flex items-center gap-1">
                                <Car className="w-3 h-3" />
                                {day.afternoon.logistics}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Evening Block */}
                        {day.evening && (
                          <div className="p-4 bg-purple-900/10 border border-purple-700/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Moon className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-semibold text-purple-400">Evening</span>
                              <span className="text-xs text-off-white/50 font-mono">{day.evening.start_time}</span>
                              <span className="text-xs text-off-white/40">({day.evening.duration_minutes} min)</span>
                            </div>
                            <p className="text-sm text-off-white/85 leading-relaxed mb-2">{day.evening.activity}</p>
                            {day.evening.dining_tip && (
                              <p className="text-xs text-purple-300/70 italic flex items-center gap-1">
                                <UtensilsCrossed className="w-3 h-3" />
                                {day.evening.dining_tip}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Vehicle Safety */}
                        {day.vehicle_safety && (
                          <div className="p-3 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
                            <p className="text-xs font-semibold text-yellow-500 mb-1 flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Vehicle &amp; Safety
                            </p>
                            <p className="text-xs text-off-white/75">{day.vehicle_safety}</p>
                          </div>
                        )}

                        {/* Booking Search Queries */}
                        {(day.accommodation_search_query || day.viator_activity_query) && (
                          <div className="grid md:grid-cols-2 gap-3 pt-2">
                            {day.accommodation_search_query && (
                              <a
                                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(day.accommodation_search_query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-carbon-light/50 border border-carbon-light rounded-lg hover:border-arcteryx-cyan/50 transition-colors group"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Hotel className="w-3 h-3 text-arcteryx-cyan" />
                                  <span className="text-xs font-semibold text-arcteryx-cyan">Find Accommodation</span>
                                  <Search className="w-3 h-3 text-off-white/40 group-hover:text-arcteryx-cyan ml-auto" />
                                </div>
                                <p className="text-xs text-off-white/60 truncate">{day.accommodation_search_query}</p>
                              </a>
                            )}
                            {day.viator_activity_query && (
                              <a
                                href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(day.viator_activity_query)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-carbon-light/50 border border-carbon-light rounded-lg hover:border-forest-green/50 transition-colors group"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Compass className="w-3 h-3 text-forest-green" />
                                  <span className="text-xs font-semibold text-forest-green">Find Tours</span>
                                  <Search className="w-3 h-3 text-off-white/40 group-hover:text-forest-green ml-auto" />
                                </div>
                                <p className="text-xs text-off-white/60 truncate">{day.viator_activity_query}</p>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Markdown Content (Fallback) */}
            {!itinerary.itinerary_daily && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-effect rounded-xl p-8"
              >
                <MarkdownRenderer content={itinerary.itinerary_markdown} />
              </motion.div>
            )}

            {/* Interest Highlights */}
            {itinerary.interest_highlights && itinerary.interest_highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-effect rounded-xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-arcteryx-cyan" />
                  Interest Highlights
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {itinerary.interest_highlights.map((highlight, index) => {
                    const meta = interestIcons[highlight.category] || { icon: <Sparkles className="w-4 h-4" />, label: highlight.category }
                    return (
                      <div
                        key={index}
                        className="p-4 bg-carbon-light/50 border border-carbon-light rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-arcteryx-cyan">{meta.icon}</span>
                          <span className="text-sm font-semibold text-off-white">{meta.label}</span>
                        </div>
                        <p className="text-sm text-off-white/75 leading-relaxed">{highlight.advice}</p>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Route Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-forest-green" />
                Route Map
                {itinerary.is_round_trip && (
                  <span className="text-xs text-arcteryx-cyan ml-2">(Round Trip)</span>
                )}
              </h3>
              <RouteMap
                routeCoordinates={itinerary.route_coordinates}
                markers={itinerary.markers}
                isRoundTrip={itinerary.is_round_trip}
                fuelStops={itinerary.logistics?.fuel_stops || []}
                accommodationPoints={itinerary.logistics?.accommodation_points || []}
                sciencePoints={itinerary.science_points || []}
              />
            </motion.div>

            {/* Financial Audit Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-effect rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-forest-green" />
                Financial Summary
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Budget Table */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-carbon-light">
                    <span className="text-off-white/70">Fuel</span>
                    <span className="font-semibold text-lg">${(itinerary.budget?.fuel_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-carbon-light">
                    <span className="text-off-white/70">Tolls</span>
                    <span className="font-semibold text-lg">${(itinerary.budget?.toll_fees || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-carbon-light">
                    <span className="text-off-white/70">Accommodation</span>
                    <span className="font-semibold text-lg">${(itinerary.budget?.accommodation || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-carbon-light">
                    <span className="text-off-white/70">Meals</span>
                    <span className="font-semibold text-lg">${(itinerary.budget?.meals || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-carbon-light">
                    <span className="text-off-white/70">Activities</span>
                    <span className="font-semibold text-lg">${(itinerary.budget?.activities || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t-2 border-carbon-light mt-4">
                    <span className="text-off-white font-medium">Subtotal</span>
                    <span className="font-bold text-xl">${(itinerary.budget?.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-arcteryx-blue/10 rounded-lg px-4">
                    <span className="text-arcteryx-cyan font-medium">10% Buffer Fund (Risk Reserve)</span>
                    <span className="font-bold text-xl text-arcteryx-cyan">${(itinerary.budget?.buffer_fund || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-forest-green/20 to-forest-green/10 rounded-lg px-4 mt-4">
                    <span className="text-forest-green font-bold text-xl">Total</span>
                    <span className="font-bold text-2xl text-forest-green">${(itinerary.budget?.total || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Budget Visualization */}
                <div className="flex flex-col justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1E',
                          border: '1px solid #2D5A27',
                          borderRadius: '8px',
                          color: '#F5F5F5',
                        }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    {budgetData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-off-white/70">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Quick Budget Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-forest-green" />
                Budget Summary
              </h3>
              {itinerary.budget?.number_of_persons && (
                <p className="text-xs text-off-white/60 mb-4 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  For {itinerary.budget.number_of_persons} traveler{itinerary.budget.number_of_persons > 1 ? 's' : ''}
                </p>
              )}

              <div className="mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E1E1E',
                        border: '1px solid #2D5A27',
                        borderRadius: '8px',
                        color: '#F5F5F5',
                      }}
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-off-white/70">Fuel</span>
                  <span className="font-semibold">${(itinerary.budget?.fuel_cost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-off-white/70">Accommodation</span>
                  <span className="font-semibold">${(itinerary.budget?.accommodation || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-off-white/70">Meals</span>
                  <span className="font-semibold">${(itinerary.budget?.meals || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-off-white/70">Activities</span>
                  <span className="font-semibold">${(itinerary.budget?.activities || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-carbon-light">
                  <span className="text-off-white/70">Subtotal</span>
                  <span className="font-semibold">${(itinerary.budget?.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-arcteryx-cyan">
                  <span>Buffer (10%)</span>
                  <span className="font-semibold">${(itinerary.budget?.buffer_fund || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-carbon-light text-lg font-bold">
                  <span>Total</span>
                  <span className="text-forest-green">${(itinerary.budget?.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Science Points */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-forest-green" />
                Science Points
              </h3>
              <div className="space-y-6">
                {(itinerary.science_points || []).slice(0, 3).map((point, index) => (
                  <div key={index} className="pb-6 border-b border-carbon-light last:border-0 last:pb-0">
                    {!failedImages.has(`science-${index}`) && (
                      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-carbon-light">
                        <Image
                          src={`https://loremflickr.com/400/200/${encodeURIComponent(point?.name || 'nature,landscape')},geology`}
                          alt={point?.name || 'Science point'}
                          fill
                          className="object-cover"
                          unoptimized
                          onError={() => handleImageError(`science-${index}`)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 to-transparent" />
                      </div>
                    )}
                    <h4 className="font-semibold mb-2 text-forest-green-light">
                      {point?.name || 'Observation Point'}
                    </h4>
                    <p className="text-sm text-off-white/70 line-clamp-3">
                      {point?.scientific_explanation || 'No description available'}
                    </p>
                  </div>
                ))}
                {(!itinerary.science_points || itinerary.science_points.length === 0) && (
                  <p className="text-sm text-off-white/50">No science points available</p>
                )}
              </div>
            </motion.div>

            {/* Safety Warnings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-xl p-6 border border-yellow-700/30"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Risk Warnings
              </h3>
              <ul className="space-y-3 text-sm">
                {(itinerary.risk_warnings || []).map((warning, index) => (
                  <li key={index} className="flex gap-2 text-off-white/80">
                    <span className="text-yellow-500 mt-0.5">&#8226;</span>
                    <span>{warning}</span>
                  </li>
                ))}
                {(!itinerary.risk_warnings || itinerary.risk_warnings.length === 0) && (
                  <li className="text-off-white/50">No risk warnings</li>
                )}
              </ul>
            </motion.div>

            {/* Packing List */}
            {itinerary.packing_list && itinerary.packing_list.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-effect rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">Packing List</h3>
                <ul className="space-y-2 text-sm">
                  {itinerary.packing_list.map((item, index) => (
                    <li key={index} className="flex gap-2 text-off-white/80">
                      <span className="text-forest-green mt-0.5">&#8226;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Logistics Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Logistics</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-off-white/70">Fuel Stops:</span>
                  <span className="font-semibold ml-2">{itinerary.logistics?.fuel_stops?.length || 0}</span>
                </div>
                <div>
                  <span className="text-off-white/70">Accommodation:</span>
                  <span className="font-semibold ml-2">{itinerary.logistics?.accommodation_points?.length || 0} nights</span>
                </div>
                <div>
                  <span className="text-off-white/70">Activities:</span>
                  <span className="font-semibold ml-2">{itinerary.activities?.length || 0}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Genie Assistant Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setShowGenieDialog(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-arcteryx-blue to-arcteryx-cyan rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        title="Genie Assistant"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.button>

      {/* Genie Assistant Dialog */}
      {showGenieDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowGenieDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-effect rounded-2xl p-8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-arcteryx-blue to-arcteryx-cyan rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gradient">Genie Assistant</h3>
                  <p className="text-sm text-off-white/60">Intelligent itinerary refinement</p>
                </div>
              </div>
              <button
                onClick={() => setShowGenieDialog(false)}
                className="text-off-white/50 hover:text-off-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-off-white/80">
                  Tell Genie what you want to adjust
                </label>
                <textarea
                  value={refinementRequest}
                  onChange={(e) => setRefinementRequest(e.target.value)}
                  placeholder={"Examples:\n\u2022 Cut budget in half to $500\n\u2022 Add more photography stops\n\u2022 Reduce activity intensity\n\u2022 Make it a round trip"}
                  className="input-field min-h-[150px] resize-none"
                  disabled={refining}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowGenieDialog(false)}
                  className="flex-1 px-6 py-3 bg-carbon-light hover:bg-carbon rounded-lg transition-colors"
                  disabled={refining}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefinement}
                  disabled={!refinementRequest.trim() || refining}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {refining ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Refining...
                    </span>
                  ) : (
                    'Refine Itinerary'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

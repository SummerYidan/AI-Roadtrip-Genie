'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mountain, Car, Compass, Sparkles, RotateCcw, Users } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [retryMessage, setRetryMessage] = useState('')
  const [formData, setFormData] = useState({
    start_location: '',
    end_location: '',
    trip_duration: 7,
    start_date: '',
    number_of_persons: 2,
    is_round_trip: false,
    vehicle_type: 'suv',
    interests: [] as string[],
    activity_level: 'moderate',
    include_offroad: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setRetryMessage('')

    const MAX_RETRIES = 2
    const RETRY_MESSAGES = [
      'Optimizing vehicle-terrain compatibility...',
      'Fine-tuning photography parameters...',
      'Deep-scanning geological observation points...'
    ]

    console.log('==================== Starting Generation ====================')
    console.log('1. Form data:', JSON.stringify(formData, null, 2))

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          const message = RETRY_MESSAGES[Math.min(attempt - 1, RETRY_MESSAGES.length - 1)]
          setRetryMessage(message)
          console.log(`[RETRY] Attempt ${attempt}: ${message}`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const apiUrl = `${baseUrl}/api/itinerary/generate`
        console.log(`2. [Attempt ${attempt + 1}/${MAX_RETRIES + 1}] POST to:`, apiUrl)

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        console.log('3. Response:', response.status, response.statusText)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('4. Error response:', errorText)
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { detail: errorText || response.statusText }
          }

          if ((response.status === 500 || response.status === 429) && attempt < MAX_RETRIES) {
            console.warn(`[RETRY] Got ${response.status}, retrying ${attempt + 1}/${MAX_RETRIES}`)
            if (response.status === 429) {
              setRetryMessage('Genie is calibrating global road data...')
              await new Promise(resolve => setTimeout(resolve, 5000))
            }
            continue
          }

          let userMessage = 'Genie encountered an issue. Please try again.'
          if (response.status === 500) {
            userMessage = 'Genie\'s engine hit a snag.\n\nOur AI is working on a fix. Please try again shortly.\n\nCheck the console (F12) for details.'
          } else if (response.status === 429) {
            userMessage = 'Genie is calibrating global road data...\n\nAPI quota reached. Please wait 60 seconds and try again.'
          } else if (response.status === 401 || response.status === 403) {
            userMessage = 'Authorization required.\n\nAPI key configuration error. Please contact support.'
          }

          alert(userMessage)
          console.error(`HTTP ${response.status}: ${errorData.detail || response.statusText}`)
          throw new Error(errorData.detail || response.statusText)
        }

        let data
        try {
          data = await response.json()
          console.log('5. Data received, markdown length:', data.itinerary_markdown?.length || 0)
        } catch (jsonError) {
          console.error('JSON parse failed:', jsonError)
          if (attempt < MAX_RETRIES) {
            console.warn(`[RETRY] JSON parse failed, retrying ${attempt + 1}/${MAX_RETRIES}`)
            continue
          }
          throw new Error('Failed to parse AI response data')
        }

        // Validate core assets
        const hasBufferFund = data.budget?.buffer_fund && typeof data.budget.buffer_fund === 'number'
        const hasDailyData = data.itinerary_daily && data.itinerary_daily.length > 0

        console.log('[VALIDATE] Core assets:', {
          buffer_fund: hasBufferFund ? 'OK' : 'MISSING',
          daily_data: hasDailyData ? 'OK' : 'MISSING',
        })

        if ((!hasBufferFund || !hasDailyData) && attempt < MAX_RETRIES) {
          console.warn(`[RETRY] Core assets incomplete, retrying ${attempt + 1}/${MAX_RETRIES}`)
          continue
        }

        sessionStorage.setItem('itinerary', JSON.stringify(data))
        console.log('6. Data saved to sessionStorage')
        router.push('/result')
        return

      } catch (error) {
        console.error('==================== Error ====================')
        console.error('Error:', error)

        const errorMessage = error instanceof Error ? error.message : String(error)

        if (attempt === MAX_RETRIES) {
          if (errorMessage.includes('Failed to fetch')) {
            alert('Cannot connect to AI engine.\n\nPlease confirm the backend is running: http://127.0.0.1:8000')
          } else if (errorMessage.includes('NetworkError') || errorMessage.includes('CORS')) {
            alert('Network error.\n\nPlease check:\n1. Backend service is running\n2. CORS is configured correctly')
          } else {
            alert(`Generation failed.\n\n${errorMessage}`)
          }
          break
        }
        console.warn(`[RETRY] Attempt ${attempt + 1} failed, retrying...`)
      }
    }

    setLoading(false)
    setRetryMessage('')
    console.log('==================== Request Complete ====================')
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const interestOptions = [
    { key: 'photography', label: 'Photography' },
    { key: 'geology', label: 'Geology' },
    { key: 'hiking', label: 'Hiking' },
    { key: 'local_food', label: 'Local Food' },
    { key: 'history', label: 'History' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'adventure_sports', label: 'Adventure Sports' },
    { key: 'wellness', label: 'Wellness' },
  ]

  const activityLevels = [
    { key: 'easy', label: 'Easy' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'challenging', label: 'Challenging' },
    { key: 'expert', label: 'Expert' },
  ]

  if (loading) {
    return <LoadingScreen retryMessage={retryMessage} />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Mountain className="w-12 h-12 text-forest-green" />
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            AI Roadtrip <span className="text-gradient">Genie</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-off-white/70 max-w-2xl mx-auto"
        >
          Expert-Led Expedition Planning, Powered by AI
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-3 text-base text-off-white/60 max-w-2xl mx-auto"
        >
          Smart Vehicle Analysis &middot; Universal Photography Guide &middot; Geological Insights
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-forest-green/10 border border-forest-green/30 rounded-full w-fit mx-auto"
        >
          <Sparkles className="w-4 h-4 text-forest-green" />
          <span className="text-sm font-medium text-forest-green-light">$12.99 per itinerary &middot; Pay once &middot; Keep forever</span>
        </motion.div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-3xl glass-effect rounded-2xl p-8 md:p-12"
      >
        <div className="space-y-6">
          {/* Trip Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Starting Location</label>
              <input
                type="text"
                required
                value={formData.start_location}
                onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                placeholder="Seattle, WA"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <input
                type="text"
                required
                value={formData.end_location}
                onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                placeholder="Yellowstone National Park"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Trip Duration (days)</label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={formData.trip_duration}
                onChange={(e) => setFormData({ ...formData, trip_duration: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Travelers
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={formData.number_of_persons}
                onChange={(e) => setFormData({ ...formData, number_of_persons: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          {/* Vehicle & Round Trip */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle Class
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                className="input-field"
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="crossover">Crossover</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_round_trip}
                  onChange={(e) => setFormData({ ...formData, is_round_trip: e.target.checked })}
                  className="w-5 h-5 rounded border-carbon-light text-forest-green focus:ring-forest-green"
                />
                <span className="text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Round Trip (return to start)
                </span>
              </label>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Interests (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest.key}
                  type="button"
                  onClick={() => toggleInterest(interest.key)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    formData.interests.includes(interest.key)
                      ? 'bg-forest-green border-forest-green text-off-white'
                      : 'bg-carbon border-carbon-light hover:border-forest-green'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium mb-3">Activity Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activityLevels.map((level) => (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, activity_level: level.key })}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formData.activity_level === level.key
                      ? 'bg-forest-green border-forest-green text-off-white'
                      : 'bg-carbon border-carbon-light hover:border-forest-green'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Off-road Option */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.include_offroad}
                onChange={(e) => setFormData({ ...formData, include_offroad: e.target.checked })}
                className="w-5 h-5 rounded border-carbon-light text-forest-green focus:ring-forest-green"
              />
              <span className="text-sm">Include off-road sections</span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate My Expedition Plan</span>
            <span className="ml-auto text-sm opacity-80">$12.99</span>
          </motion.button>
        </div>
      </motion.form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center text-sm text-off-white/50 mt-12 space-y-2"
      >
        <p>Powered by Google Gemini 2.5 Flash &middot; Expert Vehicle Analysis</p>
        <p className="text-xs">Universal Photography Guide &middot; Geological Insights &middot; Terrain Safety</p>
      </motion.div>
    </div>
  )
}

function LoadingScreen({ retryMessage }: { retryMessage?: string }) {
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    'Calibrating global road conditions...',
    'Assessing geological risk factors...',
    'Analyzing terrain-vehicle compatibility...',
    'Computing optimal photography windows...',
    'Evaluating off-road passability...',
    'Generating supply & lodging recommendations...',
    'Compiling activity difficulty ratings...',
    'Rendering your custom expedition plan...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [messages.length])

  const displayMessage = retryMessage || messages[messageIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          <Mountain className="w-full h-full text-forest-green drop-shadow-lg" />
          <motion.div
            className="absolute inset-0 bg-forest-green/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Loading Message */}
        <motion.h2
          key={retryMessage || messageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-2 text-gradient"
        >
          {displayMessage}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-off-white/60 mb-8"
        >
          AI is crafting your personalized expedition plan
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full max-w-sm h-2 bg-carbon-light rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 15, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-forest-green via-forest-green-light to-forest-green"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-off-white/40"
        >
          Generating your expedition plan...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

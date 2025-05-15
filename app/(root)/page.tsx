'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const features = [
  {
    title: 'Video Calling',
    description: 'Seamless real-time video communication with crystal-clear audio and zero lag.',
    image: '/screenshots/home.png',
  },
  {
    title: 'Screen Sharing',
    description: 'Effortlessly present your screen and collaborate live with your team.',
    image: '/screenshots/home.png',
  },
  {
    title: 'Collaborative Whiteboard',
    description: 'Sketch ideas together in real-time with a smooth, interactive canvas.',
    image: '/screenshots/home.png',
  },
  {
    title: 'Breakout Rooms',
    description: 'Divide into groups for focused discussions without leaving the session.',
    image: '/screenshots/home.png',
  },
  {
    title: 'File Sharing',
    description: 'Instantly upload and share docs, media, and code across participants.',
    image: '/screenshots/home.png',
  },
  {
    title: 'Real-Time Notifications',
    description: 'Stay updated with instant alerts for chat, joins, and screen activity.',
    image: '/screenshots/home.png',
  },
  {
    title: 'Meeting Recordings',
    description: 'Capture your entire session and revisit key discussions anytime.',
    image: '/screenshots/home.png',
  },
  {
    title: 'Code Editor',
    description: 'Collaborate with live syntax-highlighted code for pair programming.',
    image: '/screenshots/home.png',
  },
]

const LandingPage = () => {
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] -translate-x-1/2 -translate-y-1/2 bg-indigo-600 opacity-10 rounded-full blur-[120px] z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Collaborate. Share. Create.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            A full-featured WebRTC platform with video calling, code editor, whiteboard, screen sharing & more.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg"
              onClick={() => router.push('/home')}
            >
              Launch App
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg"
              onClick={() => router.push('/demo')}
            >
              Try Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↓ Scroll to Explore
        </motion.div>
      </div>

      <div className="h-20" />

      {/* Feature Slider */}
      <div className="relative w-full h-[540px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-gray-950 to-black border-t border-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="absolute flex flex-col items-center text-center max-w-2xl px-4"
          >
            <img
              src={features[current].image}
              alt={features[current].title}
              className="w-80 h-80 object-cover rounded-2xl border border-gray-700 shadow-xl mb-6"
            />
            <h3 className="text-3xl font-bold text-indigo-300 mb-2">
              {features[current].title}
            </h3>
            <p className="text-gray-300 text-lg font-light italic leading-relaxed px-4 max-w-xl">
              {features[current].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 flex gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === current ? 'bg-indigo-400' : 'bg-gray-600'}`}
            ></button>
          ))}
        </div>
      </div>

      <section className="px-8 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-white">Use Cases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Online Classrooms', 'Remote Teams', 'Tech Interviews', 'Workshops'].map((title, idx) => (
            <div key={idx} className="bg-gray-800 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-2 text-indigo-300">{title}</h4>
              <p className="text-sm text-gray-400">Boost collaboration in real-world scenarios.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 bg-black text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Performance Counters</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-indigo-300 text-3xl font-extrabold">100+</div>
          <div className="text-indigo-300 text-3xl font-extrabold">10K</div>
          <div className="text-indigo-300 text-3xl font-extrabold">200+</div>
          <p className="text-sm text-gray-400">Meetings Daily</p>
          <p className="text-sm text-gray-400">Minutes Shared</p>
          <p className="text-sm text-gray-400">Users Worldwide</p>
        </div>
      </section>

      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-white text-center">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {['WebRTC', 'React', 'Node.js', 'Socket.IO'].map((tech, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-indigo-400">{tech}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 px-8 py-16 text-center">
        <h2 className="text-4xl font-bold mb-8 text-white">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['"A must-have for remote teams."', '"Super easy to use & feature-rich!"', '"Loved using it for interviews."'].map((text, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl text-gray-300 italic">
              {text}
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-20 bg-black text-center">
        <h2 className="text-4xl font-bold mb-8 text-white">Newsletter Signup</h2>
        <p className="text-gray-400 mb-6">Stay updated with the latest features and releases.</p>
        <div className="flex justify-center">
          <input type="email" placeholder="Enter your email" className="p-3 rounded-l-lg bg-gray-800 text-white focus:outline-none" />
          <button className="bg-indigo-600 text-white px-5 py-3 rounded-r-lg hover:bg-indigo-700">Notify Me</button>
        </div>
      </section>

      <footer className="bg-gray-950 text-center py-10 text-gray-500 text-sm">
        Built with ❤ for developers & teams. © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default LandingPage
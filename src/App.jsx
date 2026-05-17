import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { Tldraw } from '@tldraw/tldraw'
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  Grid3X3,
  Image,
  Layers,
  Library,
  Lock,
  LogOut,
  Menu,
  MessageCircle,
  Play,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Users,
  Video,
  X,
} from 'lucide-react'

const logo = '/logo.webp'

const art = {
  srinivasa: 'Srinivasa pencil construction study',
  talamana: 'Talamana measurement grid study',
  lakshmi: 'Lakshmi devotional sketch',
  mahavidyas: 'Temple iconography pencil work',
  garuda: 'Garuda hand-drawn portfolio piece',
  mudra: 'Mudra and hand gesture reference drawing',
  student: 'Student graphite practice sheet',
}

const artImages = {
  [art.srinivasa]: '/art/AhobhilaDarshan_Blk_18x24_Light_Fin-3.webp',
  [art.talamana]: '/art/DrdhaVG_Nataraja_Pencil+on+Paper_74x55cm_2017.webp',
  [art.lakshmi]: '/art/DVGorrick_Purnaghatam_web.webp',
  [art.mahavidyas]: '/art/DVGorrick_Panchamukha+Shiva_2019.webp',
  [art.garuda]: '/art/Ganesha.webp',
  [art.mudra]: '/art/DVGorrick_Murugan_web-1.webp',
  [art.student]: '/art/DrdhaVG_Nataraja_Pencil+on+Paper_74x55cm_2017.webp',
  'Drdha studio portrait placeholder': '/art/DVGorrick_Murugan_web-1.webp',
}

const courses = [
  {
    id: 'srinivasa',
    title: 'Drawing Divine Forms - Srinivasa',
    instructor: 'Drdha Vrata Gorrick',
    price: 'Rs. 10,600',
    duration: '5 months 4 days',
    sessions: 6,
    level: 'Beginner-friendly',
    available: true,
    art: art.srinivasa,
    description:
      'This specialized workshop focuses on depicting the sacred iconography of one of the most revered forms of Sri Vishnu, Srinivasa, also known as Balaji. Across six recorded sessions, students follow step-by-step instruction in constructing the full figure using the Talamana measurement system, studying proportion, gesture, ornament, and devotional presence.',
    sessionsList: [
      ['session-1', 'Foundations of Shilpa Shastra', 'The visual grammar behind sacred form.', '58 min'],
      ['session-2', 'Talamana Measurement Grid', 'Map the figure through eight measured divisions.', '64 min'],
      ['session-3', 'Form Construction', 'Build the central axis, shoulders, torso, and stance.', '72 min'],
      ['session-4', 'Mudras and Ornament', 'Refine the hands, crown, jewels, and symbolic details.', '69 min'],
      ['session-5', 'Line Quality and Refinement', 'Move from construction to devotional clarity.', '61 min'],
      ['session-6', 'Final Drawing Review', 'Complete and submit the full-figure drawing.', '75 min'],
    ],
  },
  { id: 'foundations-of-talamana', title: 'Foundations of Talamana', instructor: 'Drdha Vrata Gorrick', price: 'Rs. 8,400', duration: '4 months', sessions: 5, level: 'Foundations', available: true, art: art.talamana, description: 'A careful introduction to classical proportion systems for sacred Indian forms.', sessionsList: [] },
  { id: 'lakshmi', title: 'Drawing Divine Forms - Lakshmi', instructor: 'Drdha Vrata Gorrick', price: 'Notify me', duration: '6 sessions', sessions: 6, level: 'Coming soon', available: false, art: art.lakshmi, description: 'A forthcoming course on grace, ornament, and iconographic poise.', sessionsList: [] },
  { id: 'mahavidyas', title: 'Iconography of the Mahavidyas', instructor: 'Drdha Vrata Gorrick', price: 'Notify me', duration: '8 sessions', sessions: 8, level: 'Coming soon', available: false, art: art.mahavidyas, description: 'A forthcoming study of sacred forms, symbolism, and visual language.', sessionsList: [] },
]

const longCourseBlueprint = {
  id: 'divyakala-long-course',
  course_type: 'long',
  title: 'Drawing Divine Forms - The Two-Year Path',
  instructor: 'Drdha Vrata Gorrick',
  price: 'Enrollment by request',
  duration_label: '2 years',
  module_count: 6,
  session_count: 36,
  level: 'Guided foundational to advanced study',
  art: art.mahavidyas,
  description:
    'A two-year live learning journey into traditional Indian devotional art, built for students who want steady guidance, disciplined practice, and a deeper understanding of sacred image-making. Across six carefully sequenced modules, students study proportion, iconographic grammar, line, ornament, composition, color, and devotional presence through live sessions with Drdha. Each concluded session is made available as a recording inside the LMS so students can revisit demonstrations, refine assignments, and continue their practice between classes.',
  who_is_this_for:
    'This program is for committed students who want more than a short recorded workshop: artists, seekers, designers, and devotees who are ready to build a long-term foundation in sacred drawing and painting through live instruction and regular practice.',
  materials_needed:
    'Students begin with simple drawing materials: pencils, eraser, ruler, compass, good drawing paper, and a sketchbook. As the program moves into color and finishing, Drdha will guide students toward suitable pigments, brushes, papers, and reference materials for each module.',
  access_details:
    'Long-course students receive access to recordings of concluded live sessions for review during the program. Access policies can be finalized when the enrollment and batch flow is built.',
  course_structure_summary:
    'Each module is taught through live sessions. After a session concludes, its recording becomes available in the LMS for review and continued practice.',
  how_learning_works:
    'Students attend scheduled live classes with Drdha, practice between sessions using guided assignments and references, and revisit concluded class recordings inside the LMS. The learning rhythm is built around steady correction, repetition, and refinement rather than rushing through content.',
  timeline_commitment:
    'The program is designed as a two-year progression, not a quick workshop. Students move through six modules in sequence, with live sessions, guided review, and repeated practice forming the rhythm of learning. The commitment is steady and spacious: enough time to absorb proportion, iconographic meaning, composition, and finish without rushing the sacred form.',
  modules: [
    {
      title: 'Module 1 - Foundations of Sacred Drawing',
      description:
        'Students begin with the discipline of observation, light construction, and proportion. This module builds the quiet habits needed before any divine form is drawn in detail.',
      sessions: [
        'Orientation to the Divyakala method and devotional practice',
        'Line, axis, symmetry, and the discipline of slow looking',
        'Introduction to Shilpa Shastra as visual grammar',
        'Using grids without losing grace in the drawing',
        'Foundational studies of posture, balance, and gesture',
        'Review circle: first construction studies and corrections',
      ],
    },
    {
      title: 'Module 2 - Talamana and Divine Proportion',
      description:
        'This module develops measured confidence. Students study classical proportional systems and learn how structure supports beauty, dignity, and spiritual presence.',
      sessions: [
        'The tala system and measured divisions of the sacred figure',
        'Head, torso, limbs, and the relationship of each division',
        'Standing postures: central axis, shoulders, knees, and feet',
        'Seated postures and the architecture of stillness',
        'Correcting proportion through overlays and redrawing',
        'Module review: complete measured figure construction',
      ],
    },
    {
      title: 'Module 3 - Iconographic Language and Symbol',
      description:
        'Students move from measurement into meaning: mudras, ayudhas, crowns, ornaments, and the visual codes that help a form become recognizable and reverent.',
      sessions: [
        'Reading iconography: form, attribute, and meaning',
        'Mudras and hand gestures in devotional drawing',
        'Crowns, halos, jewelry, and sacred ornament systems',
        'Ayudhas and symbolic objects: placement and clarity',
        'Expression, gaze, and the devotional mood of the face',
        'Module review: annotated iconographic study sheet',
      ],
    },
    {
      title: 'Module 4 - Composition, Narrative, and Temple Aesthetics',
      description:
        'This module expands the single figure into a complete visual field. Students study framing, supporting forms, narrative balance, and the quiet order of traditional compositions.',
      sessions: [
        'Framing the deity: pedestal, arch, aura, and sacred space',
        'Compositional hierarchy and the viewer\'s devotional path',
        'Secondary figures, attendants, and symbolic surroundings',
        'Temple references: translating sculpture into drawing',
        'From study sketch to resolved devotional composition',
        'Module critique: composition thumbnails and final layout',
      ],
    },
    {
      title: 'Module 5 - Color, Surface, and Devotional Finish',
      description:
        'Students learn how color supports bhava rather than decoration alone. The focus is on restraint, luminosity, rhythm, and making choices that serve the sacred form.',
      sessions: [
        'Color as mood: warmth, restraint, and sacred emphasis',
        'Preparing the drawing for painting or finished rendering',
        'Layering, edges, and preserving clarity of the form',
        'Ornament, cloth, and skin tones with devotional restraint',
        'Finishing practices: corrections, patience, and polish',
        'Module review: color study and finished-detail submission',
      ],
    },
    {
      title: 'Module 6 - Personal Sadhana Project',
      description:
        'The final module brings the learning together through a guided capstone work. Students plan, draw, refine, and present a complete sacred artwork with Drdha\'s feedback.',
      sessions: [
        'Choosing the final subject and gathering references',
        'Capstone planning: intention, structure, and timeline',
        'Drawing review: proportion, iconography, and composition',
        'Mid-project critique and individual correction points',
        'Final refinements, documentation, and presentation',
        'Closing review: continuing the practice beyond the program',
      ],
    },
  ],
}

function normalizeLongCourseModules(value) {
  const rawModules = Array.isArray(value?.modules) ? value.modules : Array.isArray(value) ? value : null
  if (!rawModules?.length) return []

  return rawModules.map((module, index) => {
    const sessions = Array.isArray(module.sessions) ? module.sessions : []
    const normalizedSessions = sessions.map((session) => ({
      title: typeof session === 'string' ? session : session?.title ?? '',
    }))

    return {
      title: module.title ?? `Module ${index + 1}`,
      description: module.description ?? '',
      planned_sessions: Number(module.planned_sessions ?? module.plannedSessions ?? normalizedSessions.length) || 0,
      sessions: normalizedSessions,
    }
  })
}

function toCourseStructureModules(modules) {
  return normalizeLongCourseModules(modules).map((module) => ({
    title: module.title,
    description: module.description,
    planned_sessions: module.planned_sessions,
    sessions: module.sessions.map((session) => session.title).filter(Boolean),
  }))
}

const workshops = [
  { title: 'Iconography Q&A: Mudras & Their Meanings', date: 'Saturday, 14 December 2025', time: '7:00 PM IST', day: '14', month: 'DEC', duration: '1 hour', description: 'Bring your questions about hand gestures and their symbolism. Drdha will draw examples live and answer questions.' },
  { title: 'Live Painting Demo: Watercolor Techniques for Devotional Art', date: 'Thursday, 8 January 2026', time: '7:00 PM IST', day: '08', month: 'JAN', duration: '90 min', description: 'A gentle study of transparent color, devotional restraint, and luminous surfaces.' },
  { title: 'Open Studio: Bring Your Drawing for Critique', date: 'Thursday, 22 January 2026', time: '7:00 PM IST', day: '22', month: 'JAN', duration: '1 hour', description: 'A review session for works in progress, proportion questions, and line refinement.' },
  { title: 'Sacred Geometry: The Mathematics Behind Iconography', date: 'Thursday, 5 February 2026', time: '7:00 PM IST', day: '05', month: 'FEB', duration: '1 hour', description: 'The measured quiet behind sacred drawings, grids, and compositional balance.' },
]

const notifications = [
  ['workshop', 'Live workshop in 2 days - Iconography Q&A', 'Today', false],
  ['feedback', 'Drdha left feedback on your Session 2 submission', 'Yesterday', false],
  ['session', 'New session unlocked: Session 4 - Mudras', '3 days ago', true],
]

const journalEntries = [
  ['12 Dec 2025', 'Session 3 - Form Construction', 'Good progress on the central axis.', art.student, -2],
  ['6 Dec 2025', 'Session 2 - Talamana Grid', 'The grid is becoming more confident.', art.talamana, 2],
  ['29 Nov 2025', 'Session 1 - Foundations', 'Let the first lines stay light.', art.garuda, -1],
  ['20 Nov 2025', 'Warm-up practice', 'A quiet page of measured observation.', art.mudra, 1],
  ['12 Nov 2025', 'Reference copy', 'The shoulder line is beginning to settle.', art.srinivasa, -2],
  ['4 Nov 2025', 'Early construction', 'Every careful mark counts.', art.mahavidyas, 2],
]

function getLessonContent(sessionId, sessionNumber, sessionTitle) {
  const key = sessionId || `session-${sessionNumber}`
  const content = {
    'session-1': {
      focus: 'Establish the philosophical and visual grammar of sacred form before drawing begins.',
      assignment: 'Create one page of light axis studies and three thumbnail compositions using only simple construction lines.',
      resources: ['Shilpa Shastra foundations.pdf', 'Axis warm-up worksheet.pdf', 'Session 1 practice checklist.pdf'],
      submissions: [['Reviewed', true, 'Submitted 5 days ago'], ['Approved', false, 'Submitted 4 days ago']],
      notes: [
        ['0:00', 'Begin by observing before drawing. Notice the vertical dignity of the form.'],
        ['4:20', 'Draw the central axis lightly; it is a guide, not a final line.'],
        ['18:10', 'Use simple shapes to test proportion before adding detail.'],
        ['41:30', 'Stop before ornament. Clarity of structure comes first.'],
      ],
    },
    'session-2': {
      focus: 'Build confidence with the Talamana grid and measured divisions.',
      assignment: 'Draw the eight-part Talamana grid twice, then place the head, torso, knees, and feet using light marks.',
      resources: ['Talamana measurement guide.pdf', 'Eight-division grid template.pdf', 'Session 2 proportion checklist.pdf'],
      submissions: [['Reviewed', true, 'Submitted 3 days ago'], ['Awaiting feedback', false, 'Submitted today']],
      notes: [
        ['0:00', 'Mark the full height first, then divide it into eight equal talas.'],
        ['6:45', 'Keep the grid light enough that it can disappear later.'],
        ['22:15', 'The shoulder line must relate to the second tala, not float independently.'],
        ['49:00', 'Check symmetry by stepping away from the page.'],
      ],
    },
    'session-3': {
      focus: 'Construct the figure from central axis to shoulders, torso, and stance while preserving the grid.',
      assignment: 'Submit your Session 3 form construction drawing with the central axis and shoulder line still visible.',
      resources: ['Srinivasa form construction.pdf', 'Shoulder line reference grid.pdf', 'Session 3 submission checklist.pdf'],
      submissions: [['Reviewed', true, 'Submitted 2 days ago'], ['Awaiting feedback', false, 'Submitted today']],
      notes: [
        ['0:00', 'Begin with the central vertical axis. This will divide the figure symmetrically.'],
        ['3:15', 'The Talamana grid. Eight equal divisions head to feet. Mark each lightly.'],
        ['12:34', 'Shoulders sit at the top of the second tala from the head. Keep this line calm.'],
        ['28:10', 'The torso length is close, but the chin angle changes the entire expression.'],
      ],
    },
  }

  return content[key] || {
    focus: `Continue practicing ${sessionTitle}.`,
    assignment: `Submit your practice work for ${sessionTitle}.`,
    resources: [`${sessionTitle} notes.pdf`, `${sessionTitle} reference sheet.pdf`, `Session ${sessionNumber} checklist.pdf`],
    submissions: [],
    notes: [['0:00', `Begin ${sessionTitle} with slow observation.`]],
  }
}

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')
    if (host === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (host.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return url
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
  } catch {
    return url
  }
  return url
}

function getVimeoEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/video/')) return url
    const videoId = parsed.pathname.split('/').filter(Boolean).pop()
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url
  } catch {
    return url
  }
}

function getVideoUrlType(url) {
  const value = (url ?? '').toLowerCase()
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube'
  if (value.includes('vimeo.com')) return 'vimeo'
  if (value) return 'direct'
  return 'empty'
}

function normalizeCourseStatus(status) {
  const value = (status ?? '').toString().trim().toLowerCase()
  if (value === 'coming soon' || value === 'coming-soon' || value === 'comingsoon') return 'coming_soon'
  if (value === 'published' || value === 'live') return 'published'
  if (value === 'draft') return 'draft'
  return value || 'draft'
}

async function saveExtendedCourseFields(courseId, fields) {
  const payload = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  )
  if (!Object.keys(payload).length) return { error: null }

  const skippedColumns = []
  let nextPayload = { ...payload }

  while (Object.keys(nextPayload).length) {
    const result = await supabase.from('courses').update(nextPayload).eq('id', courseId)
    if (!result.error) return { ...result, skippedColumns }
    if (!isMissingSupabaseColumn(result.error)) return { ...result, skippedColumns }

    const missingColumn = result.error.message?.match(/'([^']+)' column/)?.[1]
    if (!missingColumn || !(missingColumn in nextPayload)) return { ...result, skippedColumns }

    skippedColumns.push(missingColumn)
    const { [missingColumn]: _missing, ...remainingPayload } = nextPayload
    nextPayload = remainingPayload
  }

  return { error: null, skippedColumns }
}

function isMissingSupabaseColumn(error) {
  const message = error?.message?.toLowerCase() ?? ''
  return error?.code === 'PGRST204' || (message.includes('column') && message.includes('schema cache'))
}

async function insertSessionWithFallback(corePayload, optionalPayload = {}) {
  const fullPayload = {
    ...corePayload,
    ...Object.fromEntries(
      Object.entries(optionalPayload).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ),
  }

  const firstAttempt = await supabase.from('sessions').insert(fullPayload).select().single()
  if (!firstAttempt.error || !isMissingSupabaseColumn(firstAttempt.error)) {
    return { ...firstAttempt, usedFallback: false }
  }

  const fallbackAttempt = await supabase.from('sessions').insert(corePayload).select().single()
  return { ...fallbackAttempt, usedFallback: true }
}

const adminCards = [
  { id: 'card-001', type: 'Video', title: 'Srinivasa Session 1: Foundations', course: 'Drawing Divine Forms - Srinivasa', status: 'Published', duration: '58 min', asset: '/public/videos/session-1.mp4', updated: 'Today' },
  { id: 'card-002', type: 'Image', title: 'Talamana eight-division grid', course: 'Foundations of Talamana', status: 'Published', duration: 'Reference', asset: '/public/art/talamana-grid.webp', updated: 'Yesterday' },
  { id: 'card-003', type: 'Text', title: 'Materials and practice brief', course: 'Drawing Divine Forms - Srinivasa', status: 'Draft', duration: 'Reading', asset: 'Lesson notes', updated: '2 days ago' },
  { id: 'card-004', type: 'File', title: 'Srinivasa reference PDF', course: 'Drawing Divine Forms - Srinivasa', status: 'Review', duration: 'Download', asset: '/public/resources/srinivasa-reference.pdf', updated: '4 days ago' },
]

const adminPlaylists = [
  { title: 'Beginner Devotional Drawing Path', courses: ['Foundations of Talamana', 'Drawing Divine Forms - Srinivasa'], students: 48, status: 'Published' },
  { title: 'Iconography Intensive', courses: ['Drawing Divine Forms - Lakshmi', 'Iconography of the Mahavidyas'], students: 21, status: 'Draft' },
  { title: 'Live Workshop Replays', courses: ['Iconography Q&A', 'Open Studio Critique'], students: 96, status: 'Published' },
]

const adminSubmissions = [
  { student: 'Dev Saxena', course: 'Drawing Divine Forms - Srinivasa', assignment: 'Session 3 - Form Construction', status: 'Awaiting review', submitted: 'Today', file: art.student },
  { student: 'Priya R.', course: 'Foundations of Talamana', assignment: 'Session 1 - Grid Study', status: 'Needs resubmission', submitted: 'Yesterday', file: art.talamana },
  { student: 'Meera K.', course: 'Drawing Divine Forms - Srinivasa', assignment: 'Session 2 - Talamana Grid', status: 'Approved', submitted: '2 days ago', file: art.garuda },
]

const adminStudents = [
  { name: 'Dev Saxena', email: 'dev@divyakala.demo', progress: 40, enrolled: 2, lastSeen: 'Today' },
  { name: 'Priya R.', email: 'priya@example.com', progress: 66, enrolled: 1, lastSeen: 'Yesterday' },
  { name: 'Meera K.', email: 'meera@example.com', progress: 22, enrolled: 2, lastSeen: '3 days ago' },
]

// ── Auth context ──────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = still loading
  const [profile, setProfile] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
      if (session) fetchProfile(session.user.id)
      else setProfile(null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
      if (session) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data ?? null)
  }

  const loading = session === undefined || (session !== null && profile === undefined)

  return <AuthContext.Provider value={{ session, profile, loading, refreshProfile: fetchProfile }}>{children}</AuthContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

// ─────────────────────────────────────────────────────────────────────────────

function App() {
  /*
  return (
    <div>
      <section className="grid gap-7 lg:grid-cols-[0.43fr_0.57fr] lg:items-center">
        <div className="py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7a3a]">Recorded course - {sessionCount} sessions</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-[#1a1208]">{displayCourse.title}</h2>
          <p className="mt-3 text-lg text-[#7a6040]">By {instructorName}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {displayCourse.level && <span className="rounded-full bg-[#e5d09a] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a7a3a]">{displayCourse.level}</span>}
            {displayCourse.duration_label && <span className="rounded-full bg-[#e5d09a] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a7a3a]">{displayCourse.duration_label}</span>}
            <span className="rounded-full bg-[#e5d09a] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a7a3a]">{normalizeCourseStatus(displayCourse.status) === 'coming_soon' ? 'Coming Soon' : 'Self-paced'}</span>
          </div>
          <p className="mt-6 font-display text-4xl font-semibold text-[#b8861a]">{priceDisplay}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>{normalizeCourseStatus(displayCourse.status) === 'coming_soon' ? 'Notify me' : 'Enroll Now'}</Button>
            {previewSession && <Link to={`/courses/${displayCourse.id}/lesson/${previewSession.id}`}><Button variant="secondary">Watch Free Preview</Button></Link>}
          </div>
        </div>
        <CourseTrailer url={displayCourse.trailer_url} title={displayCourse.title} />
      </section>

      <section className="mt-0 border-t-[0.5px] border-[#ddc990]">
        <div className="flex gap-8 bg-[#f5ead8]">
          {['About', 'Curriculum', 'Instructor'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 py-4 text-[14px] font-semibold transition ${activeTab === tab ? 'border-[#b8861a] text-[#b8861a]' : 'border-transparent text-[#7a6040]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-6">
          {activeTab === 'About' && (
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-start">
              <div>
                <h2 className="font-display text-3xl font-semibold text-[#1a1208]">About this course</h2>
                <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#7a6040]">{displayCourse.description ?? 'Course description will appear here once it has been added from admin.'}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#faf3e4] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7a3a]">Duration</p>
                    <p className="mt-1 font-semibold text-[#1a1208]">{displayCourse.duration_label ?? 'Self-paced'}</p>
                  </div>
                  <div className="rounded-lg bg-[#faf3e4] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7a3a]">Level</p>
                    <p className="mt-1 font-semibold text-[#1a1208]">{displayCourse.level ?? 'All levels'}</p>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[200px] justify-self-start overflow-hidden rounded-xl border-[0.5px] border-[#ddc990] lg:justify-self-end">
                {displayCourse.thumbnail_url
                  ? <img src={displayCourse.thumbnail_url} alt={displayCourse.title} className="aspect-[3/4] w-full object-cover" />
                  : <ArtPanel label={displayCourse.art ?? art.srinivasa} className="aspect-[3/4] rounded-none border-0" />
                }
              </div>
            </div>
          )}

          {activeTab === 'Curriculum' && (
            <div>
              <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <h2 className="font-display text-3xl font-semibold text-[#1a1208]">Sessions / Modules</h2>
                <p className="text-sm text-[#7a6040]">{sessionCount} sessions</p>
              </div>
              <div>
                {courseSessions.length ? courseSessions.map((session, idx) => (
                  <article key={session.id} className="grid gap-3 border-b-[0.5px] border-border-soft py-4 last:border-b-0 md:grid-cols-[44px_1fr_auto] md:items-center">
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-[#ddc990] bg-[#f5ead8] font-semibold text-[#b8861a]">{session.position ?? idx + 1}</div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-ink">{session.title}</h3>
                      <p className="mt-1 truncate text-[12px] text-ink-muted">{session.is_preview ? 'Free preview lesson' : 'Recorded lesson'}{session.video_url ? ` - ${session.video_url}` : ' - Video URL not added yet'}</p>
                    </div>
                    {session.is_preview ? <Link to={`/courses/${displayCourse.id}/lesson/${session.id}`}><Badge variant="accent">Free Preview</Badge></Link> : <Lock className="text-ink-soft" />}
                  </article>
                )) : (
                  <div className="rounded-lg border border-dashed border-[#ddc990] bg-[#faf3e4] px-5 py-8 text-center">
                    <p className="font-display text-lg font-semibold">No sessions added yet.</p>
                    <p className="mt-1 text-sm text-[#7a6040]">The course shell is ready. Add the first session from the admin builder.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Instructor' && (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[#ddc990] bg-[#f5ead8] font-display text-2xl font-semibold text-[#b8861a]">{instructorInitials}</div>
              <div>
                <h2 className="font-display text-3xl font-semibold text-[#1a1208]">{instructorName}</h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#9a7a3a]">Traditional Shilpa Shastra artist and instructor</p>
                <p className="mt-4 max-w-3xl leading-7 text-[#7a6040]">Drdha Vrata Gorrick teaches traditional Indian devotional art through the discipline of Shilpa Shastra, with a focus on careful proportion, sacred form, and steady devotional practice.</p>
                <a href="https://www.divyakala.com/" className="mt-4 inline-block font-semibold text-[#b8861a]">Visit Drdha's portfolio</a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl font-semibold text-[#1a1208]">FAQs</h2>
        <div className="mt-5 border-y-[0.5px] border-border-soft">
          {faqItems.map(([title, copy]) => (
            <div key={title} className="border-b-[0.5px] border-border-soft last:border-b-0">
              <button className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-lg font-semibold text-[#1a1208]" onClick={() => setOpen(open === title ? '' : title)}>
                {title}
                <ChevronRight className={`shrink-0 text-[#b8861a] transition ${open === title ? 'rotate-180' : ''}`} />
              </button>
              {open === title && <p className="pb-5 leading-[1.7] text-ink-muted">{copy}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  */
  return (
    <BrowserRouter>
      <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth/:mode" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/onboarding" element={<Protected><StudentOnboarding /></Protected>} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin/*" element={<AdminProtected><AdminShell /></AdminProtected>} />
        <Route element={<Protected><Shell /></Protected>}>
          <Route path="/learning" element={<MyLearning />} />
          <Route path="/browse" element={<BrowseCourses />} />
          <Route path="/workshops" element={<LiveWorkshops />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/journal" element={<PracticeJournal />} />
          <Route path="/courses/:courseId/certificate" element={<Certificate />} />
        </Route>
        <Route path="/courses/:courseId/lesson/:sessionId" element={<Protected><LessonPlayer /></Protected>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <img src={logo} alt="Divyakala" className="max-h-14 object-contain opacity-70" />
        <div className="h-1 w-32 overflow-hidden rounded-full bg-border">
          <div className="h-full animate-pulse rounded-full bg-primary" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

function isProfileComplete(profile) {
  if (!profile) return false
  return !!(profile.country && profile.phone && profile.age_group && profile.artist_background && profile.why_shilpa_shastra)
}

function RootRedirect() {
  const { session, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/auth/sign-in" />
  if (profile?.role === 'admin') return <Navigate to="/admin" />
  if (profile && !isProfileComplete(profile)) return <Navigate to="/onboarding" />
  return <Navigate to="/learning" />
}

function Protected({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return session ? children : <Navigate to="/auth/sign-in" replace />
}

function AdminProtected({ children }) {
  const { session, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/admin/auth" replace />
  if (profile && profile.role !== 'admin') return <Navigate to="/admin/auth" replace />
  return children
}

function Shell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pageTitle = getTitle(location.pathname)

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/auth/sign-in')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-ink">
      <aside className={`${collapsed ? 'lg:w-[64px]' : 'lg:w-[216px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed inset-y-0 left-0 z-40 w-[216px] bg-chrome text-chrome-text transition-all duration-300`}>
        <button className="absolute right-[-18px] top-6 hidden h-9 w-9 rounded-full bg-primary text-chrome shadow-lg lg:grid lg:place-items-center" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <div className="flex h-16 items-center justify-center border-b border-chrome-muted/20 px-3">
          <img src={logo} alt="Divyakala" className={`${collapsed ? 'h-8 w-8 object-contain' : 'max-h-11 object-contain'} brightness-125`} />
        </div>
        <nav className="mt-6 space-y-1.5 px-2.5">
          <NavItem to="/learning" icon={BookOpen} label="My Learning" collapsed={collapsed} />
          <NavItem to="/browse" icon={Grid3X3} label="Browse Courses" collapsed={collapsed} />
          <NavItem to="/workshops" icon={CalendarDays} label="Live Workshops" collapsed={collapsed} />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-chrome-muted/20 p-3">
          <div className="flex items-center gap-3">
            <Avatar onClick={() => setProfileOpen(true)} />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{profile?.name ?? 'Student'}</p>
                <p className="truncate text-xs text-chrome-muted">{profile?.email ?? ''}</p>
              </div>
            )}
            <button onClick={signOut} title="Sign out" className="shrink-0 text-chrome-muted hover:text-chrome-text">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <div className={`${collapsed ? 'lg:ml-[64px]' : 'lg:ml-[216px]'} min-h-screen min-w-0 transition-all duration-300`}>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/95 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
            <h1 className="font-display text-lg font-medium lg:text-xl">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            {profile?.role === 'admin' && (
              <Link to="/admin" className="hidden items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover sm:inline-flex">
                <ShieldCheck size={13} />
                Admin Studio
              </Link>
            )}
            <Notifications />
            <Avatar onClick={() => setProfileOpen(true)} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[980px] px-4 py-5 lg:px-5 lg:py-7">
          <Routes>
            <Route path="/learning" element={<MyLearning />} />
            <Route path="/browse" element={<BrowseCourses />} />
            <Route path="/workshops" element={<LiveWorkshops />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/journal" element={<PracticeJournal />} />
            <Route path="/courses/:courseId/certificate" element={<Certificate />} />
          </Routes>
        </main>
      </div>
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  )
}

function getTitle(pathname) {
  if (pathname.includes('/browse')) return 'Browse Courses'
  if (pathname.includes('/workshops')) return 'Live Workshops'
  if (pathname.includes('/journal')) return 'Your Practice Journal'
  if (pathname.includes('/certificate')) return 'Your Certificate'
  if (pathname.includes('/courses/')) return 'Course Details'
  return 'My Learning'
}

function NavItem({ to, icon: Icon, label, collapsed }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to} className={`flex h-10 items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium transition ${active ? 'border-l-[3px] border-primary bg-primary-soft/20 text-primary-soft' : 'text-chrome-muted hover:bg-surface-warm/10 hover:text-chrome-text'} ${collapsed ? 'justify-center px-0' : ''}`}>
      <Icon size={17} />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

function Notifications() {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const unreadCount = items.filter((item) => !item.read).length

  async function loadNotifications() {
    if (!session?.user?.id) {
      setItems([])
      return
    }

    setLoading(true)
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [session?.user?.id])

  useEffect(() => {
    if (!session?.user?.id) return undefined

    const channel = supabase
      .channel(`student-notifications-${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => loadNotifications()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user?.id])

  async function markAllAsRead() {
    if (!session?.user?.id || !items.length) return

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', session.user.id)
      .eq('read', false)

    setItems((current) => current.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="relative">
      <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface transition hover:bg-surface-warm" onClick={() => setOpen(!open)}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-error px-1 text-[10px] font-bold text-white">{unreadCount}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-[320px] rounded-2xl border border-border bg-surface p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Notifications</h3>
            <button onClick={markAllAsRead} className="text-xs font-semibold uppercase tracking-wide text-primary">Mark all as read</button>
          </div>
          <div className="max-h-[400px] space-y-2 overflow-auto">
            {loading ? (
              <div className="rounded-xl bg-surface-warm p-3 text-sm text-ink-muted">Loading notifications...</div>
            ) : items.length ? (
              items.map((item) => <NotificationItem key={item.id} item={item} onOpen={() => setOpen(false)} onRead={(id) => setItems((current) => current.map((notice) => notice.id === id ? { ...notice, read: true } : notice))} />)
            ) : (
              <div className="rounded-xl bg-surface-warm p-3 text-sm text-ink-muted">No notifications yet. Feedback from Drdha will appear here.</div>
            )}
          </div>
          <button className="mt-3 w-full rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">Latest updates</button>
        </div>
      )}
    </div>
  )
}

function NotificationItem({ item, onOpen, onRead }) {
  const type = item.type
  const read = item.read
  const Icon = type === 'workshop' ? CalendarDays : type === 'feedback' ? MessageCircle : BookOpen
  async function handleOpen() {
    if (!item.read) {
      onRead?.(item.id)
      await supabase.from('notifications').update({ read: true }).eq('id', item.id)
    }
    onOpen?.()
  }
  const content = (
    <div className="flex gap-3 rounded-xl p-3 hover:bg-surface-warm">
      {!read && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
      <Icon className={read ? 'text-ink-soft' : 'text-primary'} size={18} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{item.title}</p>
        {item.body && <p className="mt-0.5 text-xs leading-5 text-ink-muted">{item.body}</p>}
        <p className="mt-1 text-xs text-ink-muted">{formatNotificationTime(item.created_at)}</p>
      </div>
    </div>
  )

  if (item.href) {
    return <Link to={item.href} onClick={handleOpen}>{content}</Link>
  }

  return <button type="button" onClick={handleOpen} className="w-full text-left">{content}</button>
}

function formatNotificationTime(date) {
  if (!date) return 'Just now'
  const diffMs = Date.now() - new Date(date).getTime()
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000))
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function Avatar({ onClick }) {
  const { profile } = useAuth()
  const initial = profile?.name?.[0]?.toUpperCase() ?? '?'
  return <button type="button" onClick={onClick} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-xl font-semibold text-ink transition hover:scale-105 hover:bg-primary hover:text-white">{initial}</button>
}

function ProfileModal({ onClose }) {
  const { session, profile, refreshProfile } = useAuth()
  const [name, setName] = useState(profile?.name ?? '')
  const [country, setCountry] = useState(profile?.country ?? 'India')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(event) {
    event.preventDefault()
    if (!session?.user?.id) return

    setSaving(true)
    setError('')

    const { error: updateError } = await supabase.from('profiles').upsert({
      id: session.user.id,
      email: profile?.email ?? session.user.email,
      name: name.trim() || profile?.email?.split('@')[0] || 'Student',
      country,
      phone: phone.trim() || null,
      role: profile?.role ?? 'student',
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      await refreshProfile(session.user.id)
      onClose()
    }

    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4">
      <form onSubmit={handleSave} className="w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Student profile</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Your practice details</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">These details help personalize your course experience and make your submissions easier for Drdha to review.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-warm"><X size={18} /></button>
        </div>
        <div className="mt-6 space-y-4">
          <Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Country</span>
            <select value={country} onChange={(event) => setCountry(event.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Other</option>
            </select>
          </label>
          <Input label="Phone / WhatsApp" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" />
          <div className="rounded-xl border border-border bg-surface-warm p-4 text-sm text-ink-muted">
            <p><span className="font-semibold text-ink">Email:</span> {profile?.email ?? session?.user?.email}</p>
            <p className="mt-1">Email is used for OTP sign-in and cannot be changed from the demo profile.</p>
          </div>
          {error && <p className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">{error}</p>}
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button type="button" onClick={async () => { await supabase.auth.signOut(); onClose() }} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-error">
            <LogOut size={14} />
            Sign out
          </button>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Auth() {
  const { mode = 'sign-in' } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const isSignUp = mode === 'sign-up'

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [country, setCountry] = useState('India')
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password: used for sign-up (required) and sign-in fallback toggle
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (session) navigate('/learning', { replace: true })
  }, [session])

  // ── Sign-up: password-based, no OTP ──
  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const name = `${firstName} ${lastName}`.trim()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: `${firstName} ${lastName}`.trim() },
        emailRedirectTo: undefined,
      },
    })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const userId = signInData.user?.id ?? data.user?.id
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        email,
        name: name || email.split('@')[0],
        country,
        phone: phone.trim() || null,
        role: 'student',
        admission_status: 'prospect',
        fee_status: 'pending',
      })
    }

    navigate('/onboarding', { replace: true })
    setLoading(false)
  }

  // ── Sign-in: OTP magic link ──
  async function handleSendOtp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://divyakala-lms.vercel.app/auth/callback' },
    })
    if (error) setError(error.message)
    else setOtpSent(true)
    setLoading(false)
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    if (otp.replace(/\s/g, '').length < 6) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    if (error) setError(error.message)
    // On success: onAuthStateChange fires → AuthProvider sets session → useEffect above navigates
    setLoading(false)
  }

  async function handlePasswordSignIn(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('No account found or wrong password. Please sign up first.')
    setLoading(false)
  }

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <div className="relative min-h-[36vh] overflow-hidden lg:min-h-screen">
        <ArtPanel label={art.garuda} className="h-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[430px] text-center">
          <img src={logo} alt="Divyakala" className="mx-auto mb-8 max-h-20 object-contain" />
          <h1 className="font-display text-4xl font-medium">Namaskaram! Welcome to Divyakala.</h1>
          <p className="mt-3 text-lg text-ink-muted">{isSignUp ? 'Create your practice space.' : 'Sign in to continue your practice.'}</p>

          {/* ── Sign-up form ── */}
          {isSignUp && (
            <form onSubmit={handleSignUp} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-8 text-left shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Country</span>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </label>
                <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button className="w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</Button>
            </form>
          )}

          {/* ── Sign-in: OTP flow ── */}
          {!isSignUp && !usePassword && (
            <>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-8 text-left shadow-md">
                  <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  {error && <p className="text-sm text-error">{error}</p>}
                  <Button className="w-full" disabled={loading}>{loading ? 'Sending…' : 'Continue'}</Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-8 text-left shadow-md">
                  <p className="text-sm text-ink-muted">A 6-digit code was sent to <strong>{email}</strong></p>
                  <OtpBoxes value={otp} onChange={setOtp} />
                  {error && <p className="text-sm text-error">{error}</p>}
                  <Button className="w-full" disabled={loading}>{loading ? 'Verifying…' : 'Sign In'}</Button>
                  <button type="button" className="w-full text-center text-sm text-primary" onClick={() => { setOtpSent(false); setError('') }}>Use a different email</button>
                </form>
              )}
              <button
                type="button"
                className="mt-4 text-sm text-ink-muted underline underline-offset-2 hover:text-primary"
                onClick={() => { setUsePassword(true); setOtpSent(false); setError('') }}
              >
                Sign in with password instead
              </button>
            </>
          )}

          {/* ── Sign-in: Password fallback ── */}
          {!isSignUp && usePassword && (
            <>
              <form onSubmit={handlePasswordSignIn} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-8 text-left shadow-md">
                <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {error && <p className="text-sm text-error">{error}</p>}
                <Button className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
              </form>
              <button
                type="button"
                className="mt-4 text-sm text-ink-muted underline underline-offset-2 hover:text-primary"
                onClick={() => { setUsePassword(false); setError('') }}
              >
                Use magic link instead
              </button>
            </>
          )}

          <Link className="mt-5 inline-block text-sm font-semibold text-primary" to={isSignUp ? '/auth/sign-in' : '/auth/sign-up'}>
            {isSignUp ? 'Already a member? Sign in' : 'New here? Register'}
          </Link>
        </div>
      </div>
    </div>
  )
}

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      navigate('/', { replace: true })
    })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <p className="text-ink-muted">Signing you in…</p>
    </div>
  )
}

function StudentOnboarding() {
  const navigate = useNavigate()
  const { session, profile, refreshProfile } = useAuth()

  const [country, setCountry] = useState(profile?.country ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [ageGroup, setAgeGroup] = useState(profile?.age_group ?? '')
  const [artistBackground, setArtistBackground] = useState(profile?.artist_background ?? '')
  const [whyShilpa, setWhyShilpa] = useState(profile?.why_shilpa_shastra ?? '')
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const needsCountry = !profile?.country
  const needsPhone = !profile?.phone

  async function handleSave(e) {
    e.preventDefault()
    if (!ageGroup || !artistBackground.trim() || !whyShilpa.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')
    const { error: saveError } = await supabase.from('profiles').upsert({
      id: session.user.id,
      ...(needsCountry && country ? { country } : {}),
      ...(needsPhone && phone.trim() ? { phone: phone.trim() } : {}),
      age_group: ageGroup,
      artist_background: artistBackground.trim(),
      why_shilpa_shastra: whyShilpa.trim(),
      portfolio_url: portfolioUrl.trim() || null,
    })
    if (saveError) {
      setError(saveError.message)
      setSaving(false)
      return
    }
    await refreshProfile(session.user.id)
    navigate('/learning', { replace: true })
  }

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <div className="relative min-h-[36vh] overflow-hidden lg:min-h-screen">
        <ArtPanel label={art.srinivasa} className="h-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="font-display text-2xl font-medium leading-snug">"Every careful mark counts."</p>
          <p className="mt-2 text-sm opacity-70">— Drdha Vrata Gorrick</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px]">
          <img src={logo} alt="Divyakala" className="mb-8 max-h-16 object-contain" />
          <h1 className="font-display text-3xl font-medium">Tell us about your practice</h1>
          <p className="mt-2 text-sm text-ink-muted">This helps Drdha understand where you are and give you better feedback.</p>

          <form onSubmit={handleSave} className="mt-7 space-y-5">
            {needsCountry && (
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Country <span className="text-error">*</span></span>
                <select value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
                  <option value="">Select country…</option>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </label>
            )}
            {needsPhone && (
              <Input label="Phone / WhatsApp *" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            )}
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Age group <span className="text-error">*</span></span>
              <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} required className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
                <option value="">Select…</option>
                <option value="Under 19">Under 19</option>
                <option value="19–30">19–30</option>
                <option value="Above 30">Above 30</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Your art background <span className="text-error">*</span></span>
              <textarea
                rows={3}
                value={artistBackground}
                onChange={(e) => setArtistBackground(e.target.value)}
                placeholder="Tell us about your art background…"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Why Shilpa Shastra? <span className="text-error">*</span></span>
              <textarea
                rows={3}
                value={whyShilpa}
                onChange={(e) => setWhyShilpa(e.target.value)}
                placeholder="Why are you drawn to Shilpa Shastra?"
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
              />
            </label>
            <Input label="Portfolio URL (optional)" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://…" type="url" />
            {error && <p className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">{error}</p>}
            <Button className="w-full" disabled={saving}>{saving ? 'Saving…' : 'Enter the studio →'}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Input({ label, as, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</span>
      {as === 'select' ? (
        <select className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"><option>India</option><option>United States</option><option>United Kingdom</option></select>
      ) : (
        <input className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" {...props} />
      )}
    </label>
  )
}

function OtpBoxes({ value = '', onChange }) {
  const refs = useRef([])

  function handleChange(i, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = value.padEnd(6, '').split('')
    arr[i] = char
    onChange(arr.join(''))
    if (char && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted.padEnd(6, ''))
    refs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div>
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">One-time passcode</span>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            maxLength={1}
            inputMode="numeric"
            value={value[i] ?? ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="h-12 rounded-lg border border-border bg-surface text-center text-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        ))}
      </div>
    </div>
  )
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = variant === 'secondary'
    ? 'border-[1.5px] border-primary bg-bg text-primary hover:bg-primary-soft'
    : variant === 'ghost'
      ? 'bg-transparent text-ink underline decoration-primary/40 underline-offset-4 hover:decoration-primary'
      : 'bg-primary text-white hover:bg-primary-hover'
  return <button className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${styles} ${className}`} {...props}>{children}</button>
}

function MyLearning() {
  const { session } = useAuth()
  const [learningItems, setLearningItems] = useState([])
  const [loadingLearning, setLoadingLearning] = useState(true)
  const [learningError, setLearningError] = useState('')
  const [courseTypeTab, setCourseTypeTab] = useState('Short courses')

  useEffect(() => {
    async function loadLearning() {
      if (!session?.user?.id) {
        setLearningItems([])
        setLoadingLearning(false)
        return
      }

      setLoadingLearning(true)
      setLearningError('')

      const { data: enrollmentRows, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('enrolled_at', { ascending: false })

      if (error) {
        setLearningError(error.message)
        setLearningItems([])
        setLoadingLearning(false)
        return
      }

      const userEnrollments = enrollmentRows ?? []
      const courseIds = [...new Set(userEnrollments.map((item) => item.course_id).filter(Boolean))]

      if (!courseIds.length) {
        setLearningItems([])
        setLoadingLearning(false)
        return
      }

      const [{ data: courseRows }, { data: sessionRows }] = await Promise.all([
        supabase.from('courses').select('*').in('id', courseIds),
        supabase.from('sessions').select('id, course_id, position, title').in('course_id', courseIds).order('position', { ascending: true }),
      ])

      const coursesById = Object.fromEntries((courseRows ?? []).map((course) => [course.id, course]))
      const sessionsByCourse = (sessionRows ?? []).reduce((acc, item) => {
        acc[item.course_id] = [...(acc[item.course_id] ?? []), item]
        return acc
      }, {})

      const nextItems = userEnrollments
        .map((enrollment) => {
          const course = coursesById[enrollment.course_id] ?? courses.find((item) => item.id === enrollment.course_id)
          if (!course) return null

          const courseSessionRows = sessionsByCourse[enrollment.course_id] ?? []
          const fallbackSessions = (course.sessionsList ?? []).map(([id, title], index) => ({ id, title, position: index + 1 }))
          const orderedSessions = courseSessionRows.length ? courseSessionRows : fallbackSessions
          const progress = Math.round(Number(enrollment.progress ?? 0))
          const lastSession = orderedSessions.find((item) => item.id === enrollment.last_session_id) ?? orderedSessions[0]
          const sessionCount = orderedSessions.length || course.sessions || 0
          const currentIndex = lastSession ? Math.max(orderedSessions.findIndex((item) => item.id === lastSession.id), 0) + 1 : 1

          return {
            enrollment,
            course,
            progress,
            lastSessionId: lastSession?.id ?? 'session-1',
            lastSessionTitle: lastSession?.title ?? 'Start the course',
            label: sessionCount ? `Session ${currentIndex} of ${sessionCount}` : 'Ready to begin',
          }
        })
        .filter(Boolean)

      setLearningItems(nextItems)
      setLoadingLearning(false)
    }

    loadLearning()
  }, [session?.user?.id])

  if (loadingLearning) {
    return <div className="py-16 text-center text-sm text-ink-muted">Loading your courses...</div>
  }

  if (learningError) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-6 text-error">
        <p className="font-display text-xl font-semibold">Could not load your learning.</p>
        <p className="mt-1 text-sm">{learningError}</p>
      </div>
    )
  }

  const filteredItems = learningItems.filter((item) => {
    const isLong = item.course.course_type === 'long'
    return courseTypeTab === 'Long courses' ? isLong : !isLong
  })
  const featuredItem = filteredItems[0] ?? null

  if (!learningItems.length) {
    return (
      <div className="space-y-5">
        <CoursePillTabs active={courseTypeTab} onChange={setCourseTypeTab} />
        <div className="grid gap-5 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <BookOpen className="mx-auto text-ink-soft" size={36} />
          <div>
            <h2 className="font-display text-2xl font-semibold">No enrolled courses yet.</h2>
            <p className="mt-1 text-sm text-ink-muted">Browse published courses and enroll to begin tracking your practice here.</p>
          </div>
          <Link to="/browse"><Button>Browse Courses</Button></Link>
        </div>
        <JournalPreview />
        <WorkshopBanner />
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <CoursePillTabs active={courseTypeTab} onChange={setCourseTypeTab} />

      {courseTypeTab === 'Short courses' ? (
        filteredItems.length === 0 ? (
          <div className="grid gap-5 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <BookOpen className="mx-auto text-ink-soft" size={36} />
            <div>
              <h2 className="font-display text-2xl font-semibold">No short course enrollments yet.</h2>
              <p className="mt-1 text-sm text-ink-muted">Browse short courses and enroll to see your progress here.</p>
            </div>
            <Link to="/browse"><Button>Browse Courses</Button></Link>
          </div>
        ) : (
          <>
            <section className="grid gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:grid-cols-[0.42fr_0.58fr] lg:p-6">
              {featuredItem.course.thumbnail_url
                ? <img src={featuredItem.course.thumbnail_url} alt={featuredItem.course.title} className="min-h-[220px] rounded-2xl object-cover" />
                : <ArtPanel label={featuredItem.course.art ?? art.srinivasa} className="min-h-[220px]" />
              }
              <div className="flex flex-col justify-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Continue your practice</p>
                <h2 className="font-display text-3xl font-medium">{featuredItem.course.title}</h2>
                <p className="mt-1 text-sm text-ink-muted">By {featuredItem.course.instructor ?? 'Drdha Vrata Gorrick'}</p>
                <Progress value={featuredItem.progress} className="mt-6" />
                <p className="mt-3 text-sm text-ink-muted">{featuredItem.progress}% complete - {featuredItem.label}</p>
                <p className="mt-3">You left off at: <span className="font-semibold">{featuredItem.lastSessionTitle}</span></p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={`/courses/${featuredItem.course.id}/lesson/${featuredItem.lastSessionId}`}><Button>Resume</Button></Link>
                  <Link to={`/courses/${featuredItem.course.id}`}><Button variant="ghost">View course</Button></Link>
                </div>
              </div>
            </section>
            <SectionTitle title="Your Courses" />
            <div className="grid gap-5 md:grid-cols-2">{filteredItems.map((item) => (
              <CourseCard key={item.enrollment.id} course={item.course} progress={item.progress} lastSessionId={item.lastSessionId} />
            ))}</div>
          </>
        )
      ) : (
        <>
          <section className="grid gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:grid-cols-[0.42fr_0.58fr] lg:p-6">
            {filteredItems.length > 0 ? (
              <>
                {featuredItem.course.thumbnail_url
                  ? <img src={featuredItem.course.thumbnail_url} alt={featuredItem.course.title} className="min-h-[220px] rounded-2xl object-cover" />
                  : <ArtPanel label={featuredItem.course.art ?? art.srinivasa} className="min-h-[220px]" />
                }
                <div className="flex flex-col justify-center">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Continue your practice</p>
                  <h2 className="font-display text-3xl font-medium">{featuredItem.course.title}</h2>
                  <p className="mt-1 text-sm text-ink-muted">By {featuredItem.course.instructor ?? 'Drdha Vrata Gorrick'}</p>
                  <Progress value={featuredItem.progress} className="mt-6" />
                  <p className="mt-3 text-sm text-ink-muted">{featuredItem.progress}% complete - {featuredItem.label}</p>
                  <p className="mt-3">You left off at: <span className="font-semibold">{featuredItem.lastSessionTitle}</span></p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to={`/courses/${featuredItem.course.id}/lesson/${featuredItem.lastSessionId}`}><Button>Resume</Button></Link>
                    <Link to={`/courses/${featuredItem.course.id}`}><Button variant="ghost">View course</Button></Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Continue your practice</p>
                <p className="font-display text-xl font-semibold">No long courses yet.</p>
                <p className="text-sm text-ink-muted">Once you're placed into a long course batch, it will appear here.</p>
              </div>
            )}
          </section>
          <SectionTitle title="Your Courses" />
          {filteredItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">{filteredItems.map((item) => (
              <CourseCard key={item.enrollment.id} course={item.course} progress={item.progress} lastSessionId={item.lastSessionId} />
            ))}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <BookOpen className="mx-auto mb-3 text-ink-soft" size={28} />
              <p className="font-display text-lg font-semibold">No long courses yet.</p>
              <p className="mt-1 text-sm text-ink-muted">Long course batches are placed by Drdha. Check back after your admission is confirmed.</p>
            </div>
          )}
        </>
      )}

      <JournalPreview />
      <WorkshopBanner />
    </div>
  )
}

function WorkshopBanner() {
  const w = workshops[0]
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-warm p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><CalendarDays /></div>
        <div>
          <Badge variant="accent">Live in 5 days</Badge>
          <h3 className="mt-2 font-display text-xl font-semibold">{w.title}</h3>
          <p className="text-ink-muted">{w.date} - {w.time} - {w.duration}</p>
        </div>
      </div>
      <div className="flex gap-3"><Button variant="secondary">Add to Calendar</Button><Button>Join Workshop</Button></div>
    </section>
  )
}

function SectionTitle({ title, subtitle }) {
  return <div><h2 className="font-display text-2xl font-medium">{title}</h2>{subtitle && <p className="mt-1 text-ink-muted">{subtitle}</p>}</div>
}

function CoursePillTabs({ active, onChange }) {
  return (
    <div className="flex gap-2">
      {['Short courses', 'Long courses'].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
            tab === active
              ? 'bg-primary text-white'
              : 'border border-border bg-surface text-ink-muted hover:border-primary/40'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function CourseCard({ course, progress, lastSessionId }) {
  if (!course) return null
  // Handles both Supabase shape (status, thumbnail_url, duration_label, price int)
  // and legacy mock shape (available bool, art, duration, price string) still used by MyLearning
  const normalizedStatus = normalizeCourseStatus(course.status)
  const isComingSoon = normalizedStatus === 'coming_soon' || (course.status === undefined && course.available === false)
  const isAvailable = normalizedStatus === 'published' || (course.status === undefined && course.available !== false)
  const priceDisplay = typeof course.price === 'number'
    ? `₹${(course.price / 100).toLocaleString('en-IN')}`
    : (course.price ?? 'Free')
  const duration = course.duration_label ?? course.duration

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-md">
      <div className="relative aspect-[4/5]">
        {course.thumbnail_url
          ? <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
          : <ArtPanel label={course.art ?? art.srinivasa} className="h-full rounded-none" />
        }
        {isComingSoon && <Badge variant="accent" className="absolute right-4 top-4">Coming Soon</Badge>}
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl font-semibold leading-snug">{course.title}</h3>
        <p className="mt-1 text-sm text-ink-muted">By {course.instructor ?? 'Drdha Vrata Gorrick'}</p>
        {duration && <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink-muted">{duration}</p>}
        {progress !== undefined
          ? <><Progress value={progress} className="mt-3" /><p className="mt-2 text-sm text-ink-muted">{progress}% complete</p></>
          : <p className="mt-4 font-display text-2xl font-semibold text-primary">{priceDisplay}</p>
        }
        <Link to={isComingSoon ? '#' : progress !== undefined ? `/courses/${course.id}/lesson/${lastSessionId ?? 'session-1'}` : `/courses/${course.id}`}>
          <Button className="mt-5 w-full" variant={isAvailable ? 'primary' : 'secondary'}>
            {isComingSoon ? 'Notify me' : progress !== undefined ? 'Continue Learning' : 'View Course'}
          </Button>
        </Link>
      </div>
    </article>
  )
}

function Progress({ value, className = '' }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))
  return <div className={`h-1 overflow-hidden rounded-full bg-border-soft ${className}`}><div className="h-full rounded-full bg-primary" style={{ width: `${safeValue}%` }} /></div>
}

async function ensureCourseEnrollment(userId, courseId, firstSessionId = null) {
  const { data: existing, error: readError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (readError) throw readError
  if (existing) return existing

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      progress: 0,
      last_session_id: firstSessionId,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

function Badge({ children, variant = 'default', className = '' }) {
  const style = variant === 'accent' ? 'bg-accent-soft text-error' : variant === 'success' ? 'bg-success/10 text-success' : 'bg-primary-soft text-ink'
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style} ${className}`}>{children}</span>
}

function JournalPreview() {
  const { session } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJournalPreview() {
      if (!session?.user?.id) {
        setEntries([])
        setLoading(false)
        return
      }

      setLoading(true)
      const { data } = await supabase
        .from('submissions')
        .select('*, course:courses(title), session:sessions(title)')
        .eq('user_id', session.user.id)
        .order('submitted_at', { ascending: false })
        .limit(5)

      setEntries((data ?? []).map((submission, index) => ({
        id: submission.id,
        date: formatSubmittedDate(submission.submitted_at).replace('Submitted ', ''),
        session: submission.session?.title ?? submission.course?.title ?? 'Practice submission',
        feedback: submission.feedback_text || formatSubmissionStatus(submission.status),
        imageUrl: submission.file_url,
        status: submission.status,
        rotate: [-2, 2, -1, 1, -2][index] ?? 0,
      })))
      setLoading(false)
    }

    loadJournalPreview()
  }, [session?.user?.id])

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <SectionTitle title="Your journey so far" subtitle="Every drawing you've made" />
        <Link to="/journal" className="text-sm font-semibold text-primary">View full journal</Link>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-border bg-surface-warm p-5 text-sm text-ink-muted">Loading your practice journal...</div>
      ) : entries.length ? (
        <div className="flex gap-5 overflow-x-auto pb-3">{entries.map((entry) => <Polaroid key={entry.id} entry={entry} small />)}</div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface-warm p-6 text-center">
          <p className="font-display text-xl font-semibold">Your first drawing will appear here.</p>
          <p className="mt-2 text-sm text-ink-muted">Submit practice from a lesson assignment and this section becomes your visual journal.</p>
        </div>
      )}
    </section>
  )
}

function BrowseCourses() {
  const [dbCourses, setDbCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [courseTypeTab, setCourseTypeTab] = useState('Short courses')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoadingCourses(true)
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      const visibleCourses = (data ?? []).filter((course) => normalizeCourseStatus(course.status) !== 'draft')
      setDbCourses(visibleCourses)
      setLoadingCourses(false)
    }
    load()
  }, [])

  const filtered = dbCourses.filter((c) => {
    const isLong = c.course_type === 'long'
    const matchTab = courseTypeTab === 'Long courses' ? isLong : !isLong
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center gap-3">
        <CoursePillTabs active={courseTypeTab} onChange={(tab) => { setCourseTypeTab(tab); setSearch('') }} />
        <label className="relative ml-auto block w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
          <input className="w-full rounded-full border border-border bg-surface py-2 pl-10 pr-4 outline-none focus:border-primary" placeholder="Search courses…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>
      {loadingCourses ? (
        <div className="py-16 text-center text-sm text-ink-muted">Loading courses…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <BookOpen className="mx-auto mb-3 text-ink-soft" size={32} />
          <p className="font-display text-lg font-semibold">{search ? 'No courses match your search.' : `No ${courseTypeTab.toLowerCase()} available yet.`}</p>
          <p className="mt-1 text-sm text-ink-muted">{search ? 'Try a different keyword.' : 'New courses are coming soon.'}</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  )
}

function LiveWorkshops() {
  return (
    <div className="space-y-9">
      <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <span className="mt-0.5 text-base">🎨</span>
        <div>
          <p className="text-[13px] font-semibold text-primary">This is a demo preview</p>
          <p className="mt-0.5 text-[12px] text-ink-muted">The workshops shown here are sample data to illustrate how this section will look. Real workshops will be created and published by Drdha from the admin panel.</p>
        </div>
      </div>
      <section className="grid gap-6 rounded-2xl border border-border bg-surface p-6 lg:grid-cols-[0.6fr_0.4fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Next up</p>
          <h2 className="mt-3 font-display text-4xl font-medium">{workshops[0].title}</h2>
          <Badge className="mt-5">{workshops[0].date} - {workshops[0].time}</Badge>
          <p className="mt-5 max-w-2xl text-ink-muted">{workshops[0].description}</p>
          <div className="mt-7 flex gap-3"><Button>Register</Button><Button variant="secondary">Add to Calendar</Button></div>
        </div>
        <ArtPanel label={art.mudra} className="min-h-[260px]" />
      </section>
      <SectionTitle title="More upcoming" />
      <div className="space-y-4">{workshops.slice(1).map((w) => <WorkshopCard key={w.title} workshop={w} />)}</div>
      <SectionTitle title="Past workshops" subtitle="All workshops are recorded - watch any replay" />
      <div className="grid gap-5 md:grid-cols-3">{workshops.slice(0, 3).map((w) => <article className="rounded-xl border border-border bg-surface p-3.5" key={w.title}><VideoPlaceholder label={`Insert a video file here: /public/videos/${w.day}-${w.month.toLowerCase()}-workshop-replay.mp4`} compact /><h3 className="mt-3 font-display text-lg font-semibold">{w.title}</h3><p className="text-sm text-ink-muted">{w.date} - {w.duration}</p><Button className="mt-3 w-full">Watch Replay</Button></article>)}</div>
    </div>
  )
}

function WorkshopCard({ workshop }) {
  return <article className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 md:flex-row md:items-center"><div className="w-20 text-center"><p className="font-display text-4xl font-medium text-primary">{workshop.day}</p><p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{workshop.month}</p></div><div className="flex-1"><h3 className="font-display text-xl font-semibold">{workshop.title}</h3><p className="text-ink-muted">{workshop.description}</p><p className="mt-1 text-sm text-ink-muted">{workshop.duration}</p></div><Button>Register</Button></article>
}

function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const fallbackCourse = courseId === longCourseBlueprint.id
    ? longCourseBlueprint
    : courses.find((c) => c.id === courseId) || courses[0]
  const [course, setCourse] = useState(null)
  const [courseSessions, setCourseSessions] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState('')
  const [open, setOpen] = useState('Who is this course for?')
  const [activeTab, setActiveTab] = useState('About')

  useEffect(() => {
    async function loadCourseDetail() {
      setLoading(true)

      const enrollmentQuery = session?.user?.id
        ? supabase.from('enrollments').select('*').eq('course_id', courseId).eq('user_id', session.user.id).maybeSingle()
        : Promise.resolve({ data: null })

      const [{ data: courseData }, { data: sessionsData }, { data: enrollmentData }] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('sessions').select('*').eq('course_id', courseId).order('position', { ascending: true }),
        enrollmentQuery,
      ])

      setCourse(courseData ?? null)
      setCourseSessions(sessionsData ?? [])
      setEnrollment(enrollmentData ?? null)
      setLoading(false)
    }

    loadCourseDetail()
  }, [courseId, session?.user?.id])

  const isDemoLongCourse = !course && fallbackCourse.id === longCourseBlueprint.id
  const isLongCourse = course?.course_type === 'long' || isDemoLongCourse
  const displayCourse = isLongCourse
    ? (course ?? longCourseBlueprint)
    : course ?? fallbackCourse
  const previewSession = courseSessions.find((session) => session.is_preview) ?? courseSessions[0] ?? null
  const sessionCount = courseSessions.length || displayCourse.session_count || displayCourse.sessions || 0
  const priceDisplay = typeof displayCourse.price === 'number'
    ? `₹${(displayCourse.price / 100).toLocaleString('en-IN')}`
    : (displayCourse.price ?? 'Free')

  const instructorName = displayCourse.instructor ?? 'Drdha Vrata Gorrick'
  const instructorInitials = instructorName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'DV'
  const faqItems = isLongCourse
    ? [
      ['Who is this course for?', displayCourse.who_is_this_for],
      ['What materials do you need?', displayCourse.materials_needed],
      ['How long do I have access?', displayCourse.access_details],
    ].filter(([, copy]) => copy)
    : [
      ['Who is this course for?', displayCourse.who_is_this_for ?? 'Students of all levels who want a devotional, structured approach to sacred drawing.'],
      ['What materials do you need?', displayCourse.materials_needed ?? 'Pencil, eraser, ruler, drawing paper, and the patience to build the form slowly.'],
      ['How long do I have access?', displayCourse.access_details ?? 'Access details can be updated from the admin editor.'],
    ]

  async function handleEnroll() {
    setEnrollError('')

    if (normalizeCourseStatus(displayCourse.status) === 'coming_soon') return
    if (!session?.user?.id) {
      setEnrollError('Please sign in before enrolling.')
      return
    }

    const firstSession = previewSession ?? courseSessions[0] ?? null
    const target = firstSession ? `/courses/${displayCourse.id}/lesson/${firstSession.id}` : '/learning'

    if (enrollment) {
      navigate(target)
      return
    }

    setEnrolling(true)

    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', displayCourse.id)
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (existingEnrollment) {
      setEnrollment(existingEnrollment)
      setEnrolling(false)
      navigate(target)
      return
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: session.user.id,
        course_id: displayCourse.id,
        progress: 0,
        last_session_id: firstSession?.id ?? null,
        status: 'active',
      })
      .select()
      .single()

    setEnrolling(false)

    if (error) {
      setEnrollError(error.message)
      return
    }

    setEnrollment(data)
    navigate(target)
  }

  if (loading) {
    return <div className="py-16 text-center text-sm text-ink-muted">Loading course…</div>
  }

  if (isLongCourse) {
    return (
      <LongCourseDetail
        displayCourse={displayCourse}
        sessionCount={sessionCount}
        priceDisplay={priceDisplay}
        instructorName={instructorName}
        instructorInitials={instructorInitials}
        faqItems={faqItems}
        open={open}
        setOpen={setOpen}
      />
    )
  }

  return (
    <CourseDetailTabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      open={open}
      setOpen={setOpen}
      displayCourse={displayCourse}
      sessionCount={sessionCount}
      priceDisplay={priceDisplay}
      previewSession={previewSession}
      courseSessions={courseSessions}
      instructorName={instructorName}
      instructorInitials={instructorInitials}
      faqItems={faqItems}
      enrollment={enrollment}
      enrolling={enrolling}
      enrollError={enrollError}
      onEnroll={handleEnroll}
    />
  )

  return (
    <div className="space-y-12">
      <section className="grid gap-7 lg:grid-cols-[0.43fr_0.57fr] lg:items-center">
        <div className="py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Recorded course - {sessionCount} sessions</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight">{displayCourse.title}</h2>
          <p className="mt-3 text-lg text-ink-muted">By {displayCourse.instructor ?? 'Drdha Vrata Gorrick'}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {displayCourse.level && <Badge>{displayCourse.level}</Badge>}
            {displayCourse.duration_label && <Badge>{displayCourse.duration_label}</Badge>}
            <Badge>{normalizeCourseStatus(displayCourse.status) === 'coming_soon' ? 'Coming Soon' : 'Self-paced'}</Badge>
          </div>
          <p className="mt-6 font-display text-4xl font-semibold text-primary">{priceDisplay}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>{normalizeCourseStatus(displayCourse.status) === 'coming_soon' ? 'Notify me' : 'Enroll Now'}</Button>
            {previewSession && <Link to={`/courses/${displayCourse.id}/lesson/${previewSession.id}`}><Button variant="secondary">Watch Free Preview</Button></Link>}
          </div>
        </div>
        <CourseTrailer url={displayCourse.trailer_url} title={displayCourse.title} />
      </section>

      <section className="border-t border-border pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.54fr_0.46fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">About</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">About this course</h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-ink-muted">{displayCourse.description ?? 'Course description will appear here once it has been added from admin.'}</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            {displayCourse.thumbnail_url
              ? <img src={displayCourse.thumbnail_url} alt={displayCourse.title} className="aspect-[4/3] w-full object-cover" />
              : <ArtPanel label={displayCourse.art ?? art.srinivasa} className="aspect-[4/3] rounded-none border-0" />
            }
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Before you begin</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">FAQs</h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            {[
              ['Who is this course for?', displayCourse.who_is_this_for ?? 'Students of all levels who want a devotional, structured approach to sacred drawing.'],
              ['What materials do you need?', displayCourse.materials_needed ?? 'Pencil, eraser, ruler, drawing paper, and the patience to build the form slowly.'],
              ['How long do I have access?', displayCourse.access_details ?? 'Access details can be updated from the admin editor.'],
            ].map(([title, copy]) => (
              <div key={title} className="border-b border-border last:border-b-0">
                <button className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-display text-lg font-semibold" onClick={() => setOpen(open === title ? '' : title)}>
                  {title}
                  <ChevronRight className={`shrink-0 transition ${open === title ? 'rotate-90' : ''}`} />
                </button>
                {open === title && <p className="px-4 pb-5 leading-7 text-ink-muted">{copy}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Curriculum</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Sessions / Modules</h2>
          </div>
          <p className="text-sm text-ink-muted">{sessionCount} sessions</p>
        </div>
        <div className="space-y-3">
          {courseSessions.length ? courseSessions.map((session, idx) => (
            <article key={session.id} className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-[72px_1fr_auto] md:items-center">
              <p className="font-display text-4xl text-primary">{String(session.position ?? idx + 1).padStart(2, '0')}</p>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold">{session.title}</h3>
                <p className="mt-1 text-ink-muted">{session.is_preview ? 'Free preview lesson available before enrollment.' : 'Recorded lesson ready inside the course player.'}</p>
                <p className="mt-1 truncate text-sm text-ink-muted">{session.video_url ? session.video_url : 'Video URL not added yet.'}</p>
              </div>
              {session.is_preview ? <Link to={`/courses/${displayCourse.id}/lesson/${session.id}`}><Badge variant="accent">Free Preview</Badge></Link> : <Lock className="text-ink-soft" />}
            </article>
          )) : (
            <div className="rounded-lg border border-dashed border-border bg-surface px-5 py-8 text-center">
              <p className="font-display text-lg font-semibold">No sessions added yet.</p>
              <p className="mt-1 text-sm text-ink-muted">The course shell is ready. Add the first session from the admin builder.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <div className="grid gap-6 rounded-lg bg-surface-warm p-5 lg:grid-cols-[0.34fr_0.66fr] lg:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Instructor</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Meet your instructor</h2>
          </div>
          <div>
            <p className="max-w-3xl leading-7 text-ink-muted">Drdha Vrata Gorrick teaches traditional Indian devotional art through the discipline of Shilpa Shastra, with a focus on careful proportion, sacred form, and steady devotional practice.</p>
            <a href="https://www.divyakala.com/" className="mt-4 inline-block font-semibold text-primary">Visit Drdha's portfolio</a>
          </div>
        </div>
      </section>
    </div>
  )
}

function SessionPill({ session, idx, courseId, isEnrolled }) {
  const [expanded, setExpanded] = useState(false)
  const accessible = session.is_preview || isEnrolled

  return (
    <div
      onClick={() => setExpanded((e) => !e)}
      className="cursor-pointer rounded-xl border border-[#e8d8a8] bg-[#faf5e8] px-4 py-3 transition hover:border-[#c9952a] hover:bg-[#f5ead8]"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#ddc990] bg-[#f0e4c4] text-[11px] font-bold text-[#b8861a]">
          {session.position ?? idx + 1}
        </div>
        <p className="flex-1 text-[13px] font-semibold text-[#1a1208]">{session.title}</p>
        <div className="flex shrink-0 items-center gap-2">
          {session.is_preview && (
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-semibold text-[#9a7a3a]">Preview</span>
          )}
          {!accessible && <Lock size={13} className="text-[#c5b090]" />}
          <ChevronRight size={14} className={`text-[#c5b090] transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      {expanded && (
        <div className="mt-3 border-t border-[#e8d8a8] pt-3">
          <p className="text-[12px] text-[#9a7a3a]">
            {session.is_preview ? 'Free preview — no enrolment needed.' : isEnrolled ? 'Enrolled access.' : 'Enrol to access this session.'}{' '}
            {session.video_url ? 'Video ready.' : 'Video coming soon.'}
          </p>
          {accessible && (
            <Link
              to={`/courses/${courseId}/lesson/${session.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 inline-block rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-primary-hover"
            >
              {session.is_preview ? 'Watch preview' : 'Go to session'}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function LongCourseDetail({
  displayCourse,
  sessionCount,
  priceDisplay,
  instructorName,
  instructorInitials,
  faqItems,
  open,
  setOpen,
}) {
  const [openModule, setOpenModule] = useState(0)
  const modules = displayCourse.long_course_structure
    ? toCourseStructureModules(displayCourse.long_course_structure)
    : displayCourse.modules ?? []
  const totalSessions = modules.reduce((sum, module) => sum + (Number(module.planned_sessions) || module.sessions.length), 0)
  const pill = 'rounded-full bg-[#ede0ba] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7a3a]'
  const eyebrow = 'text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9a7a3a]'
  const sectionHeading = 'mt-1.5 font-display text-[1.35rem] font-semibold leading-snug text-[#1a1208]'
  const divider = 'border-t border-[#e8d8a8]'
  const longFaqItems = faqItems.filter(([, copy]) => copy)
  const howLearningCards = (displayCourse.how_learning_works ?? '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
  const timelineCommitment = displayCourse.timeline_commitment ?? ''
  const moduleCount = displayCourse.module_count || modules.length || 0
  const durationLabel = displayCourse.duration_label ?? ''
  const levelLabel = displayCourse.level ?? ''
  const plannedSessionCount = sessionCount || displayCourse.session_count || totalSessions
  const liveFormatLabel = 'Live sessions + recordings'
  const enrollmentLabel = 'By request'

  const courseFacts = [
    durationLabel ? { label: 'Duration', value: durationLabel } : null,
    moduleCount ? { label: 'Modules', value: `${moduleCount} modules` } : null,
    plannedSessionCount ? { label: 'Sessions', value: `${plannedSessionCount} planned live sessions` } : null,
    levelLabel ? { label: 'Level', value: levelLabel } : null,
    { label: 'Format', value: liveFormatLabel },
    { label: 'Enrollment', value: enrollmentLabel },
  ].filter(Boolean)

  return (
    <div>
      <section className="-mx-4 -mt-5 bg-[#ede3c6] px-4 py-8 sm:-mx-5 sm:px-5 lg:-mx-5 lg:px-5 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className={eyebrow}>{durationLabel ? `Long course - ${durationLabel} live program` : 'Long course'}</p>
            <h1 className="mt-3 max-w-2xl font-display text-[1.9rem] font-semibold leading-[1.2] text-[#1a1208] sm:text-[2.25rem]">
              {displayCourse.title}
            </h1>
            <p className="mt-2.5 text-[15px] text-[#7a6040]">By {instructorName}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {durationLabel && <span className={pill}>{durationLabel}</span>}
              {moduleCount ? <span className={pill}>{moduleCount} modules</span> : null}
              {plannedSessionCount ? <span className={pill}>{plannedSessionCount} planned live sessions</span> : null}
              {levelLabel && <span className={pill}>{levelLabel}</span>}
              <span className={pill}>Recordings after class</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-display text-[1.55rem] font-semibold text-[#b8861a]">{priceDisplay}</span>
              <Button type="button">Request Enrollment</Button>
              <a href="#course-trailer">
                <Button type="button" variant="secondary">Watch Free Preview</Button>
              </a>
            </div>
          </div>

          <div id="course-trailer">
            <CourseTrailer url={displayCourse.trailer_url} title={displayCourse.title} />
          </div>
        </div>
      </section>

      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_256px] lg:items-start">
        <div>
          <section className="pb-8">
            <p className={eyebrow}>Overview</p>
            <h2 className={sectionHeading}>About this course</h2>
            {displayCourse.description ? (
              <p className="mt-4 text-[14px] leading-[1.9] text-[#7a6040]">{displayCourse.description}</p>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-[#ddc990] bg-[#faf3e4] px-4 py-4 text-[13px] text-[#9a7a3a]">About this course has not been added yet.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {moduleCount ? <span className="rounded-full border border-[#ddc990] bg-[#f5ead8] px-3 py-1 text-[12px] font-semibold text-[#7a6040]">{moduleCount}-module guided path</span> : null}
              {plannedSessionCount ? <span className="rounded-full border border-[#ddc990] bg-[#f5ead8] px-3 py-1 text-[12px] font-semibold text-[#7a6040]">{plannedSessionCount} planned live sessions</span> : null}
              <span className="rounded-full border border-[#ddc990] bg-[#f5ead8] px-3 py-1 text-[12px] font-semibold text-[#7a6040]">Live teaching with Drdha</span>
              <span className="rounded-full border border-[#b8d4a8] bg-[#eef5eb] px-3 py-1 text-[12px] font-semibold text-[#5c8a4f]">Concluded sessions become recordings</span>
            </div>
          </section>

          <div className={divider} />

          <section className="py-8">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className={eyebrow}>Structure</p>
                <h2 className={sectionHeading}>Course structure</h2>
              </div>
              {moduleCount ? <span className="shrink-0 text-[12px] text-[#9a7a3a]">{moduleCount} modules</span> : null}
            </div>
            {displayCourse.course_structure_summary && (
              <p className="mt-4 text-[13px] leading-[1.8] text-[#7a6040]">{displayCourse.course_structure_summary}</p>
            )}
            <div className="mt-5 space-y-3">
              {modules.length ? modules.map((module, index) => {
                const expanded = openModule === index
                return (
                  <article key={module.title} className="overflow-hidden rounded-xl border border-[#ddc990] bg-[#faf3e4]">
                    <button
                      type="button"
                      onClick={() => setOpenModule(expanded ? -1 : index)}
                      className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
                    >
                      <div className="flex gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ddc990] bg-[#f0e4c4] font-display text-sm font-semibold text-[#b8861a]">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-display text-[1.05rem] font-semibold leading-snug text-[#1a1208]">{module.title}</h3>
                          <p className="mt-1 text-[12px] text-[#9a7a3a]">{module.planned_sessions ?? module.sessions.length} planned sessions</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`mt-1 shrink-0 text-[#c5b090] transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </button>
                    {expanded && (
                      <div className="border-t border-[#e8d8a8] px-4 pb-5 pt-4">
                        <p className="text-[13px] leading-[1.8] text-[#7a6040]">{module.description}</p>
                        {module.sessions.length ? (
                          <ol className="mt-4 space-y-2">
                            {module.sessions.map((sessionTitle, sessionIndex) => (
                              <li key={sessionTitle} className="flex gap-3 rounded-lg border border-[#eadbb5] bg-white/55 px-3 py-2.5">
                                <span className="mt-0.5 text-[11px] font-semibold text-[#b8861a]">{String(sessionIndex + 1).padStart(2, '0')}</span>
                                <span className="text-[13px] leading-6 text-[#1a1208]">{sessionTitle}</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-4 rounded-lg border border-dashed border-[#eadbb5] bg-white/45 px-3 py-3 text-[12px] text-[#9a7a3a]">Session names will be added soon.</p>
                        )}
                      </div>
                    )}
                  </article>
                )
              }) : (
                <div className="rounded-xl border border-dashed border-[#ddc990] bg-[#faf3e4] px-5 py-8 text-center">
                  <p className="text-[13px] font-semibold text-[#1a1208]">No modules added yet.</p>
                  <p className="mt-1 text-[12px] text-[#9a7a3a]">The course structure will appear here after modules are added from admin.</p>
                </div>
              )}
            </div>
          </section>

          {howLearningCards.length > 0 && (
            <>
              <div className={divider} />
              <section className="py-8">
                <p className={eyebrow}>Method</p>
                <h2 className={sectionHeading}>How learning works</h2>
                <div className="mt-5 space-y-3">
                  {howLearningCards.map((copy, index) => (
                    <div key={`${index}-${copy}`} className="rounded-xl border border-[#ddc990] bg-[#faf3e4] p-4">
                      <p className="text-[13px] leading-[1.8] text-[#7a6040]">{copy}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {(timelineCommitment || durationLabel || moduleCount) && (
            <>
              <div className={divider} />
              <section className="py-8">
                <p className={eyebrow}>Commitment</p>
                <h2 className={sectionHeading}>Timeline and commitment</h2>
                <div className="mt-5 rounded-xl border border-[#ddc990] bg-[#faf3e4] p-5">
                  {timelineCommitment && <p className="text-[14px] leading-[1.9] text-[#7a6040]">{timelineCommitment}</p>}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {durationLabel && <div><p className={eyebrow}>Length</p><p className="mt-1 font-semibold text-[#1a1208]">{durationLabel}</p></div>}
                    {moduleCount ? <div><p className={eyebrow}>Path</p><p className="mt-1 font-semibold text-[#1a1208]">{moduleCount} sequential modules</p></div> : null}
                    <div><p className={eyebrow}>Access</p><p className="mt-1 font-semibold text-[#1a1208]">{liveFormatLabel}</p></div>
                  </div>
                </div>
              </section>
            </>
          )}

          <div className={divider} />

          <section className="py-8">
            <p className={eyebrow}>Instructor</p>
            <h2 className={sectionHeading}>Meet your instructor</h2>
            <div className="mt-5 flex gap-4">
              <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-[#ddc990] bg-[#f0e6cc] font-display text-lg font-semibold text-[#b8861a]">
                {instructorInitials}
              </div>
              <div>
                <p className="font-semibold text-[#1a1208]">{instructorName}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9a7a3a]">Traditional Shilpa Shastra artist</p>
              </div>
            </div>
            <p className="mt-5 text-[14px] leading-[1.9] text-[#7a6040]">
              Drdha Vrata Gorrick teaches traditional Indian devotional art through the discipline of Shilpa Shastra, with a focus on careful proportion, sacred form, and steady devotional practice.
            </p>
            <a href="https://www.divyakala.com/" className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#b8861a] transition-colors hover:text-[#9a7a3a]">
              Visit Drdha's portfolio <ChevronRight size={13} />
            </a>
          </section>

          {longFaqItems.length > 0 && (
            <>
              <div className={divider} />
              <section className="py-8">
                <p className={eyebrow}>Before you begin</p>
                <h2 className={sectionHeading}>Frequently asked questions</h2>
                <div className="mt-5">
                  {longFaqItems.map(([title, copy]) => (
                    <div key={title} className="border-b border-[#e8d8a8] last:border-b-0">
                      <button
                        className="faq-row flex w-full items-center justify-between gap-4 py-4 text-left text-[13px] font-semibold text-[#1a1208]"
                        onClick={() => setOpen(open === title ? '' : title)}
                      >
                        <span className="faq-label transition-colors duration-150">{title}</span>
                        <ChevronRight size={15} className={`faq-icon shrink-0 text-[#c5b090] transition-all duration-150 ${open === title ? 'rotate-90' : ''}`} />
                      </button>
                      {open === title && <p className="pb-5 text-[13px] leading-[1.8] text-[#7a6040]">{copy}</p>}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="hidden lg:block lg:sticky lg:top-4">
          <div className="mb-3 overflow-hidden rounded-xl border border-[#ddc990] bg-[#f5ead8]">
            {displayCourse.thumbnail_url
              ? <img src={displayCourse.thumbnail_url} alt={displayCourse.title} className="w-full object-contain" />
              : <img src={artImages[displayCourse.art ?? art.mahavidyas]} alt={displayCourse.title} className="w-full object-contain" />
            }
          </div>
          <div className="rounded-xl border border-[#ddc990] bg-white p-5 shadow-sm">
            <p className="font-display text-[1.45rem] font-semibold text-[#b8861a]">{priceDisplay}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Button type="button" className="w-full justify-center">Request Enrollment</Button>
              <a href="#course-trailer" className="block">
                <Button type="button" variant="secondary" className="w-full justify-center">Watch Free Preview</Button>
              </a>
            </div>
            <div className="mt-5 space-y-2.5 border-t border-[#ede0ba] pt-4">
              {courseFacts.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] text-[#9a7a3a]">{label}</span>
                  <span className="text-right text-[12px] font-semibold text-[#1a1208]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseDetailTabs({
  activeTab,
  setActiveTab,
  open,
  setOpen,
  displayCourse,
  sessionCount,
  priceDisplay,
  previewSession,
  courseSessions,
  instructorName,
  instructorInitials,
  faqItems,
  enrollment,
  enrolling,
  enrollError,
  onEnroll,
}) {
  const isComingSoon = normalizeCourseStatus(displayCourse.status) === 'coming_soon'
  const enrollLabel = isComingSoon ? 'Notify me' : enrollment ? 'Continue Learning' : enrolling ? 'Enrolling...' : 'Enroll Now'
  const stickyEnrollLabel = isComingSoon ? 'Notify me when it launches' : enrollment ? 'Continue Learning' : enrolling ? 'Enrolling...' : 'Enroll Now'
  const pill = 'rounded-full bg-[#ede0ba] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7a3a]'
  const eyebrow = 'text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9a7a3a]'
  const sectionHeading = 'mt-1.5 font-display text-[1.35rem] font-semibold leading-snug text-[#1a1208]'
  const divider = 'border-t border-[#e8d8a8]'

  const courseFacts = [
    { label: 'Sessions', value: sessionCount ? `${sessionCount} lessons` : 'Coming soon' },
    { label: 'Level', value: displayCourse.level ?? 'All levels' },
    { label: 'Duration', value: displayCourse.duration_label ?? 'Self-paced' },
    { label: 'Certificate', value: displayCourse.certificate_enabled !== false ? 'Included' : 'Not included' },
    { label: 'Format', value: isComingSoon ? 'Coming soon' : 'Self-paced' },
  ]

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="-mx-4 -mt-5 bg-[#ede3c6] px-4 py-8 sm:-mx-5 sm:px-5 lg:-mx-5 lg:px-5 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.85fr] lg:items-center">

          {/* Left: title block */}
          <div>
            <p className={eyebrow}>
              Recorded course · {sessionCount || '—'} sessions
            </p>
            <h1 className="mt-3 max-w-xl font-display text-[1.9rem] font-semibold leading-[1.2] text-[#1a1208] sm:text-[2.25rem]">
              {displayCourse.title}
            </h1>
            <p className="mt-2.5 text-[15px] text-[#7a6040]">By {instructorName}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {displayCourse.level && <span className={pill}>{displayCourse.level}</span>}
              {displayCourse.duration_label && <span className={pill}>{displayCourse.duration_label}</span>}
              <span className={pill}>{isComingSoon ? 'Coming Soon' : 'Self-paced'}</span>
            </div>

            {/* Price + CTA — visible on all screen sizes */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-display text-[1.75rem] font-semibold text-[#b8861a]">{priceDisplay}</span>
              <Button onClick={onEnroll} disabled={enrolling || isComingSoon}>{enrollLabel}</Button>
              {previewSession && (
                <Link to={`/courses/${displayCourse.id}/lesson/${previewSession.id}`}>
                  <Button variant="secondary">Free Preview</Button>
                </Link>
              )}
            </div>
            {enrollError && <p className="mt-3 text-[12px] font-semibold text-error">{enrollError}</p>}
          </div>

          {/* Right: trailer */}
          <CourseTrailer url={displayCourse.trailer_url} title={displayCourse.title} />
        </div>
      </section>

      {/* ── Body: two-column ─────────────────────────────────────── */}
      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_256px] lg:items-start">

        {/* ── Left: scrolling content ──────────────────────────── */}
        <div>

          {/* About */}
          <section className="pb-8">
            <p className={eyebrow}>Overview</p>
            <h2 className={sectionHeading}>About this course</h2>
            <p className="mt-4 text-[14px] leading-[1.9] text-[#7a6040]">
              {displayCourse.description ?? 'Course description will appear here once it has been added from admin.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {sessionCount > 0 && (
                <span className="rounded-full border border-[#ddc990] bg-[#f5ead8] px-3 py-1 text-[12px] font-semibold text-[#7a6040]">{sessionCount} sessions</span>
              )}
              {displayCourse.level && (
                <span className="rounded-full border border-[#ddc990] bg-[#f5ead8] px-3 py-1 text-[12px] font-semibold text-[#7a6040]">{displayCourse.level}</span>
              )}
              {displayCourse.duration_label && (
                <span className="rounded-full border border-[#ddc990] bg-[#f5ead8] px-3 py-1 text-[12px] font-semibold text-[#7a6040]">{displayCourse.duration_label}</span>
              )}
              {displayCourse.certificate_enabled !== false && (
                <span className="rounded-full border border-[#b8d4a8] bg-[#eef5eb] px-3 py-1 text-[12px] font-semibold text-[#5c8a4f]">Certificate included</span>
              )}
            </div>
          </section>

          <div className={divider} />

          {/* Curriculum */}
          <section className="py-8">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className={eyebrow}>Curriculum</p>
                <h2 className={sectionHeading}>Course sessions</h2>
              </div>
              {sessionCount > 0 && (
                <span className="shrink-0 text-[12px] text-[#9a7a3a]">{sessionCount} sessions</span>
              )}
            </div>
            <div className="mt-5 space-y-2">
              {courseSessions.length ? courseSessions.map((session, idx) => (
                <SessionPill key={session.id} session={session} idx={idx} courseId={displayCourse.id} isEnrolled={!!enrollment} />
              )) : (
                <div className="rounded-xl border border-dashed border-[#ddc990] bg-[#faf3e4] px-5 py-8 text-center">
                  <p className="text-[13px] font-semibold text-[#1a1208]">No sessions added yet.</p>
                  <p className="mt-1 text-[12px] text-[#9a7a3a]">The course shell is ready — add the first session from the admin builder.</p>
                </div>
              )}
            </div>
          </section>

          <div className={divider} />

          {/* Instructor */}
          <section className="py-8">
            <p className={eyebrow}>Instructor</p>
            <h2 className={sectionHeading}>Meet your instructor</h2>
            <div className="mt-5 flex gap-4">
              <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-[#ddc990] bg-[#f0e6cc] font-display text-lg font-semibold text-[#b8861a]">
                {instructorInitials}
              </div>
              <div>
                <p className="font-semibold text-[#1a1208]">{instructorName}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9a7a3a]">Traditional Shilpa Shastra artist</p>
              </div>
            </div>
            <p className="mt-5 text-[14px] leading-[1.9] text-[#7a6040]">
              Drdha Vrata Gorrick teaches traditional Indian devotional art through the discipline of Shilpa Shastra, with a focus on careful proportion, sacred form, and steady devotional practice.
            </p>
            <a
              href="https://www.divyakala.com/"
              className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#b8861a] transition-colors hover:text-[#9a7a3a]"
            >
              Visit Drdha's portfolio <ChevronRight size={13} />
            </a>
          </section>

          <div className={divider} />

          {/* FAQ */}
          <section className="py-8">
            <p className={eyebrow}>Before you begin</p>
            <h2 className={sectionHeading}>Frequently asked questions</h2>
            <div className="mt-5">
              {faqItems.map(([title, copy]) => (
                <div key={title} className="border-b border-[#e8d8a8] last:border-b-0">
                  <button
                    className="faq-row flex w-full items-center justify-between gap-4 py-4 text-left text-[13px] font-semibold text-[#1a1208]"
                    onClick={() => setOpen(open === title ? '' : title)}
                  >
                    <span className="faq-label transition-colors duration-150">{title}</span>
                    <ChevronRight
                      size={15}
                      className={`faq-icon shrink-0 text-[#c5b090] transition-all duration-150 ${open === title ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {open === title && (
                    <p className="pb-5 text-[13px] leading-[1.8] text-[#7a6040]">{copy}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right: sticky enrollment card ────────────────────── */}
        <div className="hidden lg:block lg:sticky lg:top-4">

          {/* Course image */}
          {(displayCourse.thumbnail_url || displayCourse.art || true) && (
            <div className="mb-3 overflow-hidden rounded-xl border border-[#ddc990] bg-[#f5ead8]">
              {displayCourse.thumbnail_url
                ? <img src={displayCourse.thumbnail_url} alt={displayCourse.title} className="w-full object-contain" />
                : <img src={artImages[displayCourse.art ?? art.srinivasa]} alt={displayCourse.title} className="w-full object-contain" />
              }
            </div>
          )}

          {/* Enrollment card — CTA leads */}
          <div className="rounded-xl border border-[#ddc990] bg-white p-5 shadow-sm">
            <p className="font-display text-[1.6rem] font-semibold text-[#b8861a]">{priceDisplay}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Button className="w-full justify-center" onClick={onEnroll} disabled={enrolling || isComingSoon}>
                {stickyEnrollLabel}
              </Button>
              {previewSession && (
                <Link to={`/courses/${displayCourse.id}/lesson/${previewSession.id}`} className="block">
                  <Button variant="secondary" className="w-full justify-center">Watch Free Preview</Button>
                </Link>
              )}
            </div>
            {enrollError && <p className="mt-3 text-[12px] font-semibold text-error">{enrollError}</p>}
            <div className="mt-5 space-y-2.5 border-t border-[#ede0ba] pt-4">
              {courseFacts.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] text-[#9a7a3a]">{label}</span>
                  <span className="text-right text-[12px] font-semibold text-[#1a1208]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseTrailer({ url, title }) {
  const videoUrl = url?.trim() ?? ''
  const videoType = getVideoUrlType(videoUrl)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-md">
      <div className="aspect-video overflow-hidden rounded-xl">
        {!videoUrl ? (
          <VideoPlaceholder label="Add a trailer URL in the admin course editor." />
        ) : videoType === 'youtube' ? (
          <iframe
            title={`${title} trailer`}
            src={getYouTubeEmbedUrl(videoUrl)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoType === 'vimeo' ? (
          <iframe
            title={`${title} trailer`}
            src={getVimeoEmbedUrl(videoUrl)}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={videoUrl} controls className="h-full w-full bg-black" />
        )}
      </div>
      <p className="px-4 py-3 text-sm text-ink-muted">A short preview of the course experience.</p>
    </div>
  )
}

function Gallery() {
  return <section><SectionTitle title="What students are creating" subtitle="A glimpse of the work students complete in this course" /><div className="mt-6 flex gap-5 overflow-x-auto pb-3">{journalEntries.map((entry, i) => <div key={entry[0]} className="w-64 shrink-0"><ArtPanel label={entry[3]} className="h-72" /><p className="mt-2 text-sm text-ink-muted">{['Priya, Bangalore', 'Meera, Pune', 'Ananya, Chennai', 'Ravi, Delhi', 'Kiran, Mumbai', 'Dev, Jaipur'][i]}</p></div>)}</div></section>
}

function Testimonials() {
  const quotes = ['Drdha\'s eye for proportion changed how I see every drawing I attempt now.', 'The way he breaks down Talamana made years of confusion finally click.', 'This course feels personal, rigorous, and quietly beautiful.']
  return <section><SectionTitle title="What students say" /><div className="mt-6 grid gap-6 md:grid-cols-3">{quotes.map((q, i) => <article key={q} className="rounded-2xl border border-border bg-surface p-6"><p className="text-primary">*****</p><p className="mt-4 font-display text-2xl italic">{q}</p><p className="mt-5 text-sm text-ink-muted">- {['Priya R., Bangalore', 'Arjun S., Mysore', 'Leela M., Mumbai'][i]}</p></article>)}</div></section>
}

function LessonPlayer() {
  const { courseId, sessionId } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [leftOpen, setLeftOpen] = useState(true)
  const [lessonTab, setLessonTab] = useState('Overview')
  const [sideTab, setSideTab] = useState('Notes')
  const [feedbackSubmission, setFeedbackSubmission] = useState(null)
  const [course, setCourse] = useState(null)
  const [courseSessions, setCourseSessions] = useState([])
  const [activeSession, setActiveSession] = useState(sessionId)
  const [currentSessionData, setCurrentSessionData] = useState(null)
  const [lockedSession, setLockedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [submissionsError, setSubmissionsError] = useState('')
  const [submissionRefreshKey, setSubmissionRefreshKey] = useState(0)
  const [enrollment, setEnrollment] = useState(null)
  const [progressSaving, setProgressSaving] = useState(false)
  const [progressError, setProgressError] = useState('')
  const fallbackCourse = courses.find((item) => item.id === courseId) || courses[0]

  useEffect(() => {
    setActiveSession(sessionId)
    setLockedSession(null)
  }, [sessionId])

  useEffect(() => {
    async function loadLessonShell() {
      setLoading(true)

      const enrollmentQuery = session?.user?.id
        ? supabase.from('enrollments').select('*').eq('course_id', courseId).eq('user_id', session.user.id).maybeSingle()
        : Promise.resolve({ data: null })

      const [{ data: courseData }, { data: sessionsData }, { data: enrollmentData }] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('sessions').select('*').eq('course_id', courseId).order('position', { ascending: true }),
        enrollmentQuery,
      ])

      setCourse(courseData ?? null)
      setCourseSessions(sessionsData ?? [])
      setEnrollment(enrollmentData ?? null)
      setLoading(false)
    }

    loadLessonShell()
  }, [courseId, session?.user?.id])

  useEffect(() => {
    async function loadCurrentSession() {
      if (!activeSession) {
        setCurrentSessionData(null)
        return
      }

      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', activeSession)
        .single()

      setCurrentSessionData(data ?? null)
    }

    loadCurrentSession()
  }, [activeSession])

  useEffect(() => {
    async function loadSessionSubmissions() {
      if (!activeSession || !courseId) {
        setAssignmentSubmissions([])
        return
      }

      setSubmissionsLoading(true)
      setSubmissionsError('')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAssignmentSubmissions([])
        setSubmissionsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('session_id', activeSession)
        .order('submitted_at', { ascending: false })

      if (error) {
        setSubmissionsError(error.message)
        setAssignmentSubmissions([])
      } else {
        setAssignmentSubmissions(data ?? [])
      }

      setSubmissionsLoading(false)
    }

    loadSessionSubmissions()
  }, [activeSession, courseId, submissionRefreshKey])

  useEffect(() => {
    if (!session?.user?.id || !activeSession) return undefined

    const channel = supabase
      .channel(`student-submissions-${session.user.id}-${activeSession}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const changedSessionId = payload.new?.session_id ?? payload.old?.session_id
          if (changedSessionId === activeSession) {
            setSubmissionRefreshKey((key) => key + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeSession, session?.user?.id])

  const displayCourse = course ?? fallbackCourse
  const activeIndex = courseSessions.findIndex((session) => session.id === activeSession)
  const currentSession = currentSessionData ?? courseSessions[activeIndex] ?? courseSessions[0] ?? null
  const currentSessionNumber = currentSession?.position ?? (activeIndex >= 0 ? activeIndex + 1 : 1)
  const lessonContent = getLessonContent(activeSession, currentSessionNumber, currentSession?.title ?? 'This session')
  const sessionReference = currentSession?.reference_url
    ? { label: currentSession.reference_name ?? getFileDisplayName(currentSession.reference_url), url: currentSession.reference_url }
    : null
  const sessionResources = currentSession?.resource_url
    ? [{ label: currentSession.resource_name ?? getFileDisplayName(currentSession.resource_url), url: currentSession.resource_url }]
    : lessonContent.resources
  const sessionTotal = courseSessions.length || displayCourse.sessions || 1
  const courseProgress = Math.round(Number(enrollment?.progress ?? 0))
  const completedSessionCount = Math.min(sessionTotal, Math.round((courseProgress / 100) * sessionTotal))
  const isCurrentComplete = activeIndex >= 0 && activeIndex < completedSessionCount

  function selectSession(id, index) {
    const selected = courseSessions[index]
    const locked = !selected?.is_preview && (!enrollment || index > completedSessionCount)
    if (locked) {
      setLockedSession(courseSessions[index])
      return
    }
    setLockedSession(null)
    setActiveSession(id)
    navigate(`/courses/${displayCourse.id}/lesson/${id}`)
  }

  async function markCurrentSessionComplete() {
    if (!currentSession || progressSaving) return

    setProgressSaving(true)
    setProgressError('')

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Please sign in before saving progress.')

      const currentIndex = Math.max(activeIndex, courseSessions.findIndex((item) => item.id === currentSession.id), 0)
      const completedCount = Math.max(completedSessionCount, currentIndex + 1)
      const nextSession = courseSessions[currentIndex + 1]
      const nextProgress = Math.min(100, Math.round((completedCount / sessionTotal) * 100))
      if (!enrollment) {
        await ensureCourseEnrollment(user.id, displayCourse.id, currentSession.id)
      }
      const payload = {
        progress: nextProgress,
        last_session_id: nextSession?.id ?? currentSession.id,
        status: nextProgress >= 100 ? 'completed' : 'active',
        completed_at: nextProgress >= 100 ? new Date().toISOString() : null,
      }

      const { data, error } = await supabase
        .from('enrollments')
        .update(payload)
        .eq('user_id', user.id)
        .eq('course_id', displayCourse.id)
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('Could not find your enrollment to update.')

      setEnrollment(data)
      if (nextSession) {
        setLockedSession(null)
        setActiveSession(nextSession.id)
        navigate(`/courses/${displayCourse.id}/lesson/${nextSession.id}`)
      }
    } catch (error) {
      setProgressError(error.message ?? 'Could not save progress.')
    } finally {
      setProgressSaving(false)
    }
  }

  function goToAdjacentSession(direction) {
    const nextIndex = activeIndex + direction
    const nextSession = courseSessions[nextIndex]
    if (!nextSession) return
    selectSession(nextSession.id, nextIndex)
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-bg text-sm text-ink-muted">Loading lesson…</div>
  }

  if (!currentSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <div className="max-w-md rounded-2xl border border-border bg-surface p-8">
          <p className="font-display text-2xl font-semibold">No sessions available yet.</p>
          <p className="mt-2 text-sm text-ink-muted">This course is live in the catalog, but the lesson content has not been added yet.</p>
          <Button className="mt-5" onClick={() => navigate(`/courses/${courseId}`)}>Back to course</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="bg-bg px-3 pt-3">
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {!leftOpen && <button onClick={() => setLeftOpen(true)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface-warm text-ink-muted transition hover:border-primary hover:text-ink" aria-label="Open course sessions"><Menu size={15} /></button>}
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Learning screen</p>
              <h1 className="truncate font-display text-xl font-semibold">{lockedSession ? `Session locked: ${lockedSession.title}` : `Session ${currentSessionNumber}: ${currentSession.title}`}</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {!lockedSession && <TabRow tabs={['Overview', 'Assignment', 'Resources']} active={lessonTab} onChange={setLessonTab} small />}
            <button onClick={() => navigate(`/courses/${displayCourse.id}`)} className="grid h-8 w-8 place-items-center rounded-full text-ink-muted hover:bg-surface-warm hover:text-ink"><X size={16} /></button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-82px)] px-3 pb-3 pt-3">
        <aside className={`${leftOpen ? 'mr-3 w-52 translate-x-0 opacity-100' : 'mr-0 w-0 -translate-x-3 overflow-hidden border-transparent p-0 opacity-0'} hidden shrink-0 rounded-2xl border border-border bg-surface p-3 shadow-sm transition-all duration-300 ease-in-out lg:block`}>
          <div className={`${leftOpen ? 'opacity-100 delay-100' : 'opacity-0'} transition-opacity duration-200`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Course sessions</p>
              <button onClick={() => setLeftOpen(false)} className="grid h-7 w-7 place-items-center rounded-full text-ink-muted transition hover:bg-surface-warm hover:text-ink" aria-label="Close course sessions"><ChevronLeft size={15} /></button>
            </div>
            <div className="space-y-2">
              {courseSessions.map((session, i) => {
                const isActive = !lockedSession && session.id === activeSession
                const isComplete = i < completedSessionCount
                const isLocked = !session.is_preview && (!enrollment || i > completedSessionCount)
                return (
                  <button
                    key={session.id}
                    onClick={() => selectSession(session.id, i)}
                    className={`w-full rounded-lg border p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${isActive ? 'border-primary bg-primary-soft/60' : isLocked ? 'border-border bg-surface-warm/70 text-ink-muted hover:border-primary/50' : 'border-border bg-surface-warm hover:border-primary/50'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
                        {isComplete ? <Check className="text-success" size={15} /> : isLocked ? <Lock className="text-ink-soft" size={15} /> : <Play className="text-primary" size={15} />}
                        Session {session.position ?? i + 1}
                      </span>
                      <span className="text-xs text-ink-muted">{session.is_preview ? 'Preview' : session.video_url ? 'Video ready' : 'No video'}</span>
                    </div>
                    <p className="mt-1.5 font-display text-[13px] font-semibold leading-snug">{session.title}</p>
                    {isLocked && <p className="mt-1 text-xs text-ink-soft">Unlocks after previous video</p>}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 rounded-lg border border-border bg-bg p-2.5">
              <div className="mb-2 flex items-center justify-between text-xs text-ink-muted"><span>Course progress</span><span>{courseProgress}%</span></div>
              <Progress value={courseProgress} />
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          {lockedSession ? (
            <LockedLesson
              session={lockedSession}
              onBack={() => setLockedSession(null)}
              onMarkPreviousComplete={markCurrentSessionComplete}
              saving={progressSaving}
            />
          ) : lessonTab === 'Assignment' ? (
            <AssignmentWorkspace
              courseId={displayCourse.id}
              sessionId={currentSession.id}
              sessionNumber={currentSessionNumber}
              sessionTitle={currentSession.title}
              lessonContent={lessonContent}
              submissions={assignmentSubmissions}
              submissionsLoading={submissionsLoading}
              submissionsError={submissionsError}
              onSubmitted={() => setSubmissionRefreshKey((key) => key + 1)}
              onFeedback={setFeedbackSubmission}
            />
          ) : lessonTab === 'Resources' ? (
            <ResourcesWorkspace sessionNumber={currentSessionNumber} sessionTitle={currentSession.title} resources={sessionResources} />
          ) : (
            <OverviewWorkspace
              activeSession={activeSession}
              currentSession={currentSession}
              lessonContent={lessonContent}
              sessionReference={sessionReference}
              sideTab={sideTab}
              setSideTab={setSideTab}
            />
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <Button variant="secondary" onClick={() => goToAdjacentSession(-1)} disabled={activeIndex <= 0}>Previous Session</Button>
            <div className="flex gap-2">
              <Button onClick={markCurrentSessionComplete} disabled={progressSaving || isCurrentComplete}>
                {progressSaving ? 'Saving...' : isCurrentComplete ? 'Completed' : 'Mark as Complete'}
              </Button>
              <Button variant="secondary" onClick={() => goToAdjacentSession(1)} disabled={activeIndex < 0 || activeIndex >= courseSessions.length - 1}>Next Session</Button>
            </div>
          </div>
          {courseProgress === 100 && (
            <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
              <ShieldCheck size={18} className="text-success" />
              <p className="text-sm font-semibold text-success">Course complete!</p>
              <Link to={`/courses/${courseId}/certificate`}>
                <Button variant="secondary">View Certificate</Button>
              </Link>
            </div>
          )}
          {progressError && <p className="mt-2 rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">{progressError}</p>}
        </main>
      </div>
      {feedbackSubmission && <FeedbackModal submission={feedbackSubmission} sessionNumber={currentSessionNumber} sessionTitle={currentSession.title} onClose={() => setFeedbackSubmission(null)} />}
    </div>
  )
}

function OverviewWorkspace({ activeSession, currentSession, lessonContent, sessionReference, sideTab, setSideTab }) {
  return (
    <div className="space-y-3">
      <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <LessonVideo activeSession={activeSession} currentSession={currentSession} />
        <CompanionPanel active={sideTab} onChange={setSideTab} lessonContent={lessonContent} sessionReference={sessionReference} />
      </div>
      {(currentSession?.description) && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="font-display text-lg font-semibold">About this session</h2>
          <p className="mt-1.5 text-sm leading-6 text-ink-muted">{currentSession.description}</p>
        </div>
      )}
    </div>
  )
}

function LessonVideo({ activeSession, currentSession }) {
  const videoUrl = currentSession?.video_url?.trim() ?? ''
  const videoType = getVideoUrlType(videoUrl)

  if (!videoUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-ink text-chrome-text shadow-md">
        <div className="relative aspect-video media-needed">
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <button className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface text-primary shadow-lg"><Play size={24} /></button>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft">Video coming soon</p>
              <p className="mt-1.5 text-xs text-chrome-text">No video URL has been added for this session yet.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-ink text-chrome-text shadow-md">
      <div className="relative aspect-video media-needed">
        {videoType === 'youtube' ? (
          <iframe
            title={`Session video ${activeSession}`}
            src={getYouTubeEmbedUrl(videoUrl)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoType === 'vimeo' ? (
          <iframe
            title={`Session video ${activeSession}`}
            src={getVimeoEmbedUrl(videoUrl)}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={videoUrl} controls className="h-full w-full bg-black" />
        )}
      </div>
    </div>
  )
}

function CompanionPanel({ active, onChange, lessonContent, sessionReference }) {
  return (
    <aside className="flex h-full min-h-0 flex-col rounded-lg border border-border bg-surface p-2.5 shadow-sm">
      <div className="mb-2 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Companion</p>
        <SegmentedTabs tabs={['Notes', 'Reference', 'Canvas']} active={active} onChange={onChange} />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-surface-warm">
        {active === 'Canvas' ? (
          <div className="flex h-full min-h-[220px] flex-col">
            <div className="border-b border-border bg-surface px-2.5 py-1.5 text-[11px] text-ink-muted">Quick practice - draw strokes beside the lesson.</div>
            <div className="min-h-0 flex-1"><Tldraw inferDarkMode={false} /></div>
          </div>
        ) : active === 'Reference' ? (
          <ReferencePanel reference={sessionReference} />
        ) : (
          <div className="h-full overflow-auto p-2.5"><Notes notes={lessonContent.notes} /></div>
        )}
      </div>
    </aside>
  )
}

function AssignmentWorkspace({ courseId, sessionId, sessionNumber, sessionTitle, lessonContent, submissions, submissionsLoading, submissionsError, onSubmitted, onFeedback }) {
  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-4">
      <Assignment
        courseId={courseId}
        sessionId={sessionId}
        sessionNumber={sessionNumber}
        sessionTitle={sessionTitle}
        lessonContent={lessonContent}
        submissions={submissions}
        submissionsLoading={submissionsLoading}
        submissionsError={submissionsError}
        onSubmitted={onSubmitted}
        onFeedback={onFeedback}
      />
    </div>
  )
}

function ResourcesWorkspace({ sessionNumber, sessionTitle, resources }) {
  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Session {sessionNumber}</p>
      <h2 className="font-display text-lg font-semibold">{sessionTitle} resources</h2>
      <p className="mt-1.5 text-sm text-ink-muted">Reference files and guides for this lesson are listed below.</p>
      <Resources resources={resources} />
    </section>
  )
}

function LockedLesson({ session, onBack, onMarkPreviousComplete, saving = false }) {
  return (
    <div className="grid aspect-video place-items-center rounded-xl border border-border bg-surface-warm p-6 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
          <Lock size={28} />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Session locked</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">{session.title}</h2>
        <p className="mt-3 text-ink-muted">Finish the previous video and mark it complete. This session will unlock automatically after that.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={onBack}>Return to current lesson</Button>
          <Button variant="secondary" onClick={onMarkPreviousComplete} disabled={saving}>{saving ? 'Saving...' : 'Mark previous as complete'}</Button>
        </div>
      </div>
    </div>
  )
}

function TabRow({ tabs, active, onChange, small }) {
  return <div className={`mt-4 flex flex-wrap gap-1 rounded-full bg-surface-warm p-1 ${small ? 'mt-0' : ''}`}>{tabs.map((tab) => <button key={tab} onClick={() => onChange(tab)} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${active === tab ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'}`}>{tab}</button>)}</div>
}

function SegmentedTabs({ tabs, active, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-surface-warm p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-2 py-1 text-center text-[11px] font-semibold transition ${active === tab ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:text-ink'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function Resources({ compact = false, resources = [] }) {
  if (!resources.length) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-border py-8 text-center">
        <Download className="mx-auto text-ink-soft" size={24} />
        <p className="mt-2 text-xs font-semibold text-ink-muted">No resources uploaded yet</p>
        <p className="mt-1 text-[11px] text-ink-soft">Drdha will attach practice guides and reference files for this session.</p>
      </div>
    )
  }
  return (
    <div className={`${compact ? 'mt-3 grid gap-2' : 'mt-4 grid gap-2.5 md:grid-cols-2'}`}>
      {resources.map((r) => {
        const label = typeof r === 'string' ? r : r.label
        const url = typeof r === 'string' ? '' : r.url
        const className = 'flex items-center gap-2.5 rounded-lg border border-border bg-surface-warm p-3 text-left transition hover:border-primary/60 hover:bg-bg'
        const content = <><Download className="shrink-0 text-primary" size={15} /><span className="text-xs">{label}</span></>
        return url ? (
          <a key={url} href={url} target="_blank" rel="noreferrer" className={className}>{content}</a>
        ) : (
          <button key={label} type="button" className={className}>{content}</button>
        )
      })}
    </div>
  )
}

function ReferencePanel({ reference }) {
  if (!reference?.url) {
    return (
      <div className="grid h-full min-h-[220px] place-items-center p-4 text-center">
        <div>
          <Image className="mx-auto text-ink-soft" size={28} />
          <p className="mt-2 text-xs font-semibold text-ink-muted">No reference uploaded</p>
          <p className="mt-1 text-[11px] text-ink-soft">Drdha will attach a reference image or PDF for this session.</p>
        </div>
      </div>
    )
  }

  if (isPdfSubmission(reference.url)) {
    return (
      <div className="grid h-full min-h-[220px] place-items-center p-4 text-center">
        <div>
          <FileText className="mx-auto text-primary" size={34} />
          <p className="mt-3 text-sm font-semibold">{reference.label}</p>
          <a href={reference.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">Open reference</a>
        </div>
      </div>
    )
  }

  return <img src={reference.url} alt={reference.label} className="h-full min-h-[220px] w-full object-contain" />
}

function Assignment({ courseId, sessionId, sessionNumber, sessionTitle, lessonContent, submissions = [], submissionsLoading = false, submissionsError = '', onSubmitted, onFeedback }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function submitAssignment(file) {
    if (!file || uploading) return

    setUploading(true)
    setUploadError('')

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Please sign in before submitting your practice work.')

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${user.id}/${courseId}/${sessionId}/${Date.now()}-${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(path, file)

      if (uploadError) throw uploadError

      const { data: signedData, error: signedError } = await supabase.storage
        .from('submissions')
        .createSignedUrl(path, 60 * 60 * 24 * 30)

      if (signedError) throw signedError

      const { error: insertError } = await supabase.from('submissions').insert({
        user_id: user.id,
        course_id: courseId,
        session_id: sessionId,
        file_url: signedData?.signedUrl,
        status: 'awaiting_review',
      })

      if (insertError) throw insertError

      if (fileInputRef.current) fileInputRef.current.value = ''
      onSubmitted?.()
    } catch (error) {
      setUploadError(error.message ?? 'Could not submit this assignment.')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(event) {
    const [file] = event.target.files ?? []
    submitAssignment(file)
  }

  return (
    <div className="mt-2 space-y-5">
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Session {sessionNumber}</p>
        <h3 className="font-display text-lg font-semibold">Submit your practice for {sessionTitle}</h3>
        <p className="text-sm text-ink-muted">{lessonContent.assignment} Drdha reviews each submission within 2-3 days.</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-3 w-full rounded-lg border-2 border-dashed border-border bg-surface-warm p-5 text-center transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          <UploadCloud className="mx-auto text-primary" size={24} />
          <p className="mt-2 text-sm">{uploading ? 'Uploading your practice work...' : `Upload your Session ${sessionNumber} drawing`}</p>
          <p className="text-xs text-ink-muted">PNG, JPG, or PDF - Max 10MB</p>
        </button>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handleFileChange} />
        {uploadError && <p className="mt-2 rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">{uploadError}</p>}
      </section>
      <section>
        <h3 className="font-display text-lg font-semibold">Your Session {sessionNumber} submissions</h3>
        {submissionsLoading ? (
          <div className="mt-3 rounded-lg border border-border bg-surface-warm p-4 text-sm text-ink-muted">Refreshing your submissions...</div>
        ) : submissionsError ? (
          <div className="mt-3 rounded-lg border border-error/20 bg-error/5 p-4 text-sm text-error">{submissionsError}</div>
        ) : submissions.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission) => {
              const statusLabel = formatSubmissionStatus(submission.status)
              const hasFeedback = ['reviewed', 'approved', 'needs_resubmission'].includes(submission.status)
              return (
              <article key={submission.id} className="rounded-lg border border-border bg-surface p-3">
                {submission.file_url && !submission.file_url.toLowerCase().includes('.pdf') ? (
                  <div className="h-36 overflow-hidden rounded-lg border border-border bg-surface-warm">
                    <img src={submission.file_url} alt={`Session ${sessionNumber} submission`} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <ArtPanel label={sessionNumber === 1 ? art.garuda : sessionNumber === 2 ? art.talamana : art.student} className="h-36" />
                )}
                <p className="mt-2 text-xs text-ink-muted">{formatSubmittedDate(submission.submitted_at)}</p>
                <Badge variant={getSubmissionBadgeVariant(submission.status)}>{statusLabel}</Badge>
                {hasFeedback && <button onClick={() => onFeedback(submission)} className="mt-2 block text-sm font-semibold text-primary">View feedback</button>}
              </article>
            )})}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-border bg-surface-warm p-4 text-sm text-ink-muted">No submissions yet for this session.</div>
        )}
      </section>
    </div>
  )
}

function formatSubmissionStatus(status = 'awaiting_review') {
  const labels = {
    awaiting_review: 'Awaiting review',
    reviewed: 'Reviewed',
    approved: 'Approved',
    needs_resubmission: 'Needs resubmission',
  }

  return labels[status] ?? status.replaceAll('_', ' ')
}

function getSubmissionBadgeVariant(status) {
  if (status === 'approved') return 'success'
  if (status === 'awaiting_review' || status === 'needs_resubmission') return 'accent'
  return 'default'
}

function isPdfSubmission(fileUrl = '') {
  return fileUrl.toLowerCase().includes('.pdf')
}

function getStoragePathFromUrl(url = '', bucket) {
  try {
    const parsed = new URL(url)
    const marker = `/object/sign/${bucket}/`
    const publicMarker = `/object/public/${bucket}/`
    const pathMarker = parsed.pathname.includes(marker) ? marker : parsed.pathname.includes(publicMarker) ? publicMarker : ''
    if (!pathMarker) return ''
    return decodeURIComponent(parsed.pathname.split(pathMarker)[1] ?? '')
  } catch {
    return ''
  }
}

function getSafeFileName(file) {
  return file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
}

function getFileDisplayName(url = '') {
  try {
    const parsed = new URL(url)
    const path = decodeURIComponent(parsed.pathname.split('/').pop() ?? '')
    return path.split('-').slice(1).join('-') || path || 'Open file'
  } catch {
    return 'Open file'
  }
}

function buildAnnotationDataUrl(paths = []) {
  if (!paths.length) return ''

  const pathMarkup = paths
    .map((path) => `<path d="${path.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')}" fill="none" stroke="#B5482D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">${pathMarkup}</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function formatSubmittedDate(date) {
  if (!date) return 'Submitted just now'

  return `Submitted ${new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`
}

function Notes({ notes = [] }) {
  return <div className="space-y-3 overflow-auto text-xs leading-5 text-ink-muted">{notes.map(([time, text]) => <p key={time}><strong className="text-ink">{time}</strong> - {text}</p>)}</div>
}

function FeedbackModal({ submission, sessionNumber = 3, sessionTitle = 'Form Construction', onClose }) {
  const feedbackText = submission?.feedback_text || `Good progress on ${sessionTitle}. Your structure is becoming clearer, but review the marked areas and revisit the related timestamp in the lesson. The strongest part is your patience with the construction marks.`

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4">
      <div className="max-h-[88vh] w-full max-w-6xl overflow-auto rounded-[20px] border border-border bg-surface shadow-xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-5"><h2 className="font-display text-3xl font-medium">Drdha's feedback on your Session {sessionNumber} practice</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-warm"><X /></button></header>
        <div className="grid gap-6 p-6 lg:grid-cols-[0.6fr_0.4fr]">
          <div className="grid gap-4 md:grid-cols-2"><AnnotatedCard title="Your submission" submission={submission} annotated={false} /><AnnotatedCard title="Drdha's annotations" submission={submission} annotated /></div>
          <aside className="rounded-2xl border border-border bg-surface-warm p-6"><h3 className="font-display text-2xl font-semibold">Voice note</h3><VoiceNote audioUrl={submission?.feedback_audio_url} /><p className="mt-6 text-lg leading-7 text-ink-muted">{feedbackText}</p><div className="mt-8 flex gap-3"><Button>Mark as resolved</Button><Button variant="secondary">Resubmit</Button></div></aside>
        </div>
        <footer className="border-t border-border p-5 text-sm text-ink-muted">Drdha typically reviews submissions within 2-3 days - Next session unlocks after this one is approved</footer>
      </div>
    </div>
  )
}

function AnnotatedCard({ title, submission, annotated }) {
  const fileUrl = submission?.file_url

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-muted">{title}</p>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-warm">
        {fileUrl && isPdfSubmission(fileUrl) ? (
          <div className="grid h-[420px] place-items-center p-6 text-center">
            <div>
              <FileText className="mx-auto text-primary" size={42} />
              <p className="mt-4 font-display text-xl font-semibold">PDF submission</p>
              <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Open PDF</a>
            </div>
          </div>
        ) : fileUrl ? (
          <img src={fileUrl} alt={title} className="block max-h-[420px] w-full object-contain" />
        ) : (
          <ArtPanel label={art.student} className="h-[420px] rounded-none border-0" />
        )}
        {annotated && submission?.annotated_file_url ? (
          <img src={submission.annotated_file_url} alt="Drdha annotation overlay" className="pointer-events-none absolute inset-0 h-full w-full" />
        ) : annotated && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="43" cy="30" r="10" fill="none" stroke="#B5482D" strokeDasharray="3 2" strokeWidth="0.8" />
            <path d="M61 22 C72 26 75 32 80 42" fill="none" stroke="#B5482D" strokeWidth="0.9" />
            <path d="M78 42 l-4 -2 m4 2 l-1 -5" fill="none" stroke="#B5482D" strokeWidth="0.9" />
            <path d="M22 62 C34 57 43 58 52 65" fill="none" stroke="#B5482D" strokeWidth="0.7" />
            <circle cx="67" cy="70" r="7" fill="none" stroke="#B5482D" strokeWidth="0.6" />
          </svg>
        )}
      </div>
    </div>
  )
}

function VoiceNote({ audioUrl }) {
  const bars = [12, 22, 16, 30, 10, 36, 24, 18, 32, 14, 27, 20, 38, 16, 28, 12]
  if (audioUrl) {
    return (
      <div className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3">
        <audio src={audioUrl} controls className="w-full" />
      </div>
    )
  }

  return <div className="mt-4 flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3"><button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white"><Play size={16} /></button><div className="flex flex-1 items-center gap-1">{bars.map((h, i) => <span key={i} className="w-1 rounded-full bg-primary" style={{ height: h }} />)}</div><span className="text-sm text-ink-muted">1:23</span></div>
}

function PracticeJournal() {
  return <div className="space-y-8"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><p className="text-lg text-ink-muted">Every drawing you've made on this journey</p><div className="flex gap-3"><select className="rounded-full border border-border bg-surface px-5 py-3"><option>All courses</option></select><Button variant="secondary">Timeline</Button></div></div><div className="relative mx-auto max-w-5xl"><div className="absolute left-1/2 top-0 hidden h-full w-px bg-border md:block" />{journalEntries.map((entry, i) => <div key={entry[0]} className={`relative mb-10 flex ${i % 2 ? 'md:justify-end' : 'md:justify-start'}`}><div className="w-full md:w-[46%]"><Polaroid entry={entry} /></div></div>)}</div></div>
}

function Polaroid({ entry, small }) {
  const isRealEntry = !Array.isArray(entry)
  const [mockDate, mockSession, mockFeedback, mockLabel, mockRotate] = Array.isArray(entry) ? entry : []
  const date = isRealEntry ? entry.date : mockDate
  const sessionTitle = isRealEntry ? entry.session : mockSession
  const feedback = isRealEntry ? entry.feedback : mockFeedback
  const rotate = isRealEntry ? entry.rotate : mockRotate
  const imageUrl = isRealEntry ? entry.imageUrl : ''
  const label = isRealEntry ? art.student : mockLabel

  return (
    <article className={`${small ? 'w-56 shrink-0' : ''} rounded-xl bg-surface p-3 shadow-md`} style={{ transform: `rotate(${rotate}deg)` }}>
      {imageUrl && !isPdfSubmission(imageUrl) ? (
        <div className={`${small ? 'h-52' : 'h-80'} overflow-hidden rounded-2xl border border-border bg-surface-warm`}>
          <img src={imageUrl} alt={sessionTitle} className="h-full w-full object-cover" />
        </div>
      ) : (
        <ArtPanel label={label} className={small ? 'h-52' : 'h-80'} />
      )}
      <div className="pt-3">
        <p className="text-sm">{date}</p>
        <p className="text-xs uppercase tracking-wide text-ink-muted">{sessionTitle}</p>
        <p className="mt-2 italic text-ink-muted">{feedback}</p>
      </div>
    </article>
  )
}

function Certificate() {
  const { courseId } = useParams()
  const { profile } = useAuth()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)

  useEffect(() => {
    async function load() {
      const [{ data: courseData }, { data: enrollmentData }] = await Promise.all([
        supabase.from('courses').select('title').eq('id', courseId).maybeSingle(),
        supabase.from('enrollments').select('completed_at').eq('course_id', courseId).eq('user_id', profile?.id ?? '').maybeSingle(),
      ])
      setCourse(courseData)
      setEnrollment(enrollmentData)
    }
    if (courseId && profile?.id) load()
  }, [courseId, profile?.id])

  const studentName = profile?.name ?? profile?.email?.split('@')[0] ?? 'Student'
  const courseTitle = course?.title ?? 'this course'
  const completedDate = enrollment?.completed_at
    ? new Date(enrollment.completed_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="text-center">
      <p className="text-lg text-ink-muted">Congratulations — you've completed {courseTitle}.</p>
      <div className="ornate-border mx-auto mt-8 max-w-5xl rounded-xl p-8 shadow-xl lg:p-14">
        <img src={logo} alt="Divyakala" className="mx-auto max-h-20 object-contain" />
        <h2 className="mt-8 font-display text-5xl font-medium">Certificate of Completion</h2>
        <div className="mx-auto my-7 h-px w-48 bg-primary" />
        <p className="text-xl italic text-ink-muted">This is to certify that</p>
        <p className="mt-4 font-display text-6xl font-semibold text-primary">{studentName}</p>
        <p className="mt-5 text-xl text-ink-muted">has successfully completed the course</p>
        <h3 className="mt-3 font-display text-3xl font-semibold">{courseTitle}</h3>
        <p className="mt-5 text-xl text-ink-muted">under the guidance of</p>
        <h3 className="mt-3 font-display text-3xl font-semibold">Drdha Vrata Gorrick</h3>
        <div className="mt-12 flex flex-col justify-between gap-6 text-sm text-ink-muted md:flex-row">
          <span>Completed {completedDate}</span>
          <span className="font-display text-2xl text-ink">Drdha Vrata Gorrick</span>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="secondary">Share on LinkedIn</Button>
        <Button variant="secondary">Share on Instagram</Button>
      </div>
    </div>
  )
}

function VideoPlaceholder({ label, compact = false }) {
  return (
    <div className={`media-needed relative grid ${compact ? 'aspect-video' : 'h-full min-h-[240px]'} place-items-center overflow-hidden rounded-xl border border-border p-6 text-center text-chrome-text`}>
      <button className="grid h-16 w-16 place-items-center rounded-full bg-surface text-primary shadow-lg">
        <Play size={28} />
      </button>
      <div className="absolute inset-x-4 bottom-4 rounded-xl border border-primary/30 bg-ink/70 p-3 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft">{label}</p>
      </div>
    </div>
  )
}

function ArtPanel({ label, className = '' }) {
  const src = artImages[label]
  return (
    <div className={`art-lines relative overflow-hidden rounded-2xl border border-border bg-surface-warm ${className}`}>
      {src ? (
        <img src={src} alt={label} className="h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-6 rounded-[50%] border border-primary/25" />
          <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 200 200" preserveAspectRatio="none">
            <path d="M28 160 C70 40 126 36 168 158" fill="none" stroke="#6B5D4A" strokeWidth="1" />
            <path d="M46 136 C78 78 126 78 154 136" fill="none" stroke="#C9952A" strokeWidth="1" />
            <path d="M100 32 L100 174 M64 58 C92 72 110 72 138 58 M58 112 C88 124 118 124 148 112" fill="none" stroke="#2A1F18" strokeWidth="0.7" strokeDasharray="4 4" />
          </svg>
          <div className="absolute inset-x-4 bottom-4 rounded-xl bg-surface/85 p-3 text-center text-xs font-medium uppercase tracking-wide text-ink-muted backdrop-blur">Replace with Drdha artwork: {label}</div>
        </>
      )}
    </div>
  )
}

function AdminAuth() {
  const navigate = useNavigate()
  const { session, profile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session && profile?.role === 'admin') navigate('/admin', { replace: true })
  }, [session, profile])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // Profile check happens via AuthProvider → AdminProtected; if not admin, it redirects back here
    if (data.user) {
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (prof?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('This account does not have admin access.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-[0.48fr_0.52fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <ArtPanel label={art.mahavidyas} className="h-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
        <div className="absolute bottom-10 left-10 max-w-md text-chrome-text">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-soft">Divyakala studio admin</p>
          <h1 className="mt-3 font-display text-5xl font-medium">Shape the learning path with care.</h1>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[430px] text-center">
          <img src={logo} alt="Divyakala" className="mx-auto mb-8 max-h-20 object-contain" />
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-display text-4xl font-medium">Admin sign in</h1>
          <p className="mt-3 text-lg text-ink-muted">Manage cards, courses, playlists, assignments, and student progress.</p>
          <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-8 text-left shadow-md">
            <Input label="Admin email" type="email" placeholder="drdha@divyakala.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-error">{error}</p>}
            <Button className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Enter admin studio'}</Button>
          </form>
          <Link className="mt-5 inline-block text-sm font-semibold text-primary" to="/auth/sign-in">Return to student LMS</Link>
        </div>
      </div>
    </div>
  )
}

function AdminShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pageTitle = getAdminTitle(location.pathname)

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/admin/auth')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-ink">
      <aside className={`${collapsed ? 'lg:w-[72px]' : 'lg:w-[232px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed inset-y-0 left-0 z-40 w-[232px] bg-chrome text-chrome-text transition-all duration-300`}>
        <button className="absolute right-[-18px] top-6 hidden h-9 w-9 rounded-full bg-primary text-chrome shadow-lg lg:grid lg:place-items-center" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <div className="flex h-16 items-center justify-center border-b border-chrome-muted/20 px-3">
          <img src={logo} alt="Divyakala" className={`${collapsed ? 'h-8 w-8 object-contain' : 'max-h-11 object-contain'} brightness-125`} />
        </div>
        <nav className="mt-6 space-y-1.5 px-2.5">
          <AdminNavItem to="/admin" icon={BarChart3} label="Dashboard" collapsed={collapsed} end />
          <AdminNavItem to="/admin/courses" icon={BookOpen} label="Courses" collapsed={collapsed} />
          <AdminNavItem to="/admin/assignments" icon={ClipboardCheck} label="Assignments" collapsed={collapsed} />
          <AdminNavItem to="/admin/students" icon={Users} label="Students" collapsed={collapsed} />
          <AdminNavItem to="/admin/settings" icon={Settings} label="Demo Guide" collapsed={collapsed} />
          <div className={`${collapsed ? 'mx-auto my-3 h-px w-8' : 'mx-3 my-4 h-px'} bg-chrome-muted/25`} />
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-chrome-muted">Coming soon</p>}
          <AdminNavItem to="/admin/cards" icon={Library} label="Cards" collapsed={collapsed} />
          <AdminNavItem to="/admin/playlists" icon={Layers} label="Playlists" collapsed={collapsed} />
          <AdminNavItem to="/admin/workshops" icon={CalendarDays} label="Workshops" collapsed={collapsed} />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-chrome-muted/20 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-xl font-semibold text-ink">
              {profile?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{profile?.name ?? 'Admin'}</p>
                <p className="truncate text-xs text-chrome-muted">{profile?.email ?? ''}</p>
              </div>
            )}
            <button onClick={signOut} title="Sign out" className="shrink-0 text-chrome-muted hover:text-chrome-text">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close admin menu" />}
      <div className={`${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[232px]'} min-h-screen min-w-0 transition-all duration-300`}>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/95 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
            <h1 className="font-display text-lg font-medium lg:text-xl">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/learning" className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-muted hover:border-primary hover:text-primary sm:inline-flex">
              <Eye size={13} />
              Student view
            </Link>
            <Button onClick={signOut} variant="secondary">Sign out</Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1180px] px-4 py-5 lg:px-6 lg:py-7">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="cards" element={<AdminCards />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/new" element={<AdminCourseEditor />} />
            <Route path="courses/:courseId" element={<AdminCourseEditor />} />
            <Route path="playlists" element={<AdminPlaylists />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="students" element={<AdminStudentsCRM />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function getAdminTitle(pathname) {
  if (pathname.includes('/cards')) return 'Card Library'
  if (pathname.includes('/courses/')) return 'Edit Course'
  if (pathname.includes('/courses')) return 'Course Builder'
  if (pathname.includes('/playlists')) return 'Playlist Builder'
  if (pathname.includes('/assignments')) return 'Assignment Review'
  if (pathname.includes('/students')) return 'Students'
  if (pathname.includes('/workshops')) return 'Admin Workshops'
  if (pathname.includes('/settings')) return 'Admin Settings'
  return 'Admin Dashboard'
}

function AdminNavItem({ to, icon: Icon, label, collapsed, end }) {
  const { pathname } = useLocation()
  const active = end ? pathname === to : pathname.startsWith(to)
  return (
    <Link to={to} className={`flex h-10 items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium transition ${active ? 'border-l-[3px] border-primary bg-primary-soft/20 text-primary-soft' : 'text-chrome-muted hover:bg-surface-warm/10 hover:text-chrome-text'} ${collapsed ? 'justify-center px-0' : ''}`}>
      <Icon size={17} />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

function AdminDashboard() {
  const [pendingReviews, setPendingReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  useEffect(() => {
    async function loadPendingReviews() {
      setReviewsLoading(true)

      const { data } = await supabase
        .from('submissions')
        .select('*, course:courses(title), session:sessions(title)')
        .eq('status', 'awaiting_review')
        .order('submitted_at', { ascending: false })
        .limit(3)

      const rows = data ?? []
      const userIds = [...new Set(rows.map((item) => item.user_id).filter(Boolean))]
      const { data: profilesData } = userIds.length
        ? await supabase.from('profiles').select('id, name, email').in('id', userIds)
        : { data: [] }
      const profilesById = Object.fromEntries((profilesData ?? []).map((profile) => [profile.id, profile]))

      setPendingReviews(rows.map((item) => ({
        ...item,
        student: profilesById[item.user_id] ?? null,
      })))
      setReviewsLoading(false)
    }

    loadPendingReviews()
  }, [])

  return (
    <div className="space-y-8">
      <section className="relative grid min-h-[calc(100vh-112px)] overflow-hidden rounded-[28px] border border-border bg-surface px-6 py-10 shadow-sm lg:px-12 lg:py-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-soft/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-accent/10 blur-2xl" />
        <div className="pointer-events-none absolute right-8 top-8 hidden h-28 w-28 rounded-full border border-primary/20 lg:block" />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.58fr_0.42fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Divyakala admin studio</p>
            <h2 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-tight text-ink lg:text-6xl">Hi Drdha, welcome to your dashboard.</h2>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-ink-muted">This demo shows the working heart of your LMS: publish a course, receive student practice, review it with annotation and voice, and send feedback back to the learner.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/admin/settings"><Button>Open Demo Guide</Button></Link>
              <Link to="/admin/courses"><Button variant="secondary">Create a Course</Button></Link>
            </div>
          </div>
          <div className="relative min-h-[430px]">
            <div className="absolute right-0 top-0 grid grid-cols-2 gap-5">
              <ArtPanel label={art.srinivasa} className="h-60 w-48 rotate-2 shadow-lg" />
              <ArtPanel label={art.talamana} className="mt-12 h-60 w-48 -rotate-2 shadow-lg" />
              <ArtPanel label={art.garuda} className="-mt-10 h-56 w-44 -rotate-3 shadow-lg" />
              <ArtPanel label={art.mudra} className="mt-2 h-56 w-44 rotate-3 shadow-lg" />
            </div>
            <div className="hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Demo path</p>
              <p className="mt-2 font-display text-xl font-semibold">Courses → Assignments → Feedback</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <a href="#admin-dashboard-details" className="grid h-11 w-11 animate-bounce place-items-center rounded-full border border-border bg-surface-warm text-primary shadow-sm" aria-label="Scroll to dashboard details">
            <ChevronRight className="rotate-90" size={20} />
          </a>
        </div>
      </section>

      <section id="admin-dashboard-details" className="space-y-6 scroll-mt-20">
        <div className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="rounded-2xl border border-border bg-surface-warm p-5">
            <SectionTitle title="Needs attention" subtitle="Student submissions waiting for Drdha's review and feedback." />
            <div className="mt-4 space-y-3">
              {reviewsLoading ? (
                <div className="rounded-xl border border-border bg-surface p-4 text-sm text-ink-muted">Checking for pending submissions...</div>
              ) : pendingReviews.length ? (
                pendingReviews.map((item) => <ReviewRow key={item.id} item={item} />)
              ) : (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-display text-lg font-semibold">No assignments need review right now.</p>
                  <p className="mt-1 text-sm text-ink-muted">When a student uploads practice work, it will appear here first.</p>
                </div>
              )}
            </div>
            <Link to="/admin/assignments"><Button className="mt-5 w-full">Open review queue</Button></Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <DemoMetricCard icon={BookOpen} label="Courses" value="Ready to publish" copy="Create course pages, sessions, videos, references, and resources." to="/admin/courses" />
            <DemoMetricCard icon={ClipboardCheck} label="Reviews" value="Live feedback loop" copy="Annotate uploaded work, record voice notes, and approve practice." to="/admin/assignments" />
            <DemoMetricCard icon={Users} label="Students" value="Enrollment view" copy="See who enrolled and what each student is practicing." to="/admin/students" />
          </div>
        </div>
        <AdminContentMap />
      </section>
    </div>
  )
}

function DemoMetricCard({ icon: Icon, label, value, copy, to }) {
  return (
    <Link to={to} className="group rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary"><Icon size={20} /></div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink">{value}</h3>
      <p className="mt-3 text-sm leading-6 text-ink-muted">{copy}</p>
      <p className="mt-5 text-sm font-semibold text-primary">Open {label} →</p>
    </Link>
  )
}

function FlowTile({ icon: Icon, title, copy }) {
  return <article className="rounded-xl border border-border bg-surface-warm p-4"><Icon className="text-primary" size={22} /><h3 className="mt-3 font-display text-xl font-semibold">{title}</h3><p className="mt-1 text-sm text-ink-muted">{copy}</p></article>
}

function AdminContentMap() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <SectionTitle title="What this demo proves" subtitle="A simple map of the working experience Drdha can test end to end." />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ['Publish learning', 'Courses appear in the student catalog with sessions, video, reference files, and resource downloads.'],
          ['Collect practice', 'Students upload drawings from the lesson player and see every submission status.'],
          ['Give feedback', 'Drdha reviews work with text, voice note, and red annotations; students get notified.'],
        ].map(([title, copy]) => <article key={title} className="rounded-xl border border-border bg-bg p-4"><h3 className="font-display text-lg font-semibold">{title}</h3><p className="mt-1 text-sm text-ink-muted">{copy}</p></article>)}
      </div>
    </section>
  )
}

function ComingSoonAdminPage({ icon: Icon, title, description }) {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-2xl border border-border bg-surface px-5 py-12 text-center shadow-sm">
      <div className="max-w-3xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon size={28} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-primary">Coming soon</p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-ink-muted">{description}</p>
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-surface-warm p-5">
          <p className="font-display text-xl font-semibold">Courses and Assignments are working now.</p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">Use the Course Builder to create courses and sessions. Use Assignments to review student work once the submission flow is connected.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/admin/courses"><Button>Go to Courses</Button></Link>
            <Link to="/admin/assignments"><Button variant="secondary">Go to Assignments</Button></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function AdminCards() {
  return (
    <ComingSoonAdminPage
      icon={Library}
      title="Card Library"
      description="The Card Library will let Drdha save reusable videos, notes, references, downloads, and assignment prompts, then attach them to different course sessions. For the demo, session videos are added directly inside the Course Builder."
    />
  )

  const { profile } = useAuth()
  const [cards, setCards] = useState([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [search, setSearch] = useState('')

  // form state
  const [type, setType] = useState('video')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assetUrl, setAssetUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => { loadCards() }, [])

  async function loadCards() {
    setLoadingCards(true)
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setCards(data ?? [])
    setLoadingCards(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim()) { setFormError('Title is required.'); return }
    setSaving(true)
    setFormError('')
    const { data, error } = await supabase.from('cards').insert({
      type,
      title: title.trim(),
      description: description.trim() || null,
      asset_url: assetUrl.trim() || null,
      status: 'draft',
      created_by: profile?.id,
    }).select().single()
    if (error) {
      setFormError(error.message)
    } else {
      setCards((prev) => [data, ...prev])
      setTitle('')
      setDescription('')
      setAssetUrl('')
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (!error) setCards((prev) => prev.filter((c) => c.id !== id))
  }

  async function handlePublish(id, currentStatus) {
    const next = currentStatus === 'published' ? 'draft' : 'published'
    const { error } = await supabase.from('cards').update({ status: next, updated_at: new Date().toISOString() }).eq('id', id)
    if (!error) setCards((prev) => prev.map((c) => c.id === id ? { ...c, status: next } : c))
  }

  const filtered = cards.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))

  const typeOptions = [['video', Video], ['image', Image], ['text', FileText], ['file', UploadCloud]]

  return (
    <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
      <AdminEditor title="Create card" action={saving ? 'Saving…' : 'Save card'} onSubmit={handleSave}>
        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Card type</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {typeOptions.map(([label, Icon]) => (
              <button type="button" key={label} onClick={() => setType(label)}
                className={`flex h-20 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-semibold capitalize ${type === label ? 'border-primary bg-primary-soft text-ink' : 'border-border bg-surface-warm text-ink-muted'}`}>
                <Icon size={20} />{label}
              </button>
            ))}
          </div>
        </div>
        <Input label="Card title" placeholder={`${type} card title`} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Asset URL (video, image, or PDF link)" placeholder="https://… or leave blank" value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} />
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Description / lesson notes</span>
          <textarea className="min-h-28 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="What should students see with this card?"
            value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        {formError && <p className="text-sm text-error">{formError}</p>}
      </AdminEditor>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <SectionTitle title="Cards" subtitle="Reusable content blocks for courses and sessions." />
          <label className="relative block sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
            <input className="w-full rounded-full border border-border bg-surface py-2 pl-10 pr-4 outline-none focus:border-primary"
              placeholder="Search cards…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
        {loadingCards ? (
          <div className="py-12 text-center text-sm text-ink-muted">Loading cards…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <Library className="mx-auto mb-3 text-ink-soft" size={32} />
            <p className="font-display text-lg font-semibold">{search ? 'No cards match your search.' : 'Your card library is empty.'}</p>
            <p className="mt-1 text-sm text-ink-muted">{search ? 'Try a different keyword.' : 'Create your first card using the form.'}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((card) => <AdminCard key={card.id} card={card} onDelete={handleDelete} onTogglePublish={handlePublish} />)}
          </div>
        )}
      </section>
    </div>
  )
}

function AdminCard({ card, onDelete, onTogglePublish }) {
  const typeMap = { video: Video, image: Image, text: FileText, file: UploadCloud }
  const Icon = typeMap[card.type?.toLowerCase()] ?? UploadCloud
  const published = card.status === 'published'
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon size={20} /></div>
        <Badge variant={published ? 'success' : 'default'}>{published ? 'Published' : 'Draft'}</Badge>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{card.title}</h3>
      {card.description && <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{card.description}</p>}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted capitalize">{card.type} · {new Date(card.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      {card.asset_url && <p className="mt-3 truncate rounded-lg border border-border bg-surface-warm px-3 py-2 text-sm text-ink-muted">{card.asset_url}</p>}
      <div className="mt-4 flex gap-2">
        <IconButton icon={published ? Eye : Check} label={published ? 'Unpublish' : 'Publish'} onClick={() => onTogglePublish(card.id, card.status)} />
        <IconButton icon={Trash2} label="Delete" onClick={() => onDelete(card.id)} />
      </div>
    </article>
  )
}

function AdminCourses() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrollmentsByCourse, setEnrollmentsByCourse] = useState({})
  const [sessionsByCourse, setSessionsByCourse] = useState({})
  const [sessionDrafts, setSessionDrafts] = useState({})
  const [sessionSaving, setSessionSaving] = useState({})
  const [sessionErrors, setSessionErrors] = useState({})
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [courseTypeTab, setCourseTypeTab] = useState('Short courses')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [durationLabel, setDurationLabel] = useState('')
  const [level, setLevel] = useState('Beginner-friendly')
  const [status, setStatus] = useState('draft')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  useEffect(() => { loadCourses() }, [])

  async function loadCourses() {
    setLoadingCourses(true)
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    const nextCourses = data ?? []
    setCourses(nextCourses)
    await Promise.all([loadSessions(nextCourses), loadEnrollmentSummaries(nextCourses)])
    setLoadingCourses(false)
  }

  async function loadEnrollmentSummaries(courseList) {
    if (!courseList.length) {
      setEnrollmentsByCourse({})
      return
    }

    const courseIds = courseList.map((course) => course.id)
    const { data: enrollmentRows } = await supabase
      .from('enrollments')
      .select('id, course_id, user_id, enrolled_at')
      .in('course_id', courseIds)

    const enrollments = enrollmentRows ?? []
    const userIds = [...new Set(enrollments.map((enrollment) => enrollment.user_id).filter(Boolean))]
    const { data: profilesData } = userIds.length
      ? await supabase.from('profiles').select('id, name, email').in('id', userIds)
      : { data: [] }

    const profilesById = Object.fromEntries((profilesData ?? []).map((profile) => [profile.id, profile]))
    const grouped = enrollments.reduce((acc, enrollment) => {
      const profile = profilesById[enrollment.user_id] ?? {}
      const name = profile.name ?? profile.email?.split('@')[0] ?? 'Student'
      acc[enrollment.course_id] = [...(acc[enrollment.course_id] ?? []), { ...enrollment, name }]
      return acc
    }, {})

    setEnrollmentsByCourse(grouped)
  }

  async function loadSessions(courseList) {
    if (!courseList.length) {
      setSessionsByCourse({})
      return
    }

    const courseIds = courseList.map((course) => course.id)
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .in('course_id', courseIds)
      .order('position', { ascending: true })

    const grouped = (data ?? []).reduce((acc, session) => {
      acc[session.course_id] = [...(acc[session.course_id] ?? []), session]
      return acc
    }, {})

    setSessionsByCourse(grouped)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim()) { setFormError('Title is required.'); return }
    setSaving(true)
    setFormError('')

    let thumbnail_url = null
    if (thumbnailFile) {
      const path = `${Date.now()}-${thumbnailFile.name}`
      const { error: uploadError } = await supabase.storage.from('thumbnails').upload(path, thumbnailFile)
      if (uploadError) { setFormError('Thumbnail upload failed: ' + uploadError.message); setSaving(false); return }
      const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(path)
      thumbnail_url = publicUrl
    }

    const { data, error } = await supabase.from('courses').insert({
      title: title.trim(),
      description: description.trim() || null,
      price: price ? parseInt(price) * 100 : 0,
      duration_label: durationLabel.trim() || null,
      level: level || 'Beginner-friendly',
      status,
      thumbnail_url,
      instructor_id: profile?.id,
    }).select().single()

    if (error) { setFormError(error.message) }
    else {
      setCourses((prev) => [data, ...prev])
      setEnrollmentsByCourse((prev) => ({ ...prev, [data.id]: [] }))
      setSessionsByCourse((prev) => ({ ...prev, [data.id]: [] }))
      setSessionDrafts((prev) => ({ ...prev, [data.id]: { title: '', videoUrl: '' } }))
      setTitle(''); setDescription(''); setPrice(''); setDurationLabel(''); setStatus('draft'); setThumbnailFile(null)
    }
    setSaving(false)
  }

  async function handleStatusChange(id, current) {
    const next = { draft: 'coming_soon', coming_soon: 'published', published: 'draft' }[current] ?? 'draft'
    const { error } = await supabase.from('courses').update({ status: next }).eq('id', id)
    if (!error) setCourses((prev) => prev.map((c) => c.id === id ? { ...c, status: next } : c))
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    // Delete child rows first to avoid FK constraint violations
    await supabase.from('enrollments').delete().eq('course_id', id)
    await supabase.from('sessions').delete().eq('course_id', id)
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) {
      alert(`Could not delete course: ${error.message}`)
      return
    }
    setCourses((prev) => prev.filter((c) => c.id !== id))
    setSessionsByCourse((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setEnrollmentsByCourse((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function updateSessionDraft(courseId, key, value) {
    setSessionDrafts((prev) => ({
      ...prev,
      [courseId]: {
        title: prev[courseId]?.title ?? '',
        videoUrl: prev[courseId]?.videoUrl ?? '',
        [key]: value,
      },
    }))
  }

  async function handleAddSession(courseId) {
    const draft = sessionDrafts[courseId] ?? { title: '', videoUrl: '' }
    if (!draft.title.trim() || !draft.videoUrl.trim()) {
      setSessionErrors((prev) => ({ ...prev, [courseId]: 'Session title and video URL are required.' }))
      return
    }

    setSessionSaving((prev) => ({ ...prev, [courseId]: true }))
    setSessionErrors((prev) => ({ ...prev, [courseId]: '' }))

    const existingSessions = sessionsByCourse[courseId] ?? []
    const { data, error } = await insertSessionWithFallback({
      course_id: courseId,
      title: draft.title.trim(),
      video_url: draft.videoUrl.trim(),
      position: existingSessions.length + 1,
      is_preview: existingSessions.length === 0,
    })

    if (error) {
      setSessionErrors((prev) => ({ ...prev, [courseId]: error.message }))
    } else {
      setSessionsByCourse((prev) => ({
        ...prev,
        [courseId]: [...(prev[courseId] ?? []), data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
      }))
      setSessionDrafts((prev) => ({ ...prev, [courseId]: { title: '', videoUrl: '' } }))
    }

    setSessionSaving((prev) => ({ ...prev, [courseId]: false }))
  }

  async function handleDeleteSession(courseId, sessionId) {
    const { error } = await supabase.from('sessions').delete().eq('id', sessionId)
    if (!error) {
      const remainingSessions = (sessionsByCourse[courseId] ?? []).filter((session) => session.id !== sessionId)
      const reorderedSessions = remainingSessions.map((session, index) => ({
        ...session,
        position: index + 1,
        is_preview: index === 0,
      }))

      setSessionsByCourse((prev) => ({ ...prev, [courseId]: reorderedSessions }))

      await Promise.all(reorderedSessions.map((session) => supabase
        .from('sessions')
        .update({ position: session.position, is_preview: session.is_preview })
        .eq('id', session.id)))
    }
  }

  const visibleCourses = courses.filter((c) => {
    const isLong = c.course_type === 'long'
    return courseTypeTab === 'Long courses' ? isLong : !isLong
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SectionTitle title="Courses" subtitle="Create a course first, then open it to add the trailer, question blocks, and sessions." />
        <Button onClick={() => navigate(courseTypeTab === 'Long courses' ? '/admin/courses/new?type=long' : '/admin/courses/new')}>
          <Plus className="mr-2 inline" size={15} />
          Create Course
        </Button>
      </div>

      <CoursePillTabs active={courseTypeTab} onChange={setCourseTypeTab} />

      {false && <AdminEditor title="Create course" action={saving ? 'Saving…' : 'Save course'} onSubmit={handleSave}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Course title" placeholder="Drawing Divine Forms - Ganesha" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Price (rupees)" type="number" placeholder="10600" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Duration" placeholder="6 sessions" value={durationLabel} onChange={(e) => setDurationLabel(e.target.value)} />
          <Input label="Level" placeholder="Beginner-friendly" value={level} onChange={(e) => setLevel(e.target.value)} />
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Status</span>
            <select className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Description</span>
          <textarea className="min-h-24 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="Course story, outcomes, and materials." value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Thumbnail image</span>
          <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted outline-none focus:border-primary" />
        </label>
        {formError && <p className="text-sm text-error">{formError}</p>}
      </AdminEditor>}

      {false && courses.length > 0 && (
        <section className="space-y-4">
          <SectionTitle title="Session management" subtitle="Add simple session titles and video URLs to each course. The first session becomes the free preview automatically." />
          <div className="grid gap-5 xl:grid-cols-2">
            {courses.map((course) => {
              const sessionList = sessionsByCourse[course.id] ?? []
              const draft = sessionDrafts[course.id] ?? { title: '', videoUrl: '' }
              const savingSession = sessionSaving[course.id]
              const sessionError = sessionErrors[course.id]

              return (
                <article key={`sessions-${course.id}`} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Course builder</p>
                      <h3 className="mt-1 font-display text-xl font-semibold">{course.title}</h3>
                    </div>
                    <Badge variant={course.status === 'published' ? 'success' : course.status === 'coming_soon' ? 'accent' : 'default'}>
                      {course.status === 'published' ? 'Live' : course.status === 'coming_soon' ? 'Coming Soon' : 'Draft'}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-4">
                    <Input
                      label="Session title"
                      placeholder="Session 1 - Foundations of Shilpa Shastra"
                      value={draft.title}
                      onChange={(e) => updateSessionDraft(course.id, 'title', e.target.value)}
                    />
                    <Input
                      label="Video URL — paste YouTube, Vimeo, or direct link"
                      placeholder="https://youtube.com/watch?v=..."
                      value={draft.videoUrl}
                      onChange={(e) => updateSessionDraft(course.id, 'videoUrl', e.target.value)}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-ink-muted">{sessionList.length ? `${sessionList.length} session${sessionList.length === 1 ? '' : 's'} added` : 'No sessions added yet.'}</p>
                      <Button onClick={() => handleAddSession(course.id)}>{savingSession ? 'Adding…' : 'Add session'}</Button>
                    </div>
                    {sessionError && <p className="text-sm text-error">{sessionError}</p>}
                  </div>

                  <div className="mt-5 space-y-3">
                    {sessionList.length ? sessionList.map((session) => (
                      <div key={session.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface-warm p-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary">
                          {String(session.position).padStart(2, '0')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-lg font-semibold">{session.title}</p>
                            {session.is_preview && <Badge variant="accent">Free Preview</Badge>}
                          </div>
                          <p className="mt-1 truncate text-sm text-ink-muted">{session.video_url}</p>
                        </div>
                        <IconButton icon={Trash2} label="Delete session" onClick={() => handleDeleteSession(course.id, session.id)} />
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                        <p className="font-display text-lg font-semibold">This course has no sessions yet.</p>
                        <p className="mt-1 text-sm text-ink-muted">Add the first lesson URL here and it will become the free preview.</p>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {loadingCourses ? (
        <div className="py-12 text-center text-sm text-ink-muted">Loading courses…</div>
      ) : visibleCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <BookOpen className="mx-auto mb-3 text-ink-soft" size={32} />
          <p className="font-display text-lg font-semibold">No {courseTypeTab.toLowerCase()} yet.</p>
          <p className="mt-1 text-sm text-ink-muted">Start with a course shell, then step into it to add the trailer, the three question blocks, and session content.</p>
          <Button className="mt-5" onClick={() => navigate(courseTypeTab === 'Long courses' ? '/admin/courses/new?type=long' : '/admin/courses/new')}>Create your first course</Button>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => <CourseAdminCard key={course.id} course={course} enrollments={enrollmentsByCourse[course.id] ?? []} onStatusChange={handleStatusChange} onDelete={handleDelete} />)}
        </section>
      )}
    </div>
  )
}

function AdminCourseEditor() {
  const { courseId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const isCreateMode = !courseId
  const [course, setCourse] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sessionSaving, setSessionSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [sessionError, setSessionError] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [sessionTitle, setSessionTitle] = useState('')
  const [sessionDescription, setSessionDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [sessionReferenceFile, setSessionReferenceFile] = useState(null)
  const [sessionResourceFile, setSessionResourceFile] = useState(null)
  const [courseType, setCourseType] = useState(() => searchParams.get('type') === 'long' ? 'long' : 'short')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [durationLabel, setDurationLabel] = useState('')
  const [moduleCountLabel, setModuleCountLabel] = useState('')
  const [sessionCountLabel, setSessionCountLabel] = useState('')
  const [level, setLevel] = useState('')
  const [status, setStatus] = useState('draft')
  const [trailerUrl, setTrailerUrl] = useState('')
  const [whoIsThisFor, setWhoIsThisFor] = useState('')
  const [materialsNeeded, setMaterialsNeeded] = useState('')
  const [accessDetails, setAccessDetails] = useState('')
  const [courseStructureSummary, setCourseStructureSummary] = useState('')
  const [howLearningWorks, setHowLearningWorks] = useState('')
  const [timelineCommitment, setTimelineCommitment] = useState('')
  const [longCourseModules, setLongCourseModules] = useState([])

  useEffect(() => {
    async function loadCourseEditor() {
      setLoading(true)
      if (isCreateMode) {
        setCourse(null)
        setSessions([])
        if (courseType === 'long') {
          setLongCourseModules((current) => current.length ? current : [])
        }
        setLoading(false)
        return
      }
      const [{ data: courseData }, { data: sessionsData }] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('sessions').select('*').eq('course_id', courseId).order('position', { ascending: true }),
      ])

      if (courseData) {
        setCourse(courseData)
        setTitle(courseData.title ?? '')
        setDescription(courseData.description ?? '')
        setPrice(courseData.price ? String(courseData.price / 100) : '')
        setDurationLabel(courseData.duration_label ?? '')
        setModuleCountLabel(courseData.module_count ? String(courseData.module_count) : '')
        setSessionCountLabel(courseData.session_count ? String(courseData.session_count) : '')
        setLevel(courseData.level ?? '')
        setStatus(normalizeCourseStatus(courseData.status))
        setTrailerUrl(courseData.trailer_url ?? '')
        setWhoIsThisFor(courseData.who_is_this_for ?? '')
        setMaterialsNeeded(courseData.materials_needed ?? '')
        setAccessDetails(courseData.access_details ?? '')
        setCourseStructureSummary(courseData.course_structure_summary ?? '')
        setHowLearningWorks(courseData.how_learning_works ?? '')
        setTimelineCommitment(courseData.timeline_commitment ?? '')
        setLongCourseModules(normalizeLongCourseModules(courseData.long_course_structure))
        setCourseType(courseData.course_type === 'long' ? 'long' : 'short')
      }

      setSessions(sessionsData ?? [])
      setLoading(false)
    }

    loadCourseEditor()
  }, [courseId, isCreateMode, courseType])

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim()) {
      setFormError('Course title is required.')
      return
    }

    setSaving(true)
    setFormError('')

    let thumbnailUrl = course?.thumbnail_url ?? null
    if (thumbnailFile) {
      const path = `${Date.now()}-${thumbnailFile.name}`
      const { error: uploadError } = await supabase.storage.from('thumbnails').upload(path, thumbnailFile)
      if (uploadError) {
        setFormError(`Thumbnail upload failed: ${uploadError.message}`)
        setSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(path)
      thumbnailUrl = publicUrl
    }

    const baseUpdates = {
      title: title.trim(),
      description: description.trim() || null,
      price: price ? parseInt(price) * 100 : 0,
      duration_label: durationLabel.trim() || null,
      level: level.trim() || null,
      status,
      thumbnail_url: thumbnailUrl,
      instructor_id: course?.instructor_id ?? profile?.id,
      course_type: courseType,
    }

    const query = isCreateMode
      ? supabase.from('courses').insert(baseUpdates).select().single()
      : supabase.from('courses').update(baseUpdates).eq('id', courseId).select().single()

    const { data, error } = await query
    if (error) {
      setFormError(error.message)
    } else {
      const cleanedModules = normalizeLongCourseModules(longCourseModules).map((module) => ({
        title: module.title.trim(),
        description: module.description.trim(),
        planned_sessions: Number(module.planned_sessions) || 0,
        sessions: module.sessions.map((session) => ({ title: session.title.trim() })).filter((session) => session.title),
      })).filter((module) => module.title || module.description || module.planned_sessions || module.sessions.length)
      const plannedSessionCount = cleanedModules.reduce((sum, module) => sum + (Number(module.planned_sessions) || module.sessions.length), 0)
      const extendedFields = {
        trailer_url: trailerUrl.trim() || null,
        who_is_this_for: whoIsThisFor.trim() || null,
        materials_needed: materialsNeeded.trim() || null,
        access_details: accessDetails.trim() || null,
        module_count: moduleCountLabel ? parseInt(moduleCountLabel) : cleanedModules.length || null,
        session_count: sessionCountLabel ? parseInt(sessionCountLabel) : plannedSessionCount || null,
        course_structure_summary: courseStructureSummary.trim() || null,
        how_learning_works: howLearningWorks.trim() || null,
        timeline_commitment: timelineCommitment.trim() || null,
        long_course_structure: courseType === 'long' ? { modules: cleanedModules } : null,
      }
      const { error: extendedError, skippedColumns = [] } = await saveExtendedCourseFields(data.id, extendedFields)

      setCourse({
        ...data,
        ...extendedFields,
      })
      setThumbnailFile(null)
      if (extendedError) {
        setFormError('Course saved, but some detail fields could not persist. Run the Supabase long-course SQL fields file, then save again.')
      } else if (skippedColumns.length) {
        setFormError(`Course saved, but these fields need Supabase columns before they can persist: ${skippedColumns.join(', ')}. Run the long-course SQL file, then save again.`)
      }
      if (isCreateMode) {
        navigate(`/admin/courses/${data.id}`)
      }
    }

    setSaving(false)
  }

  async function handleAddSession() {
    if (isCreateMode) {
      setSessionError('Save the course first, then add sessions.')
      return
    }
    if (!sessionTitle.trim() || !videoUrl.trim()) {
      setSessionError('Session title and video URL are required.')
      return
    }

    setSessionSaving(true)
    setSessionError('')

    let referencePayload = {}
    let resourcePayload = {}

    try {
      if (sessionReferenceFile) {
        const referenceUrl = await uploadSessionFile(courseId, sessionReferenceFile, 'reference')
        referencePayload = {
          reference_url: referenceUrl,
          reference_name: sessionReferenceFile.name,
        }
      }

      if (sessionResourceFile) {
        const resourceUrl = await uploadSessionFile(courseId, sessionResourceFile, 'resource')
        resourcePayload = {
          resource_url: resourceUrl,
          resource_name: sessionResourceFile.name,
        }
      }
    } catch (uploadError) {
      setSessionError(uploadError.message ?? 'Could not upload session files.')
      setSessionSaving(false)
      return
    }

    const { data, error, usedFallback } = await insertSessionWithFallback({
      course_id: courseId,
      title: sessionTitle.trim(),
      video_url: videoUrl.trim(),
      position: sessions.length + 1,
      is_preview: sessions.length === 0,
    }, {
      description: sessionDescription.trim() || null,
      ...referencePayload,
      ...resourcePayload,
    })

    if (error) {
      setSessionError(error.message)
    } else {
      setSessions((prev) => [...prev, data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)))
      setSessionTitle('')
      setSessionDescription('')
      setVideoUrl('')
      setSessionReferenceFile(null)
      setSessionResourceFile(null)
      if (usedFallback) {
        setSessionError('Session added. Description and upload fields need new Supabase columns before they can persist.')
      }
    }

    setSessionSaving(false)
  }

  async function uploadSessionFile(courseId, file, type) {
    const path = `sessions/${courseId}/${type}/${Date.now()}-${getSafeFileName(file)}`
    const { error: uploadError } = await supabase.storage
      .from('cards')
      .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: true })

    if (uploadError) throw uploadError

    const { data: signedData, error: signedError } = await supabase.storage
      .from('cards')
      .createSignedUrl(path, 60 * 60 * 24 * 30)

    if (signedError) throw signedError
    return signedData?.signedUrl ?? ''
  }

  async function handleDeleteSession(sessionId) {
    const { error } = await supabase.from('sessions').delete().eq('id', sessionId)
    if (!error) {
      const remainingSessions = sessions.filter((session) => session.id !== sessionId)
      const reorderedSessions = remainingSessions.map((session, index) => ({
        ...session,
        position: index + 1,
        is_preview: index === 0,
      }))

      setSessions(reorderedSessions)

      await Promise.all(reorderedSessions.map((session) => supabase
        .from('sessions')
        .update({ position: session.position, is_preview: session.is_preview })
        .eq('id', session.id)))
    }
  }

  const isLongCourseEditor = courseType === 'long'

  if (loading) {
    return <div className="py-16 text-center text-sm text-ink-muted">Loading course editor…</div>
  }

  if (!course && !isCreateMode) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-20 text-center">
        <p className="font-display text-lg font-semibold">Course not found.</p>
        <Button className="mt-4" onClick={() => navigate('/admin/courses')}>Back to courses</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button type="button" onClick={() => navigate('/admin/courses')} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ChevronLeft size={16} />
            Back to courses
          </button>
          <h2 className="mt-2 font-display text-3xl font-semibold">{isCreateMode ? 'Create course' : course.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {isLongCourseEditor
              ? 'Build the long-course detail page first. Modules and live sessions come next.'
              : isCreateMode ? 'Set up the course shell first, then save it to unlock session editing.' : 'Edit course details, publishing state, and lesson URLs here.'}
          </p>
        </div>
        <Badge variant={status === 'published' ? 'success' : status === 'coming_soon' ? 'accent' : 'default'}>
          {status === 'published' ? 'Live' : status === 'coming_soon' ? 'Coming Soon' : 'Draft'}
        </Badge>
      </div>

      <div className={`grid gap-6 ${isLongCourseEditor ? 'xl:grid-cols-[0.58fr_0.42fr]' : 'xl:grid-cols-[0.48fr_0.52fr]'}`}>
        <AdminEditor title="Course details" action={saving ? 'Saving…' : 'Save changes'} onSubmit={handleSave}>
          {isLongCourseEditor && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">Student-facing page content</p>
              <p className="mt-1 text-sm text-ink-muted">These fields map directly to the long-course detail page sections: hero, about, structure, learning method, timeline, instructor, and FAQs.</p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Course title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input label="Price (rupees)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Duration" value={durationLabel} onChange={(e) => setDurationLabel(e.target.value)} />
            {isLongCourseEditor && <Input label="Modules" type="number" min="0" value={moduleCountLabel} onChange={(e) => setModuleCountLabel(e.target.value)} />}
            <Input label={isLongCourseEditor ? 'Planned live sessions' : 'Number of sessions'} type="number" min="0" value={sessionCountLabel} onChange={(e) => setSessionCountLabel(e.target.value)} />
            <Input label="Level" value={level} onChange={(e) => setLevel(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Status</span>
              <select className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
          {isLongCourseEditor && (
            <div className="rounded-xl border border-border bg-surface-warm px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">Hero</p>
              <p className="mt-1 text-sm text-ink-muted">The hero uses the title, price, duration, level, status, trailer URL, thumbnail, and long-course labels from this form.</p>
            </div>
          )}
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">{isLongCourseEditor ? 'About this course' : 'Description'}</span>
            <textarea className="min-h-32 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <Input label="Trailer URL" placeholder="YouTube, Vimeo, or direct video link" value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} />
          {isLongCourseEditor && (
            <>
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Course structure section</span>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Explain the six-module live course structure. Module/session editing comes later."
                  value={courseStructureSummary}
                  onChange={(e) => setCourseStructureSummary(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">How learning works section</span>
                <textarea
                  className="min-h-32 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Describe live classes, practice between sessions, recordings, feedback, and LMS access."
                  value={howLearningWorks}
                  onChange={(e) => setHowLearningWorks(e.target.value)}
                />
                <span className="mt-1 block text-xs text-ink-muted">Use short paragraphs. Each new paragraph appears as a separate learning point.</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Timeline and commitment section</span>
                <textarea
                  className="min-h-32 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Set expectations for the two-year rhythm, sequence, practice load, and review cadence."
                  value={timelineCommitment}
                  onChange={(e) => setTimelineCommitment(e.target.value)}
                />
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Who is this course for?</span>
            <textarea className="min-h-24 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={whoIsThisFor} onChange={(e) => setWhoIsThisFor(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">What materials do you need?</span>
            <textarea className="min-h-24 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={materialsNeeded} onChange={(e) => setMaterialsNeeded(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">How long do I have access?</span>
            <textarea className="min-h-24 w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={accessDetails} onChange={(e) => setAccessDetails(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Thumbnail image</span>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted outline-none focus:border-primary" />
          </label>
          {formError && <p className="text-sm text-error">{formError}</p>}
        </AdminEditor>

        {isLongCourseEditor ? (
          <LongCourseModulePlanner modules={longCourseModules} setModules={setLongCourseModules} />
        ) : (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">Sessions</h2>
              <p className="mt-1 text-sm text-ink-muted">The first session is automatically treated as the free preview.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Input label="Session title" placeholder="Session 1 - Foundations of Shilpa Shastra" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} />
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Session description</span>
              <textarea rows={3} placeholder="What will students learn or practice in this session?" className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={sessionDescription} onChange={(e) => setSessionDescription(e.target.value)} />
            </label>
            <Input label="Video URL — paste YouTube, Vimeo, or direct link" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Reference upload</span>
                <input type="file" accept="image/*,application/pdf" onChange={(e) => setSessionReferenceFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted outline-none focus:border-primary" />
                <span className="mt-1 block text-xs text-ink-muted">Shows in Companion - Reference.</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Resource upload</span>
                <input type="file" accept="image/*,application/pdf,.doc,.docx,.txt" onChange={(e) => setSessionResourceFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted outline-none focus:border-primary" />
                <span className="mt-1 block text-xs text-ink-muted">Shows in the Resources tab.</span>
              </label>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">{isCreateMode ? 'Save the course first to unlock session creation.' : sessions.length ? `${sessions.length} session${sessions.length === 1 ? '' : 's'} added` : 'No sessions added yet.'}</p>
              <Button onClick={handleAddSession} disabled={isCreateMode}>{sessionSaving ? 'Adding…' : 'Add session'}</Button>
            </div>
            {sessionError && <p className="text-sm text-error">{sessionError}</p>}
          </div>

          <div className="mt-5 space-y-3">
            {sessions.length ? sessions.map((session) => (
              <div key={session.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface-warm p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary">
                  {String(session.position).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-semibold">{session.title}</p>
                    {session.is_preview && <Badge variant="accent">Free Preview</Badge>}
                  </div>
                  <p className="mt-1 truncate text-sm text-ink-muted">{session.video_url}</p>
                  {(session.reference_url || session.resource_url) && (
                    <p className="mt-1 text-xs text-ink-muted">
                      {session.reference_url ? `Reference: ${session.reference_name ?? 'Uploaded'}` : ''}
                      {session.reference_url && session.resource_url ? ' - ' : ''}
                      {session.resource_url ? `Resource: ${session.resource_name ?? 'Uploaded'}` : ''}
                    </p>
                  )}
                </div>
                <IconButton icon={Trash2} label="Delete session" onClick={() => handleDeleteSession(session.id)} />
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                <p className="font-display text-lg font-semibold">This course has no sessions yet.</p>
                <p className="mt-1 text-sm text-ink-muted">Add the first lesson URL here and it will become the free preview.</p>
              </div>
            )}
          </div>
        </section>
        )}
      </div>
    </div>
  )
}

function LongCourseModulePlanner({ modules, setModules }) {
  function addModule() {
    setModules((current) => [
      ...current,
      {
        title: `Module ${current.length + 1}`,
        description: '',
        planned_sessions: 0,
        sessions: [],
      },
    ])
  }

  function updateModule(moduleIndex, key, value) {
    setModules((current) => current.map((module, index) => (
      index === moduleIndex ? { ...module, [key]: value } : module
    )))
  }

  function removeModule(moduleIndex) {
    setModules((current) => current.filter((_, index) => index !== moduleIndex))
  }

  function addSession(moduleIndex) {
    setModules((current) => current.map((module, index) => {
      if (index !== moduleIndex) return module
      return {
        ...module,
        sessions: [...module.sessions, { title: '' }],
        planned_sessions: Math.max(Number(module.planned_sessions) || 0, module.sessions.length + 1),
      }
    }))
  }

  function updateSession(moduleIndex, sessionIndex, value) {
    setModules((current) => current.map((module, index) => {
      if (index !== moduleIndex) return module
      return {
        ...module,
        sessions: module.sessions.map((session, innerIndex) => (
          innerIndex === sessionIndex ? { ...session, title: value } : session
        )),
      }
    }))
  }

  function removeSession(moduleIndex, sessionIndex) {
    setModules((current) => current.map((module, index) => {
      if (index !== moduleIndex) return module
      return {
        ...module,
        sessions: module.sessions.filter((_, innerIndex) => innerIndex !== sessionIndex),
      }
    }))
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary">Course structure</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Modules and planned live sessions</h2>
          <p className="mt-2 text-sm leading-7 text-ink-muted">
            Create the module hierarchy students will see on the long-course detail page. Session links, recordings, resources, and dates come later.
          </p>
        </div>
        <Button type="button" onClick={addModule}>
          <Plus className="mr-2 inline" size={15} />
          Add module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.length ? modules.map((module, moduleIndex) => (
          <article key={`${moduleIndex}-${module.title}`} className="rounded-xl border border-border bg-surface-warm p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Module {moduleIndex + 1}</p>
                <p className="mt-1 text-xs text-ink-muted">{module.sessions.length} named sessions</p>
              </div>
              <IconButton icon={Trash2} label="Remove module" onClick={() => removeModule(moduleIndex)} />
            </div>

            <div className="grid gap-4">
              <Input label="Module title" value={module.title} onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)} />
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-muted">Module description</span>
                <textarea
                  className="min-h-24 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="What this module covers and how it fits into the long course."
                  value={module.description}
                  onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                />
              </label>
              <Input
                label="Potential live sessions"
                type="number"
                min="0"
                value={module.planned_sessions}
                onChange={(e) => updateModule(moduleIndex, 'planned_sessions', e.target.value)}
              />

              <div className="rounded-xl border border-border bg-surface p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Session names</p>
                  <Button type="button" variant="secondary" onClick={() => addSession(moduleIndex)}>
                    <Plus className="mr-2 inline" size={14} />
                    Add session
                  </Button>
                </div>
                <div className="space-y-2">
                  {module.sessions.length ? module.sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="flex items-center gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                        {sessionIndex + 1}
                      </span>
                      <input
                        className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                        placeholder={`Optional session ${sessionIndex + 1} name`}
                        value={session.title}
                        onChange={(e) => updateSession(moduleIndex, sessionIndex, e.target.value)}
                      />
                      <IconButton icon={Trash2} label="Remove session" onClick={() => removeSession(moduleIndex, sessionIndex)} />
                    </div>
                  )) : (
                    <div className="rounded-lg border border-dashed border-border bg-surface-warm px-4 py-5 text-center">
                      <p className="text-sm font-semibold">No session names yet.</p>
                      <p className="mt-1 text-xs text-ink-muted">You can keep only the planned session count, or add names as the module plan becomes clear.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        )) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-warm px-4 py-8 text-center">
            <p className="font-display text-lg font-semibold">No modules yet.</p>
            <p className="mt-1 text-sm text-ink-muted">Add the first module to start shaping the long-course structure.</p>
            <Button type="button" className="mt-4" onClick={addModule}>Add module</Button>
          </div>
        )}
      </div>
    </section>
  )
}

function CourseAdminCard({ course, enrollments = [], onStatusChange, onDelete }) {
  const normalizedStatus = normalizeCourseStatus(course.status)
  const statusMeta = {
    draft: { label: 'Draft', variant: 'default' },
    coming_soon: { label: 'Coming Soon', variant: 'accent' },
    published: { label: 'Live', variant: 'success' },
  }
  const { label, variant } = statusMeta[normalizedStatus] ?? statusMeta.draft
  const priceDisplay = course.price ? `₹${(course.price / 100).toLocaleString('en-IN')}` : 'Free'
  const nextLabel = { draft: 'Set Coming Soon', coming_soon: 'Publish', published: 'Unpublish' }[normalizedStatus] ?? 'Change status'
  const enrolledNames = enrollments.map((enrollment) => enrollment.name)
  const visibleNames = enrolledNames.slice(0, 2).join(', ')
  const extraCount = Math.max(enrolledNames.length - 2, 0)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid h-56 place-items-center overflow-hidden border-b border-border bg-surface-warm">
        {course.thumbnail_url
          ? <img src={course.thumbnail_url} alt={course.title} className="max-h-full w-full object-contain" />
          : <ArtPanel label={art.srinivasa} className="h-full w-full rounded-none" />
        }
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-snug">{course.title}</h3>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <p className="mt-2 text-sm text-ink-muted">{course.duration_label ?? '—'} · {priceDisplay}</p>
        <div className="mt-3 rounded-xl border border-border bg-surface-warm px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {enrollments.length ? `${enrollments.length} enrolled` : 'No enrollments yet'}
          </p>
          {enrollments.length > 0 && (
            <p className="mt-1 truncate text-sm text-ink-muted">
              {visibleNames}{extraCount > 0 ? ` +${extraCount} more` : ''}
            </p>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/admin/courses/${course.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">Edit Course</Button>
          </Link>
          <button type="button" onClick={() => onStatusChange(course.id, normalizedStatus)}
            className="rounded-full border border-primary px-4 py-2 text-[13px] font-semibold text-primary transition hover:bg-primary-soft">
            {nextLabel}
          </button>
          <IconButton icon={Trash2} label="Delete course" onClick={() => onDelete(course.id)} />
        </div>
      </div>
    </article>
  )
}

function AdminPlaylists() {
  return (
    <ComingSoonAdminPage
      icon={Layers}
      title="Playlists"
      description="Playlists will let Drdha group multiple courses into guided learning paths, workshop replay bundles, or cohort-specific journeys. For the demo, students browse and enroll in individual courses first."
    />
  )
}

function AdminAssignments() {
  const [submissions, setSubmissions] = useState([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)
  const [submissionsError, setSubmissionsError] = useState('')
  const [reviewSubmission, setReviewSubmission] = useState(null)

  async function loadSubmissions() {
    setLoadingSubmissions(true)
    setSubmissionsError('')

    const { data, error } = await supabase
      .from('submissions')
      .select('*, course:courses(title), session:sessions(title)')
      .order('submitted_at', { ascending: false })

    if (error) {
      setSubmissionsError(error.message)
      setSubmissions([])
      setLoadingSubmissions(false)
      return
    }

    const rows = data ?? []
    const userIds = [...new Set(rows.map((item) => item.user_id).filter(Boolean))]
    const { data: profilesData } = userIds.length
      ? await supabase.from('profiles').select('id, name, email').in('id', userIds)
      : { data: [] }
    const profilesById = Object.fromEntries((profilesData ?? []).map((profile) => [profile.id, profile]))

    setSubmissions(rows.map((item) => ({
      ...item,
      student: profilesById[item.user_id] ?? null,
    })))
    setLoadingSubmissions(false)
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('admin-submissions-queue')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
        },
        () => loadSubmissions()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleReviewSaved() {
    await loadSubmissions()
    setReviewSubmission(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SectionTitle title="Assignment queue" subtitle="Review submissions, add annotations, record feedback, approve or request resubmission." />
        <div className="flex gap-2">
          <Button onClick={() => setReviewSubmission(submissions.find((item) => item.status === 'awaiting_review') ?? submissions[0] ?? null)} disabled={!submissions.length}>Review next</Button>
          <Button variant="secondary" disabled>Export CSV</Button>
        </div>
      </div>
      {loadingSubmissions ? (
        <div className="rounded-2xl border border-border bg-surface-warm p-6 text-sm text-ink-muted">Loading student submissions...</div>
      ) : submissionsError ? (
        <div className="rounded-2xl border border-error/20 bg-error/5 p-6 text-sm text-error">{submissionsError}</div>
      ) : submissions.length ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {submissions.map((item) => <SubmissionCard key={item.id} item={item} onReview={() => setReviewSubmission(item)} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface-warm p-6">
          <p className="font-display text-xl font-semibold">No submissions yet.</p>
          <p className="mt-2 text-sm text-ink-muted">Once a student uploads practice work from the lesson player, it will appear here for review.</p>
        </div>
      )}
      {reviewSubmission && <ReviewSubmissionModal submission={reviewSubmission} onClose={() => setReviewSubmission(null)} onSaved={handleReviewSaved} />}
    </div>
  )
}

function SubmissionCard({ item, onReview }) {
  const studentName = item.student?.name ?? item.student?.email?.split('@')[0] ?? 'Student'
  const courseTitle = item.course?.title ?? 'Untitled course'
  const sessionTitle = item.session?.title ?? 'Course session'

  return (
    <article className="rounded-2xl border border-border bg-surface p-4">
      {item.file_url && !isPdfSubmission(item.file_url) ? (
        <div className="h-52 overflow-hidden rounded-2xl border border-border bg-surface-warm">
          <img src={item.file_url} alt={`${studentName} submission`} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="grid h-52 place-items-center rounded-2xl border border-border bg-surface-warm text-center">
          <div>
            <FileText className="mx-auto text-primary" size={34} />
            <p className="mt-2 text-sm font-semibold">{isPdfSubmission(item.file_url) ? 'PDF submission' : 'Submission file'}</p>
          </div>
        </div>
      )}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold">{studentName}</h3>
          <p className="text-sm text-ink-muted">{sessionTitle}</p>
        </div>
        <Badge variant={getSubmissionBadgeVariant(item.status)}>{formatSubmissionStatus(item.status)}</Badge>
      </div>
      <p className="mt-3 text-sm text-ink-muted">{courseTitle} - {formatSubmittedDate(item.submitted_at)}</p>
      <Button className="mt-4 w-full" onClick={onReview}>Review</Button>
    </article>
  )
}

function ReviewSubmissionModal({ submission, onClose, onSaved }) {
  const [feedbackText, setFeedbackText] = useState(submission.feedback_text ?? '')
  const [selectedStatus, setSelectedStatus] = useState(submission.status === 'awaiting_review' ? 'reviewed' : submission.status)
  const [annotationDataUrl, setAnnotationDataUrl] = useState(submission.annotated_file_url ?? '')
  const [voiceBlob, setVoiceBlob] = useState(null)
  const [voicePreviewUrl, setVoicePreviewUrl] = useState(submission.feedback_audio_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const studentName = submission.student?.name ?? submission.student?.email?.split('@')[0] ?? 'Student'
  const courseTitle = submission.course?.title ?? 'Untitled course'
  const sessionTitle = submission.session?.title ?? 'Course session'
  const canAnnotate = submission.file_url && !isPdfSubmission(submission.file_url)

  useEffect(() => {
    return () => {
      if (voicePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(voicePreviewUrl)
    }
  }, [voicePreviewUrl])

  async function saveReview(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Please sign in as admin before saving a review.')

      let feedbackAudioUrl = voicePreviewUrl?.startsWith('blob:') ? submission.feedback_audio_url : voicePreviewUrl
      if (voiceBlob) {
        const oldAudioPath = getStoragePathFromUrl(submission.feedback_audio_url, 'feedback-audio')
        const audioPath = `${user.id}/${submission.id}/${Date.now()}-feedback.webm`
        const { error: uploadError } = await supabase.storage
          .from('feedback-audio')
          .upload(audioPath, voiceBlob, { contentType: voiceBlob.type || 'audio/webm', upsert: true })

        if (uploadError) throw uploadError

        const { data: signedData, error: signedError } = await supabase.storage
          .from('feedback-audio')
          .createSignedUrl(audioPath, 60 * 60 * 24 * 30)

        if (signedError) throw signedError
        feedbackAudioUrl = signedData?.signedUrl ?? ''

        if (oldAudioPath) {
          await supabase.storage.from('feedback-audio').remove([oldAudioPath])
        }
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update({
          status: selectedStatus,
          feedback_text: feedbackText,
          feedback_audio_url: feedbackAudioUrl || null,
          annotated_file_url: annotationDataUrl || null,
          reviewed_at: new Date().toISOString(),
          reviewer_id: user.id,
        })
        .eq('id', submission.id)

      if (updateError) throw updateError

      const reviewHref = `/courses/${submission.course_id}/lesson/${submission.session_id}`
      const { error: deleteNotificationError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', submission.user_id)
        .eq('type', 'feedback')
        .eq('href', reviewHref)

      if (deleteNotificationError) throw deleteNotificationError

      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: submission.user_id,
        type: 'feedback',
        title: 'Drdha reviewed your submission',
        body: `Your work for ${sessionTitle} has been reviewed.`,
        href: reviewHref,
      })

      if (notificationError) throw notificationError

      await onSaved()
    } catch (reviewError) {
      setError(reviewError.message ?? 'Could not save this review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4">
      <form onSubmit={saveReview} className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[20px] border border-border bg-surface shadow-xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Review submission</p>
            <h2 className="font-display text-2xl font-semibold">{studentName} - {sessionTitle}</h2>
            <p className="text-sm text-ink-muted">{courseTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-warm"><X /></button>
        </header>
        <div className="grid gap-6 p-6 lg:grid-cols-[0.58fr_0.42fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-muted">Submitted file</p>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-warm">
              {submission.file_url && isPdfSubmission(submission.file_url) ? (
                <div className="grid min-h-[420px] place-items-center p-6 text-center">
                  <div>
                    <FileText className="mx-auto text-primary" size={48} />
                    <p className="mt-4 font-display text-xl font-semibold">PDF submission</p>
                    <a href={submission.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Open PDF</a>
                  </div>
                </div>
              ) : submission.file_url ? (
                <AnnotationPad fileUrl={submission.file_url} annotationDataUrl={annotationDataUrl} onChange={setAnnotationDataUrl} />
              ) : (
                <ArtPanel label={art.student} className="min-h-[420px] rounded-none border-0" />
              )}
            </div>
            {canAnnotate && <p className="mt-2 text-xs text-ink-muted">Draw directly on the image to create Drdha's annotation overlay.</p>}
          </div>
          <aside className="space-y-4 rounded-2xl border border-border bg-surface-warm p-5">
            <div>
              <span className="text-sm font-semibold">Voice note</span>
              <VoiceRecorder
                previewUrl={voicePreviewUrl}
                onRecorded={(blob, url) => {
                  if (voicePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(voicePreviewUrl)
                  setVoiceBlob(blob)
                  setVoicePreviewUrl(url)
                }}
                onClear={() => {
                  if (voicePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(voicePreviewUrl)
                  setVoiceBlob(null)
                  setVoicePreviewUrl('')
                }}
              />
            </div>
            <label className="block">
              <span className="text-sm font-semibold">Status</span>
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-primary">
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="needs_resubmission">Needs Resubmission</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Text feedback</span>
              <textarea value={feedbackText} onChange={(event) => setFeedbackText(event.target.value)} rows={10} className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm leading-6 outline-none focus:border-primary" placeholder="Write Drdha's feedback for the student..." />
            </label>
            {error && <p className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">{error}</p>}
            <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving review...' : 'Save review'}</Button>
          </aside>
        </div>
      </form>
    </div>
  )
}

function AnnotationPad({ fileUrl, annotationDataUrl, onChange }) {
  const padRef = useRef(null)
  const imageRef = useRef(null)
  const [paths, setPaths] = useState([])
  const [drawing, setDrawing] = useState(false)

  function getPoint(event) {
    const rect = imageRef.current.getBoundingClientRect()
    return {
      x: Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)),
    }
  }

  function startPath(event) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = getPoint(event)
    const nextPaths = [...paths, [point]]
    setPaths(nextPaths)
    onChange(buildAnnotationDataUrl(nextPaths))
    setDrawing(true)
  }

  function extendPath(event) {
    if (!drawing) return
    event.preventDefault()
    const point = getPoint(event)
    const nextPaths = paths.map((path, index) => index === paths.length - 1 ? [...path, point] : path)
    setPaths(nextPaths)
    onChange(buildAnnotationDataUrl(nextPaths))
  }

  function endPath(event) {
    if (drawing && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDrawing(false)
  }

  function clearAnnotations() {
    setPaths([])
    onChange('')
  }

  return (
    <div>
      <div
        ref={padRef}
        className="relative touch-none select-none bg-surface-warm"
        onPointerDown={startPath}
        onPointerMove={extendPath}
        onPointerUp={endPath}
        onPointerCancel={endPath}
      >
        <img ref={imageRef} src={fileUrl} alt="Submitted assignment" className="block max-h-[560px] w-full object-contain" draggable={false} />
        {annotationDataUrl ? (
          <img src={annotationDataUrl} alt="Annotation overlay" className="pointer-events-none absolute inset-0 h-full w-full" />
        ) : (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-surface/90 p-3 text-center text-xs text-ink-muted shadow-sm">Draw red markup here before saving the review.</div>
        )}
      </div>
      <div className="flex justify-end border-t border-border bg-surface px-3 py-2">
        <button type="button" onClick={clearAnnotations} className="text-sm font-semibold text-primary">Clear annotations</button>
      </div>
    </div>
  )
}

function VoiceRecorder({ previewUrl, onRecorded, onClear }) {
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const [recording, setRecording] = useState(false)
  const [recorderError, setRecorderError] = useState('')

  async function startRecording() {
    setRecorderError('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        onRecorded(blob, URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      recorder.start()
      setRecording(true)
    } catch (error) {
      setRecorderError(error.message ?? 'Could not access the microphone.')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.state === 'recording' && mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return (
    <div className="mt-2 rounded-xl border border-border bg-surface p-3">
      {previewUrl ? (
        <audio src={previewUrl} controls className="w-full" />
      ) : (
        <p className="text-sm text-ink-muted">Record a short spoken note for the student.</p>
      )}
      {recorderError && <p className="mt-2 text-sm text-error">{recorderError}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" onClick={recording ? stopRecording : startRecording} variant={recording ? 'secondary' : 'primary'}>
          {recording ? 'Stop recording' : previewUrl ? 'Record again' : 'Record voice note'}
        </Button>
        {previewUrl && <Button type="button" variant="secondary" onClick={onClear}>Clear voice note</Button>}
      </div>
    </div>
  )
}

// Kept for backward compat — AdminStudentsCRM is the live component
function AdminStudents() { return <AdminStudentsCRM /> }

function AdminStudentsCRM() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  // Detail panel edit state
  const [detailAdmission, setDetailAdmission] = useState('')
  const [detailFee, setDetailFee] = useState('')
  const [detailNotes, setDetailNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    async function loadStudents() {
      setLoading(true)
      setLoadError('')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('created_at', { ascending: false })
      if (error) { setLoadError(error.message); setLoading(false); return }
      setStudents(data ?? [])
      setLoading(false)
    }
    loadStudents()
  }, [])

  const filtered = students.filter((s) => {
    const matchSearch = !search ||
      (s.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || (s.admission_status ?? 'prospect') === statusFilter
    return matchSearch && matchStatus
  })

  const selected = students.find((s) => s.id === selectedId)

  function openStudent(student) {
    setSelectedId(student.id)
    setDetailAdmission(student.admission_status ?? 'prospect')
    setDetailFee(student.fee_status ?? 'pending')
    setDetailNotes(student.payment_notes ?? '')
    setSaveMsg('')
  }

  async function saveAdminFields() {
    if (!selectedId) return
    setSaving(true)
    setSaveMsg('')
    const { error } = await supabase.from('profiles').update({
      admission_status: detailAdmission,
      fee_status: detailFee,
      payment_notes: detailNotes.trim() || null,
    }).eq('id', selectedId)
    if (error) { setSaveMsg(error.message); setSaving(false); return }
    setStudents((prev) => prev.map((s) => s.id === selectedId
      ? { ...s, admission_status: detailAdmission, fee_status: detailFee, payment_notes: detailNotes.trim() || null }
      : s))
    setSaveMsg('Saved.')
    setSaving(false)
  }

  function admissionBadgeClass(status) {
    if (status === 'enrolled') return 'bg-success/10 text-success border-success/20'
    if (status === 'discontinued') return 'bg-error/10 text-error border-error/20'
    return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  }

  function feeBadgeClass(status) {
    if (status === 'paid') return 'bg-success/10 text-success border-success/20'
    return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  }

  return (
    <div className="flex gap-5">
      {/* ── Left: table ── */}
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <SectionTitle title="Students" subtitle="Onboarded students and their admission status." />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">All statuses</option>
            <option value="prospect">Prospect</option>
            <option value="enrolled">Enrolled</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-ink-muted">Loading students…</div>
        ) : loadError ? (
          <div className="rounded-2xl border border-error/20 bg-surface px-5 py-8 text-center">
            <p className="font-semibold text-error">Could not load students.</p>
            <p className="mt-1 text-sm text-ink-muted">{loadError}</p>
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <Users className="mx-auto mb-3 text-ink-soft" size={32} />
            <p className="font-display text-lg font-semibold">No students yet.</p>
            <p className="mt-1 text-sm text-ink-muted">Students appear here after completing onboarding.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-semibold text-ink-muted">No results for those filters.</p>
            <button type="button" onClick={() => { setSearch(''); setStatusFilter('all') }} className="mt-2 text-sm font-semibold text-primary">Clear filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Admission</th>
                  <th className="px-4 py-3">Fee</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const admStatus = student.admission_status ?? 'prospect'
                  const feeStatus = student.fee_status ?? 'pending'
                  const isSelected = student.id === selectedId
                  return (
                    <tr
                      key={student.id}
                      onClick={() => openStudent(student)}
                      className={`cursor-pointer border-b border-border last:border-b-0 transition hover:bg-surface-warm ${isSelected ? 'bg-primary-soft/30' : ''}`}
                    >
                      <td className="px-4 py-3 font-semibold">{student.name ?? student.email?.split('@')[0] ?? '—'}</td>
                      <td className="px-4 py-3 text-ink-muted">{student.email ?? '—'}</td>
                      <td className="px-4 py-3 text-ink-muted">{student.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-ink-muted">{student.country ?? '—'}</td>
                      <td className="px-4 py-3 text-ink-muted">{student.age_group ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${admissionBadgeClass(admStatus)}`}>{admStatus}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${feeBadgeClass(feeStatus)}`}>{feeStatus}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Right: detail panel ── */}
      {selected && (
        <aside className="w-[340px] flex-shrink-0">
          <div className="sticky top-6 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border bg-surface-warm px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student profile</p>
                <h2 className="mt-1 font-display text-xl font-semibold">{selected.name ?? selected.email?.split('@')[0]}</h2>
                <p className="text-sm text-ink-muted">{selected.email}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full hover:bg-border">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Section 1 — read-only info */}
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Student info</p>
                <InfoRow label="Phone" value={selected.phone} />
                <InfoRow label="Country" value={selected.country} />
                <InfoRow label="Age group" value={selected.age_group} />
                {selected.portfolio_url && (
                  <div className="flex gap-2">
                    <span className="w-24 flex-shrink-0 text-ink-muted">Portfolio</span>
                    <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" className="truncate text-primary underline underline-offset-2">{selected.portfolio_url}</a>
                  </div>
                )}
                {selected.artist_background && (
                  <div>
                    <p className="text-ink-muted">Art background</p>
                    <p className="mt-1 rounded-lg bg-surface-warm p-2.5 text-ink leading-relaxed">{selected.artist_background}</p>
                  </div>
                )}
                {selected.why_shilpa_shastra && (
                  <div>
                    <p className="text-ink-muted">Why Shilpa Shastra</p>
                    <p className="mt-1 rounded-lg bg-surface-warm p-2.5 text-ink leading-relaxed">{selected.why_shilpa_shastra}</p>
                  </div>
                )}
              </div>

              {/* Section 2 — admin editable */}
              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Admin fields</p>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-ink-muted">Admission status</span>
                  <select value={detailAdmission} onChange={(e) => setDetailAdmission(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                    <option value="prospect">Prospect</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-ink-muted">Fee status</span>
                  <select value={detailFee} onChange={(e) => setDetailFee(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-ink-muted">Payment notes</span>
                  <textarea rows={3} value={detailNotes} onChange={(e) => setDetailNotes(e.target.value)} placeholder="Installment plan, WhatsApp confirmations, etc." className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </label>
                {saveMsg && <p className={`text-sm ${saveMsg === 'Saved.' ? 'text-success' : 'text-error'}`}>{saveMsg}</p>}
                <Button className="w-full" onClick={saveAdminFields} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className="w-24 flex-shrink-0 text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

function AdminWorkshops() {
  return (
    <ComingSoonAdminPage
      icon={CalendarDays}
      title="Workshops"
      description="Workshops will let Drdha schedule live sessions, publish replay links, and notify enrolled students. For the demo, the main working story is courses, student submissions, and reviewed feedback."
    />
  )
}

function AdminSettings() {
  const { profile } = useAuth()
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [msg, setMsg] = useState(null)

  async function clearAllData() {
    setClearing(true)
    setMsg(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMsg({ ok: false, text: 'Not signed in.' }); setClearing(false); return }
    await supabase.from('notifications').delete().eq('user_id', user.id)
    await supabase.from('submissions').delete().eq('user_id', user.id)
    await supabase.from('enrollments').delete().eq('user_id', user.id)
    await supabase.from('courses').delete().eq('instructor_id', user.id)
    setMsg({ ok: true, text: 'All data cleared. The student side is now empty.' })
    setClearing(false)
  }

  async function loadDemoData() {
    setSeeding(true)
    setMsg(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')
      const origin = window.location.origin

      // Wipe first so re-running is safe
      await supabase.from('notifications').delete().eq('user_id', user.id)
      await supabase.from('submissions').delete().eq('user_id', user.id)
      await supabase.from('enrollments').delete().eq('user_id', user.id)
      await supabase.from('courses').delete().eq('instructor_id', user.id)

      // ── Course 1: Published ────────────────────────────────────────────
      const { data: c1, error: c1err } = await supabase.from('courses').insert({
        title: 'Drawing Divine Forms — Srinivasa',
        price: 299900,
        currency: 'INR',
        duration_label: '6 sessions · ~5 hours',
        session_count: 6,
        level: 'Beginner',
        status: 'published',
        thumbnail_url: `${origin}/art/AhobhilaDarshan_Blk_18x24_Light_Fin-3.webp`,
        description: 'This course is an invitation into the ancient visual grammar of Shilpa Shastra — the sacred science of image-making practiced in South India for over a thousand years. You will learn to draw the form of Sri Srinivasa from its geometric foundations to its devotional completion. Each session builds on the last, moving from the mathematics of Talamana to the quiet attentiveness required to render a divine face with care. No prior experience with traditional art is necessary — only the willingness to sit with the work, observe carefully, and begin again.',
        instructor_id: user.id,
        certificate_enabled: true,
        who_is_this_for: 'Students who feel drawn to sacred Indian art but do not know where to begin. Those who have attempted deity drawing on their own and found it overwhelming. Practitioners of yoga or puja who wish to deepen their relationship to the deity through the discipline of form.',
        materials_needed: 'Cartridge paper or Bristol board, 2H and HB pencils, a ruler, a compass, a smooth eraser, and a sharpener. No special art supplies are needed to begin. The quality of your attention matters more than the quality of your paper.',
        access_details: 'Lifetime access. Once enrolled, the sessions are yours to return to as many times as needed. There is no expiry. Future additions to this course will also be included at no extra cost.',
      }).select().single()
      if (c1err) throw c1err

      // ── Course 2: Coming soon ──────────────────────────────────────────
      await supabase.from('courses').insert({
        title: 'Talamana — The Sacred System of Proportions',
        price: 349900,
        currency: 'INR',
        duration_label: '4 sessions · ~3.5 hours',
        session_count: 4,
        level: 'Intermediate',
        status: 'coming_soon',
        thumbnail_url: `${origin}/art/DrdhaVG_Nataraja_Pencil+on+Paper_74x55cm_2017.webp`,
        description: 'Before a single curve is drawn, a deity must be measured. Talamana — literally palm-measure — is the ancient system of divine proportions codified in the Shilpa Shastras. This course is a deep study of that system as applied to the major iconographic traditions of South India. You will learn the tala units, the body ratios that define each class of deity, and how to construct the foundational grid from which all sacred forms emerge. This is the course for practitioners who want to move from drawing by feeling to drawing by understanding.',
        instructor_id: user.id,
        certificate_enabled: true,
        who_is_this_for: 'Students who have completed Drawing Divine Forms or who already hold a working knowledge of basic deity proportions. This is not a course for absolute beginners — it assumes you can already hold a pencil with stillness.',
        materials_needed: 'The same materials as Drawing Divine Forms, with the addition of a proper drafting triangle and a set of dividers. Precision is the discipline of this course.',
        access_details: 'This course is currently in production and will open to registered students first. Lifetime access upon release.',
      })

      // ── Sessions for Course 1 ──────────────────────────────────────────
      const { data: rawSessions, error: sessErr } = await supabase.from('sessions').insert([
        {
          course_id: c1.id, position: 1, is_preview: true,
          title: 'The Living Tradition — An Introduction to Shilpa Shastra',
          description: 'We begin before the first line. This session asks what Shilpa Shastra is, why it is still alive, and what the practitioner\'s relationship to a deity form must be before any drawing begins. The ancient texts, the temple traditions, the unbroken lineage — and where you now sit within that.',
          video_url: 'https://www.youtube.com/watch?v=v9eoeYgDVQ0',
        },
        {
          course_id: c1.id, position: 2, is_preview: false,
          title: 'Talamana — Measuring the Divine Form',
          description: 'The tala is the primary unit of measure in Shilpa Shastra, derived from the hand\'s natural dimensions. In this session you will learn the foundational measurement grid and understand why divine proportions cannot be arrived at by aesthetic instinct alone — they must be constructed, line by deliberate line.',
          video_url: 'https://www.youtube.com/watch?v=X_6MtUFW8cA',
        },
        {
          course_id: c1.id, position: 3, is_preview: false,
          title: 'Beginning the Face — Oval, Axis, and Proportion',
          description: 'The face of a deity is the most demanding passage in the entire form. Here we build it from its structural bones — the oval, the central and horizontal axes, the placement of features within the grid. This session is where most students slow down. That is correct. Do not rush it.',
          video_url: null,
        },
        {
          course_id: c1.id, position: 4, is_preview: false,
          title: 'The Eyes — Where Divinity Rests',
          description: 'In Shilpa Shastra, the eyes of the deity are not drawn until the practitioner is prepared. The eyes carry the presence of the form. This session teaches the precise geometry of the eye — its length, arc, pupil position, and the subtle tilt that gives the face its quality of inner stillness.',
          video_url: null,
        },
        {
          course_id: c1.id, position: 5, is_preview: false,
          title: 'Crown and Adornments — Kireetam and Makara Kundala',
          description: 'The crown and jewellery of Srinivasa are not decorative — they are iconographic identifiers. Each ornament carries a specific meaning and occupies a defined position in the composition. This session covers the major adornments and how to render them with structural clarity without losing their intricacy.',
          video_url: null,
        },
        {
          course_id: c1.id, position: 6, is_preview: false,
          title: 'The Complete Form — Bringing Srinivasa to Life',
          description: 'The final session assembles the complete form — body, face, crown, hands, and the sacred weapons Sudarshana Chakra and Panchajanya. You will also learn how to assess your own drawing against the canonical standards and what to refine in your next pass. A completed study of Srinivasa is the submission for this session.',
          video_url: null,
        },
      ]).select()
      if (sessErr) throw sessErr

      const s = rawSessions.sort((a, b) => a.position - b.position)

      // ── Enrollment: 2 of 6 done (33%), currently on session 3 ──────────
      const { error: enrollErr } = await supabase.from('enrollments').insert({
        user_id: user.id,
        course_id: c1.id,
        progress: 33,
        last_session_id: s[2].id,
        status: 'active',
      })
      if (enrollErr) throw enrollErr

      // ── Annotation SVG ─────────────────────────────────────────────────
      const svgMark = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="27" r="17" fill="none" stroke="#ef4444" stroke-width="2.5" opacity="0.85"/><line x1="18" y1="54" x2="82" y2="54" stroke="#ef4444" stroke-width="1.8" opacity="0.7" stroke-dasharray="5 3"/><path d="M28 72 Q50 61 72 72" fill="none" stroke="#ef4444" stroke-width="2.2" opacity="0.8"/><circle cx="50" cy="27" r="3" fill="#ef4444" opacity="0.6"/></svg>'
      const annotatedUrl = `data:image/svg+xml;base64,${btoa(svgMark)}`

      // ── Submission 1: Session 1 — approved + annotated ─────────────────
      await supabase.from('submissions').insert({
        user_id: user.id,
        course_id: c1.id,
        session_id: s[0].id,
        file_url: `${origin}/art/DVGorrick_Murugan_web-1.webp`,
        status: 'approved',
        submitted_at: new Date(Date.now() - 7 * 864e5).toISOString(),
        reviewed_at: new Date(Date.now() - 6 * 864e5).toISOString(),
        reviewer_id: user.id,
        feedback_text: 'Beautiful construction lines. The oval reads with quiet confidence — notice how the central axis anchors everything. This instinct is exactly right. In the next session, carry this stillness into the proportioning of the face. Do not add more lines; learn to see the ones you already have.',
        annotated_file_url: annotatedUrl,
      })

      // ── Submission 2: Session 2 — needs resubmission ───────────────────
      await supabase.from('submissions').insert({
        user_id: user.id,
        course_id: c1.id,
        session_id: s[1].id,
        file_url: `${origin}/art/DVGorrick_Purnaghatam_web.webp`,
        status: 'needs_resubmission',
        submitted_at: new Date(Date.now() - 3 * 864e5).toISOString(),
        reviewed_at: new Date(Date.now() - 2 * 864e5).toISOString(),
        reviewer_id: user.id,
        feedback_text: 'The Talamana grid is present but the proportions need adjustment. The head unit appears compressed — the tala should sit with more vertical ease. Please revisit the 10-tala measurement from the session and resubmit. You are close.',
      })

      // ── Notifications ──────────────────────────────────────────────────
      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          type: 'feedback',
          title: 'Feedback received — Session 1',
          body: 'Drdha has reviewed your drawing of The Living Tradition and left notes.',
          read: true,
          href: `/courses/${c1.id}/lesson/${s[0].id}`,
          created_at: new Date(Date.now() - 6 * 864e5).toISOString(),
        },
        {
          user_id: user.id,
          type: 'feedback',
          title: 'Please resubmit — Session 2',
          body: 'Drdha has reviewed your Talamana study and asked for a revision. See his notes.',
          read: false,
          href: `/courses/${c1.id}/lesson/${s[1].id}`,
          created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
        },
      ])

      setMsg({ ok: true, text: 'Demo loaded. Switch to Student view to see the full journey.' })
    } catch (e) {
      setMsg({ ok: false, text: 'Error: ' + (e.message ?? String(e)) })
    }
    setSeeding(false)
  }

  return (
    <div className="space-y-6">

      {/* ── Demo controls ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Demo controls</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Load or reset the demo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          <strong>Load demo</strong> seeds two courses, six sessions, a student enrollment at 33% progress, two reviewed assignments (one approved with annotation, one needing resubmission), and two notifications. Switch to Student view after loading to experience the full journey.<br />
          <strong>Clear all</strong> wipes everything for a clean empty-state walkthrough.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={loadDemoData} disabled={seeding || clearing}>
            {seeding ? 'Loading…' : 'Load demo'}
          </Button>
          <Button variant="secondary" onClick={clearAllData} disabled={seeding || clearing}>
            {clearing ? 'Clearing…' : 'Clear all data'}
          </Button>
        </div>
        {msg && (
          <p className={`mt-4 rounded-lg border px-4 py-2.5 text-sm font-semibold ${msg.ok ? 'border-success/25 bg-success/5 text-success' : 'border-error/25 bg-error/5 text-error'}`}>
            {msg.text}
          </p>
        )}
      </section>

      {/* ── Demo guide ────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Demo guide</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">What Drdha can try today</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">The working tabs are grouped at the top of the sidebar. Future modules are separated under Coming soon so there is no confusion about what is live.</p>
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        {[
          ['1', 'Courses', 'Create a course, add sessions with video URLs, references, and resources, then publish it to the student catalog.', '/admin/courses'],
          ['2', 'Assignments', 'Open submitted student work, draw annotations directly on the drawing, record a voice note, write feedback, and save the review.', '/admin/assignments'],
          ['3', 'Students', 'See enrolled students and the progress they have made from the student side.', '/admin/students'],
        ].map(([step, title, copy, href]) => (
          <article key={title} className="rounded-2xl border border-border bg-surface p-5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary">{step}</div>
            <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{copy}</p>
            <Link to={href}><Button className="mt-5 w-full">Open {title}</Button></Link>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-border bg-surface-warm p-5">
        <h3 className="font-display text-xl font-semibold">Coming soon — intentionally not wired for this demo</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ['Cards', 'Reusable content library — videos, PDFs, prompts, and notes decoupled from courses.'],
            ['Playlists', 'Learning paths and course bundles for structured student journeys.'],
            ['Workshops', 'Live events, registration, replay hosting, and workshop notifications.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-display text-lg font-semibold">{title}</p>
              <p className="mt-1 text-sm text-ink-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AdminEditor({ title, action, children, onSubmit }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <form onSubmit={onSubmit ?? ((e) => e.preventDefault())}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <Button type="submit"><Save className="mr-2 inline" size={15} />{action}</Button>
        </div>
        <div className="space-y-4">{children}</div>
      </form>
    </section>
  )
}

function IconButton({ icon: Icon, label, onClick, type = 'button' }) {
  return <button type={type} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-warm text-ink-muted transition hover:border-primary hover:text-primary" title={label} aria-label={label}><Icon size={16} /></button>
}

function ReviewRow({ item }) {
  const studentName = typeof item.student === 'string'
    ? item.student
    : item.student?.name ?? item.student?.email?.split('@')[0] ?? 'Student'
  const assignmentTitle = item.assignment ?? item.session?.title ?? 'Course session'
  const status = item.status ?? 'awaiting_review'
  const fileUrl = item.file_url

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      {fileUrl && !isPdfSubmission(fileUrl) ? (
        <img src={fileUrl} alt={studentName} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
      ) : (
        <ArtPanel label={item.file ?? art.student} className="h-14 w-14 shrink-0 rounded-lg" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{studentName}</p>
        <p className="truncate text-sm text-ink-muted">{assignmentTitle}</p>
      </div>
      <Badge variant={getSubmissionBadgeVariant(status)}>{formatSubmissionStatus(status)}</Badge>
    </div>
  )
}

export default App

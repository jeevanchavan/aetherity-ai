import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'
import ThemeToggle from '../../../components/ui/ThemeToggle'
import AetherityLogo from '../../../components/ui/AetherityLogo'
import { setChats, setCurrentChatId } from '../chatSlice'
import { deleteChat } from '../service/chat.api'
import { setUser } from '../../auth/auth.slice'

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const PanelLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </svg>
)

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const SUGGESTIONS = [
  {
    title: 'Explain a concept',
    prompt: 'Explain machine learning in simple terms with a real-world example',
  },
  {
    title: 'Research a topic',
    prompt: 'What are the latest developments in renewable energy storage?',
  },
  {
    title: 'Summarize information',
    prompt: 'Summarize the key points of effective time management strategies',
  },
  {
    title: 'Generate ideas',
    prompt: 'Give me 5 creative project ideas for a portfolio website',
  },
]

const isUserMessage = (role) => role === 'user'

const groupChatsByDate = (chats) => {
  const sorted = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
  )

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)

  const buckets = { today: [], yesterday: [], week: [], older: [] }

  sorted.forEach((chatItem) => {
    const date = new Date(chatItem.lastUpdated)
    if (date >= todayStart) buckets.today.push(chatItem)
    else if (date >= yesterdayStart) buckets.yesterday.push(chatItem)
    else if (date >= weekStart) buckets.week.push(chatItem)
    else buckets.older.push(chatItem)
  })

  const groups = []
  if (buckets.today.length) groups.push({ label: 'Today', chats: buckets.today })
  if (buckets.yesterday.length) groups.push({ label: 'Yesterday', chats: buckets.yesterday })
  if (buckets.week.length) groups.push({ label: 'Previous 7 days', chats: buckets.week })
  if (buckets.older.length) groups.push({ label: 'Older', chats: buckets.older })
  return groups
}

const getUserInitial = (user) => {
  if (!user) return '?'
  const name = user.username || user.email || ''
  return name.charAt(0).toUpperCase()
}

const ChatListSkeleton = () => (
  <div className="space-y-3 px-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="skeleton h-9 w-full rounded-lg" />
    ))}
  </div>
)

const MessageAreaSkeleton = () => (
  <div className="mx-auto w-full max-w-[780px] space-y-10 px-4 py-8 md:px-6">
    <div className="flex justify-end">
      <div className="skeleton h-12 w-[55%] max-w-xs rounded-2xl rounded-br-md" />
    </div>
    <div className="flex gap-3">
      <div className="skeleton h-8 w-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-[92%] rounded" />
        <div className="skeleton h-4 w-[78%] rounded" />
        <div className="skeleton h-4 w-[85%] rounded" />
      </div>
    </div>
    <div className="flex justify-end">
      <div className="skeleton h-11 w-[40%] max-w-[200px] rounded-2xl rounded-br-md" />
    </div>
  </div>
)

const AiResponseSkeleton = () => (
  <div className="flex gap-3 animate-fade-in">
    <AiAvatar />
    <div className="min-w-0 flex-1 max-w-[720px] space-y-2.5 pt-0.5">
      <div className="skeleton h-3 w-16 rounded" />
      <div className="ai-message-content space-y-2.5 py-1">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-[94%] rounded" />
        <div className="skeleton h-4 w-[88%] rounded" />
        <div className="skeleton h-4 w-[72%] rounded" />
      </div>
    </div>
  </div>
)

const markdownComponents = {
  p: ({ children }) => <p className="mb-3.5 last:mb-0 leading-[1.75]">{children}</p>,
  h1: ({ children }) => <h1 className="mb-3 mt-6 text-xl font-semibold tracking-tight first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2.5 mt-5 text-lg font-semibold tracking-tight first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h3>,
  ul: ({ children }) => <ul className="mb-3.5 list-disc space-y-1.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3.5 list-decimal space-y-1.5 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-app">{children}</strong>,
  em: ({ children }) => <em className="italic text-app-secondary">{children}</em>,
  hr: () => <hr className="my-5 border-app" />,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-[3px] border-accent/50 pl-4 text-app-secondary">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline decoration-accent/40 underline-offset-[3px] transition hover:decoration-accent">
      {children}
    </a>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded-md bg-app-subtle px-1.5 py-0.5 font-mono text-[0.85em] text-accent">{children}</code>
    ) : (
      <code className="font-mono text-[0.85em]">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-app bg-app-subtle p-4 font-mono text-[0.85em] leading-relaxed shadow-app-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-app shadow-app-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-app bg-surface-hover px-3 py-2.5 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-app px-3 py-2.5">{children}</td>,
}

const AiAvatar = () => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-app-sm ring-1 ring-app">
    <img src="/aetherity-logo.svg" alt="" className="h-full w-full object-cover" aria-hidden="true" />
  </div>
)

const UserAvatar = ({ initial }) => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent ring-1 ring-accent/20">
    {initial || 'You'}
  </div>
)

const UserMessage = ({ content, userInitial }) => (
  <div className="flex justify-end animate-fade-in">
    <div className="flex max-w-[min(85%,520px)] items-end gap-2.5">
      <div className="rounded-2xl rounded-br-md bg-accent px-4 py-3 text-[15px] leading-relaxed text-white shadow-app-sm transition-shadow hover:shadow-app-md">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      <UserAvatar initial={userInitial} />
    </div>
  </div>
)

const AiMessage = ({ content, isStreaming = false }) => (
  <div className="flex animate-fade-in gap-3">
    <AiAvatar />
    <div className="min-w-0 flex-1 max-w-[720px] pt-0.5">
      <p className="mb-2 text-xs font-medium tracking-wide text-app-muted">Aetherity</p>
      <div className={`ai-message-content prose-chat text-[15px] text-app ${isStreaming ? 'stream-cursor' : ''}`}>
        {isStreaming ? (
          <p className="whitespace-pre-wrap leading-[1.75]">{content}</p>
        ) : (
          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  </div>
)

const EmptyState = ({ onSuggestionClick, disabled }) => (
  <div className="flex flex-1 flex-col items-center justify-center px-4 pb-32 animate-fade-in">
    <AetherityLogo size="lg" className="mb-8" />
    <h2 className="text-2xl font-semibold tracking-tight text-app">What can I help you with?</h2>
    <p className="mt-2.5 max-w-md text-center text-sm leading-relaxed text-app-secondary">
      Ask anything — explore ideas, research topics, or get clear answers in seconds.
    </p>
    <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {SUGGESTIONS.map(({ title, prompt }) => (
        <button
          key={title}
          type="button"
          disabled={disabled}
          onClick={() => onSuggestionClick(prompt)}
          className="suggestion-card group rounded-xl border border-app bg-surface px-4 py-4 text-left shadow-app-sm transition-all duration-200 hover:border-accent/35 hover:bg-surface-hover hover:shadow-app-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <p className="text-sm font-medium text-app transition-colors group-hover:text-accent">{title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-app-muted line-clamp-2">{prompt}</p>
        </button>
      ))}
    </div>
  </div>
)

const UserProfileSection = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const displayName = user?.username || user?.email || 'User'
  const initial = getUserInitial(user)

  return (
    <div ref={menuRef} className="relative border-t border-app p-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="profile-trigger flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-all duration-200 hover:bg-surface-hover"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white shadow-app-sm">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-app">{displayName}</p>
          <p className="truncate text-xs text-app-muted">{user?.email}</p>
        </div>
        <span className={`shrink-0 text-app-muted transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-180'}`}>
          <ChevronUpIcon />
        </span>
      </button>

      {open && (
        <div className="profile-dropdown absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-xl border border-app bg-surface py-1 shadow-app-lg animate-dropdown-in">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-app-secondary transition-colors hover:bg-surface-hover hover:text-app"
          >
            <LogOutIcon />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

const SidebarContent = ({ chats, currentChatId, openChat, onDeleteChat, isLoading }) => {
  const groups = useMemo(() => groupChatsByDate(chats), [chats])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-3">
        {isLoading && Object.keys(chats).length === 0 ? (
          <ChatListSkeleton />
        ) : groups.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-app-sm ring-1 ring-app">
              <img src="/aetherity-logo.svg" alt="" className="h-full w-full object-cover" aria-hidden="true" />
            </div>
            <p className="text-sm text-app-muted">No conversations yet</p>
            <p className="mt-1 text-xs text-app-muted">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.chats.map((chatItem) => {
                    const isActive = currentChatId === chatItem.id
                    return (
                      <div
                        key={chatItem.id}
                        className={`group relative flex w-full items-center rounded-lg transition-all duration-150 ${
                          isActive
                            ? 'bg-accent-light shadow-app-sm'
                            : 'hover:bg-surface-hover'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent transition-all duration-150" />
                        )}
                        <button
                          onClick={() => { openChat(chatItem.id) }}
                          type="button"
                          className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                            isActive
                              ? 'font-medium text-accent'
                              : 'text-app-secondary group-hover:text-app'
                          }`}
                        >
                          <span className={`truncate ${isActive ? 'text-accent' : ''}`}>
                            {chatItem.title}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(event) => onDeleteChat(event, chatItem.id)}
                          aria-label={`Delete ${chatItem.title}`}
                          className="chat-delete-btn mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-app-muted opacity-100 transition-all duration-150 hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [streamPhase, setStreamPhase] = useState('idle')
  const [optimisticUser, setOptimisticUser] = useState(null)
  const [streamText, setStreamText] = useState('')
  const [targetStreamText, setTargetStreamText] = useState('')

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const user = useSelector((state) => state.auth.user)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const preSendCountRef = useRef(0)
  const typewriterRef = useRef(null)

  const userInitial = getUserInitial(user)
  const currentMessages = chats[currentChatId]?.messages ?? []
  const isGenerating = streamPhase === 'waiting' || streamPhase === 'typing'
  const showEmptyState = !loadingMessages && currentMessages.length === 0 && !optimisticUser && streamPhase === 'idle'

  const displayMessages = useMemo(() => {
    if (streamPhase !== 'typing' || currentMessages.length === 0) return currentMessages
    const last = currentMessages[currentMessages.length - 1]
    if (!isUserMessage(last.role)) {
      return currentMessages.slice(0, -1)
    }
    return currentMessages
  }, [currentMessages, streamPhase])

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  useEffect(() => {
    if (streamPhase !== 'waiting') return undefined

    const timeout = setTimeout(() => {
      setStreamPhase('idle')
      setOptimisticUser(null)
      setStreamText('')
      setTargetStreamText('')
    }, 60000)

    return () => clearTimeout(timeout)
  }, [streamPhase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, streamPhase, streamText, optimisticUser, loadingMessages])

  useEffect(() => {
    if (streamPhase !== 'waiting') return

    const chatMessages = chats[currentChatId]?.messages ?? []
    if (chatMessages.length <= preSendCountRef.current) return

    const lastAi = [...chatMessages].reverse().find((msg) => !isUserMessage(msg.role))
    if (lastAi?.content) {
      setTargetStreamText(lastAi.content)
      setStreamText('')
      setStreamPhase('typing')
    }
  }, [chats, currentChatId, streamPhase, currentMessages])

  useEffect(() => {
    if (streamPhase !== 'typing' || !targetStreamText) return

    if (typewriterRef.current) clearInterval(typewriterRef.current)

    typewriterRef.current = setInterval(() => {
      setStreamText((prev) => {
        const step = targetStreamText.length > 400 ? 4 : targetStreamText.length > 150 ? 3 : 2
        const nextLen = Math.min(prev.length + step, targetStreamText.length)
        const next = targetStreamText.slice(0, nextLen)

        if (nextLen >= targetStreamText.length) {
          clearInterval(typewriterRef.current)
          typewriterRef.current = null
          setTimeout(() => {
            setStreamPhase('idle')
            setOptimisticUser(null)
            setStreamText('')
            setTargetStreamText('')
          }, 120)
        }

        return next
      })
    }, 18)

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current)
    }
  }, [streamPhase, targetStreamText])

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const sendMessage = (message) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isGenerating) return

    preSendCountRef.current = currentMessages.length
    setOptimisticUser(trimmedMessage)
    setStreamPhase('waiting')
    setStreamText('')
    setTargetStreamText('')

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
  }

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    sendMessage(chatInput)
    setChatInput('')
    resetTextareaHeight()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmitMessage(event)
    }
  }

  const handleInputChange = (event) => {
    setChatInput(event.target.value)
    const textarea = event.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }

  const openChat = (chatId) => {
    const needsLoad = chats[chatId]?.messages.length === 0
    if (needsLoad) setLoadingMessages(true)

    chat.handleOpenChat(chatId, chats).finally(() => setLoadingMessages(false))
    setMobileSidebarOpen(false)
  }

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null))
    setMobileSidebarOpen(false)
  }

  const handleDeleteChat = async (event, chatId) => {
    event.stopPropagation()
    try {
      await deleteChat(chatId)
      const updatedChats = { ...chats }
      delete updatedChats[chatId]
      dispatch(setChats(updatedChats))
      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    dispatch(setUser(null))
    navigate('/login')
  }

  const handleSuggestionClick = (prompt) => {
    setChatInput(prompt)
    textareaRef.current?.focus()
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  return (
    <main className="flex h-[100dvh] w-full overflow-hidden bg-app text-app">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-app bg-surface transition-transform duration-300 ease-out md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-app-lg' : '-translate-x-full'
        } ${sidebarOpen ? 'md:flex' : 'md:hidden'}`}
      >
        <div className="px-4 py-4">
          <AetherityLogo />
        </div>

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="new-chat-btn flex w-full items-center justify-center gap-2 rounded-xl border border-app bg-surface px-4 py-2.5 text-sm font-medium text-app shadow-app-sm transition-all duration-200 hover:border-accent/40 hover:bg-surface-hover hover:shadow-app-md active:scale-[0.98]"
          >
            <PlusIcon />
            New Chat
          </button>
        </div>

        <SidebarContent
          chats={chats}
          currentChatId={currentChatId}
          openChat={openChat}
          onDeleteChat={handleDeleteChat}
          isLoading={isLoading}
        />

        <UserProfileSection user={user} onLogout={handleLogout} />
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-3 py-3 md:px-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="btn-ghost rounded-lg bg-surface/80 shadow-app-sm backdrop-blur-md md:hidden"
              aria-label="Open sidebar"
            >
              <MenuIcon />
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="btn-ghost hidden rounded-lg bg-surface/80 shadow-app-sm backdrop-blur-md md:inline-flex"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <PanelLeftIcon />
            </button>
          </div>
          <ThemeToggle className="rounded-lg bg-surface/80 shadow-app-sm backdrop-blur-md" />
        </header>

        <div className="messages flex flex-1 flex-col overflow-y-auto scrollbar-thin pt-14">
          {loadingMessages ? (
            <MessageAreaSkeleton />
          ) : showEmptyState ? (
            <EmptyState
              disabled={isGenerating}
              onSuggestionClick={handleSuggestionClick}
            />
          ) : (
            <div className="mx-auto w-full max-w-[780px] space-y-10 px-4 py-6 pb-44 md:px-6">
              {displayMessages.map((message, index) =>
                isUserMessage(message.role) ? (
                  <UserMessage key={index} content={message.content} userInitial={userInitial} />
                ) : (
                  <AiMessage key={index} content={message.content} />
                )
              )}

              {streamPhase === 'waiting' && optimisticUser && (
                <UserMessage content={optimisticUser} userInitial={userInitial} />
              )}

              {streamPhase === 'waiting' && <AiResponseSkeleton />}

              {streamPhase === 'typing' && streamText && (
                <AiMessage content={streamText} isStreaming />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-input-footer pointer-events-none absolute inset-x-0 bottom-0 border-t border-app bg-app/95 px-3 pb-3 pt-4 backdrop-blur-md md:px-6 md:pb-5 md:pt-5">
          <form
            onSubmit={handleSubmitMessage}
            className="chat-composer pointer-events-auto mx-auto flex max-w-[780px] items-end gap-2 rounded-2xl p-2 md:gap-3 md:p-2.5"
          >
            <textarea
              ref={textareaRef}
              value={chatInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? 'Waiting for response…' : 'Ask anything…'}
              rows={1}
              disabled={isGenerating}
              className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-app outline-none placeholder:text-app-muted transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isGenerating}
              className="send-btn mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent p-0 text-white shadow-app-sm transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:shadow-app-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none md:h-11 md:w-11"
              aria-label="Send message"
            >
              {isGenerating ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <SendIcon />
              )}
            </button>
          </form>
          <p className="pointer-events-none mx-auto mt-2 max-w-[780px] text-center text-[11px] text-app-muted">
            Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>
    </main>
  )
}

export default Dashboard

'use client';

/**
 * NetVerge floating chatbot.
 * - Answers ONLY from the Company Profile PDF (via the backend /api/chatbot endpoints).
 * - Opens with ready-made question chips; tapping a chip returns the matching PDF answer.
 * - Fully responsive: floating window on desktop/tablet, full-screen sheet on phones
 *   (portrait AND landscape), keyboard-aware, safe-area aware, touch friendly.
 * Mounted once in app/(site)/layout.tsx.
 */
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, AppWindow, BadgeCheck, Bot, Building2, Check, Cloud, Copy, Cpu, Factory, FileText, Handshake,
  Info, Layers, MessageCircle, Minus, Network, PhoneCall, RefreshCw, RotateCcw, Send, Server, ShieldCheck,
  Sparkles, UserRound, Workflow, X,
} from 'lucide-react';
import { API } from '@/lib/api';
import s from './ChatWidget.module.css';

// ───────────────────────── types ─────────────────────────
interface Suggestion { id: string; label: string; icon?: string }
interface Msg {
  id: string;
  role: 'user' | 'bot';
  text: string;
  ts: number;
  suggestions?: Suggestion[];
  source?: { document: string; page: number } | null;
  error?: boolean;
  retry?: Payload;
  animate?: boolean;
}
type Payload = { question?: string; entryId?: string; label: string };
interface InitData { greeting: string; suggestions: Suggestion[]; source: string }

const STORE_KEY = 'nv_chat_v1';
const TIP_KEY = 'nv_chat_tip_v1';
const MAX_LEN = 500;
const TIMEOUT_MS = 15000;

/** Phones (portrait) + short landscape screens (phones turned sideways) => full-screen sheet.
 *  MUST stay in sync with the media query in ChatWidget.module.css */
const MOBILE_QUERY = '(max-width: 520px), (max-height: 500px) and (orientation: landscape)';

const ICONS: Record<string, ReactNode> = {
  building: <Building2 size={14} />, sparkles: <Sparkles size={14} />, badge: <BadgeCheck size={14} />, factory: <Factory size={14} />,
  layers: <Layers size={14} />, network: <Network size={14} />, shield: <ShieldCheck size={14} />, cloud: <Cloud size={14} />,
  cpu: <Cpu size={14} />, app: <AppWindow size={14} />, server: <Server size={14} />, workflow: <Workflow size={14} />,
  handshake: <Handshake size={14} />, user: <UserRound size={14} />, phone: <PhoneCall size={14} />, info: <Info size={14} />,
};
const iconFor = (k?: string) => (k && ICONS[k]) || <MessageCircle size={14} />;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const fmtTime = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => typeof window !== 'undefined' && !!window.matchMedia?.(MOBILE_QUERY).matches;

/** Reactive version – updates on rotate / resize / split-screen. */
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const upd = () => setM(mq.matches);
    upd();
    if (mq.addEventListener) mq.addEventListener('change', upd);
    else mq.addListener(upd); // Safari < 14
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', upd);
      else mq.removeListener(upd);
    };
  }, []);
  return m;
}

// ───────────────────────── rich text (safe: no dangerouslySetInnerHTML) ─────────────────────────
const INLINE_RE = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]*[\w/]|www\.[\w.-]*\w|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\+\d{2}\s?\d{10})/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_RE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
    if (/^www\./.test(part)) return <a key={i} href={`https://${part}`} target="_blank" rel="noopener noreferrer">{part}</a>;
    if (/^[\w.+-]+@/.test(part)) return <a key={i} href={`mailto:${part}`}>{part}</a>;
    if (/^\+\d{2}\s?\d{10}$/.test(part)) return <a key={i} href={`tel:${part.replace(/\s/g, '')}`}>{part}</a>;
    return <span key={i}>{part}</span>;
  });
}

function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;
  const flush = () => {
    if (list.length) {
      blocks.push(<ul key={key++}>{list.map((li, i) => <li key={i}>{renderInline(li)}</li>)}</ul>);
      list = [];
    }
  };
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    if (t.startsWith('• ') || t.startsWith('- ')) {
      const body = t.slice(2);
      const items = body.split(/\s•\s/);
      if (items.length > 1) {            // "• A • B • C"  -> pills
        flush();
        blocks.push(<div className={s.pills} key={key++}>{items.map((it, i) => <span className={s.pill} key={i}>{it}</span>)}</div>);
      } else list.push(body);
    } else { flush(); blocks.push(<p key={key++}>{renderInline(t)}</p>); }
  }
  flush();
  return <div className={s.rich}>{blocks}</div>;
}

/** Reveals text progressively (typewriter). Closes unfinished **bold** so no stray asterisks show. */
function TypedRich({ text, animate, onTick, onDone }: { text: string; animate: boolean; onTick: () => void; onDone: () => void }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  const doneRef = useRef(!animate);
  const cbs = useRef({ onTick, onDone });
  cbs.current = { onTick, onDone };

  useEffect(() => {
    if (!animate) return;
    const step = Math.max(2, Math.ceil(text.length / 70));
    const id = window.setInterval(() => {
      setN((cur) => {
        const next = Math.min(text.length, cur + step);
        if (next >= text.length) {
          window.clearInterval(id);
          if (!doneRef.current) { doneRef.current = true; setTimeout(() => cbs.current.onDone(), 0); }
        }
        return next;
      });
      cbs.current.onTick();
    }, 18);
    return () => window.clearInterval(id);
  }, [animate, text]);

  let shown = text.slice(0, n);
  if ((shown.match(/\*\*/g) || []).length % 2 === 1) shown += '**';
  const typing = n < text.length;
  return (
    <span onClick={() => typing && setN(text.length)} style={{ display: 'block' }}>
      <RichText text={shown} />
      {typing && <i className={s.caret} aria-hidden />}
    </span>
  );
}

function BotRow({ m, isLast, busy, onPick, onRetry, onTick }: {
  m: Msg; isLast: boolean; busy: boolean; onPick: (x: Suggestion) => void; onRetry: (p: Payload) => void; onTick: () => void;
}) {
  const [done, setDone] = useState(!m.animate);
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (done) onTick(); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.text.replace(/\*\*/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked – ignore */ }
  };

  return (
    <div className={s.row}>
      <div className={s.miniAvatar} aria-hidden><Bot size={15} /></div>
      <div className={s.col}>
        <div className={`${s.bubble} ${m.error ? s.bubbleError : ''}`}>
          {m.error ? (
            <>
              <div className={s.errHead}><AlertTriangle size={15} /> Something went wrong</div>
              <span>{m.text}</span>
              {m.retry && isLast && (
                <div><button className={s.retry} onClick={() => onRetry(m.retry!)} disabled={busy}><RefreshCw size={13} /> Try again</button></div>
              )}
            </>
          ) : (
            <TypedRich text={m.text} animate={!!m.animate} onTick={onTick} onDone={() => setDone(true)} />
          )}
        </div>
        {done && !m.error && (m.source || m.text.length > 0) && (
          <div className={s.meta}>
            <span>{fmtTime(m.ts)}</span>
            {m.source && <span className={s.source}><FileText size={11} /> {m.source.document} · p.{m.source.page}</span>}
            <button className={s.copyBtn} onClick={copy} aria-label="Copy answer">{copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}</button>
          </div>
        )}
        {done && isLast && !!m.suggestions?.length && (
          <div className={s.chips} role="group" aria-label="Suggested questions">
            {m.suggestions.map((sg, i) => (
              <button key={sg.id} className={s.chip} style={{ animationDelay: `${i * 70}ms` }} disabled={busy} onClick={() => onPick(sg)}>
                {iconFor(sg.icon)}<span>{sg.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── network helper ─────────────────────────
async function api<T = any>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(API + path, { ...init, signal: ctrl.signal, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' });
    let data: any = null;
    try { data = await res.json(); } catch { /* non-JSON body */ }
    if (!res.ok) {
      const raw = data?.message;
      const msg = Array.isArray(raw) ? raw.join(' ') : raw;
      const fallback =
        res.status === 429 ? "You're sending messages too quickly. Please wait a moment." :
        res.status >= 500 ? 'Our server had a problem. Please try again in a moment.' :
        'Sorry, I could not process that. Please try again.';
      throw Object.assign(new Error(msg || fallback), { status: res.status });
    }
    if (!data) throw Object.assign(new Error('Received an unexpected response from the server.'), { status: 502 });
    return data as T;
  } catch (e: any) {
    if (e?.name === 'AbortError') throw Object.assign(new Error('The server took too long to respond. Please try again.'), { status: 408 });
    if (e?.status) throw e;
    throw Object.assign(new Error("I can't reach the server right now. Please check your internet connection and try again."), { status: 0 });
  } finally {
    clearTimeout(timer);
  }
}

// ───────────────────────── main component ─────────────────────────
export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [init, setInit] = useState<InitData | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(true);
  const [tip, setTip] = useState(false);
  const [vv, setVv] = useState<{ h: number; top: number } | null>(null);
  const mobile = useIsMobile();

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);
  const lastBot = useMemo(() => [...msgs].reverse().find((m) => m.role === 'bot')?.id, [msgs]);

  // ── restore previous session
  useEffect(() => {
    setMounted(true);
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.msgs) && saved.msgs.length) {
          setMsgs(saved.msgs.map((m: Msg) => ({ ...m, animate: false })));
          startedRef.current = true;
        }
        if (saved.init) setInit(saved.init);
      }
      if (!sessionStorage.getItem(TIP_KEY)) {
        const t = window.setTimeout(() => setTip(true), 4000);
        return () => window.clearTimeout(t);
      }
    } catch { /* storage unavailable (private mode) */ }
  }, []);

  // ── persist
  useEffect(() => {
    if (!mounted) return;
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ msgs: msgs.slice(-40), init })); } catch { /* ignore */ }
  }, [msgs, init, mounted]);

  // ── online / offline
  useEffect(() => {
    setOnline(typeof navigator === 'undefined' ? true : navigator.onLine);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const scrollDown = useCallback((smooth = false) => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth && !prefersReduced() ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => { requestAnimationFrame(() => scrollDown(true)); }, [msgs.length, typing, scrollDown]);

  const pushBot = useCallback((m: Partial<Msg> & { text: string }) => {
    setMsgs((prev) => [...prev, { id: uid(), role: 'bot', ts: Date.now(), animate: !prefersReduced(), ...m }]);
  }, []);

  // ── greeting (first open)
  const start = useCallback(async () => {
    setTyping(true);
    try {
      const [data] = await Promise.all([api<any>('/chatbot/init'), sleep(550)]);
      const d: InitData = { greeting: data.greeting, suggestions: data.suggestions || [], source: data.bot?.source || '' };
      setInit(d);
      setTyping(false);
      pushBot({ text: d.greeting, suggestions: d.suggestions });
    } catch (e: any) {
      setTyping(false);
      startedRef.current = false;
      pushBot({ text: e?.message || 'Chat is unavailable right now.', error: true, animate: false, retry: { label: '', question: '__init__' } });
    }
  }, [pushBot]);

  // ── open / close
  const openChat = useCallback(() => {
    setTip(false);
    try { sessionStorage.setItem(TIP_KEY, '1'); } catch { /* ignore */ }
    setClosing(false);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!startedRef.current) { startedRef.current = true; start(); }
    if (!isMobile()) window.setTimeout(() => inputRef.current?.focus(), 450);
    window.setTimeout(() => scrollDown(false), 60);
  }, [open, start, scrollDown]);

  // Esc closes; lock page scroll behind the full-screen sheet on phones
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeChat(); };
    window.addEventListener('keydown', onKey);
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    if (mobile) { document.body.style.overflow = 'hidden'; html.style.overflow = 'hidden'; }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [open, mobile, closeChat]);

  // Keep the whole sheet inside the *visible* area (above the on-screen keyboard, iOS/Android)
  useEffect(() => {
    if (!open || !mobile || !window.visualViewport) { setVv(null); return; }
    const vp = window.visualViewport;
    const upd = () => {
      setVv({ h: Math.round(vp.height), top: Math.round(vp.offsetTop) });
      requestAnimationFrame(() => scrollDown(false));
    };
    upd();
    vp.addEventListener('resize', upd); vp.addEventListener('scroll', upd);
    return () => { vp.removeEventListener('resize', upd); vp.removeEventListener('scroll', upd); setVv(null); };
  }, [open, mobile, scrollDown]);

  // ── sending
  const send = useCallback(async (p: Payload, opts?: { silent?: boolean }) => {
    if (busy) return;
    if (p.question === '__init__') { setMsgs((prev) => prev.filter((m) => !m.error)); startedRef.current = true; start(); return; }
    setBusy(true);
    if (!opts?.silent) setMsgs((prev) => [...prev.filter((m) => !(m.error && m.retry)), { id: uid(), role: 'user', text: p.label, ts: Date.now() }]);
    else setMsgs((prev) => prev.filter((m) => !(m.error && m.retry)));
    setTyping(true);
    try {
      const body = p.entryId ? { entryId: p.entryId } : { question: p.question };
      const [data] = await Promise.all([api<any>('/chatbot/ask', { method: 'POST', body: JSON.stringify(body) }), sleep(500)]);
      setTyping(false);
      pushBot({ text: String(data.answer || ''), suggestions: data.suggestions || [], source: data.source || null });
    } catch (e: any) {
      setTyping(false);
      pushBot({ text: e?.message || 'Something went wrong.', error: true, animate: false, retry: e?.status === 429 || e?.status === 400 ? undefined : p });
    } finally {
      setBusy(false);
      if (!isMobile()) inputRef.current?.focus();
    }
  }, [busy, pushBot, start]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    send({ question: q.slice(0, MAX_LEN), label: q });
  };
  const pick = (sg: Suggestion) => send({ entryId: sg.id, label: sg.label });

  const reset = () => {
    if (busy) return;
    setMsgs([]); setInput(''); startedRef.current = true;
    try { sessionStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    start();
  };

  if (!mounted) return null;

  const panelStyle = vv ? { height: vv.h, top: vv.top, bottom: 'auto' as const } : undefined;
  const topics = init?.suggestions || [];
  // keyboard is up => hide the quick-topic strip + footer note so the chat keeps room to breathe
  const kbOpen = !!vv && typeof window !== 'undefined' && vv.h < window.innerHeight - 120;

  return (
    <div className={`${s.root} ${open ? s.isOpen : ''}`}>
      {/* Greeting tooltip */}
      {tip && !open && (
        <div className={s.tip} role="status" onClick={openChat}>
          Hi! 👋 Have a question? <b>Ask NetVerge Assistant</b>
          <button className={s.tipClose} aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setTip(false); try { sessionStorage.setItem(TIP_KEY, '1'); } catch { /* ignore */ } }}><X size={14} /></button>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <section className={`${s.panel} ${closing ? s.panelClosing : ''}`} style={panelStyle} role="dialog" aria-label="NetVerge chat assistant" aria-modal={mobile}>
          <header className={s.header}>
            <div className={s.avatar}><Bot size={22} /><span className={`${s.status} ${online ? '' : s.statusOff}`} /></div>
            <div className={s.headText}>
              <h2 className={s.title}>NetVerge Assistant</h2>
              <p className={s.subtitle}>{online ? (mobile ? 'Online · Company Profile 2026' : 'Online · Answers from Company Profile 2026') : 'You are offline'}</p>
            </div>
            <div className={s.headBtns}>
              <button className={`${s.iconBtn} ${s.spin}`} onClick={reset} aria-label="Restart conversation" title="Restart conversation"><RotateCcw size={18} /></button>
              {!mobile && <button className={s.iconBtn} onClick={closeChat} aria-label="Minimize chat" title="Minimize"><Minus size={19} /></button>}
              <button className={s.iconBtn} onClick={closeChat} aria-label="Close chat" title="Close"><X size={20} /></button>
            </div>
          </header>

          {!online && <div className={s.banner} role="alert">No internet connection. Reconnect to keep chatting.</div>}

          <div className={s.body} ref={bodyRef} role="log" aria-live="polite" aria-relevant="additions">
            {msgs.map((m) =>
              m.role === 'user' ? (
                <div className={`${s.row} ${s.rowUser}`} key={m.id}>
                  <div className={`${s.col} ${s.colUser}`}>
                    <div className={`${s.bubble} ${s.bubbleUser}`}>{m.text}</div>
                    <div className={s.meta}><span>{fmtTime(m.ts)}</span></div>
                  </div>
                </div>
              ) : (
                <BotRow key={m.id} m={m} isLast={m.id === lastBot} busy={busy} onPick={pick} onRetry={(p) => send(p, { silent: true })} onTick={() => scrollDown(false)} />
              ),
            )}
            {typing && (
              <div className={s.row} aria-label="Assistant is typing">
                <div className={s.miniAvatar} aria-hidden><Bot size={15} /></div>
                <div className={s.col}><div className={s.bubble}><span className={s.typing}><span /><span /><span /></span></div></div>
              </div>
            )}
          </div>

          {topics.length > 0 && !kbOpen && (
            <div className={s.strip}>
              <div className={s.stripInner} role="group" aria-label="Quick topics">
                {topics.map((t) => <button key={t.id} className={s.stripChip} disabled={busy} onClick={() => pick(t)}>{t.label}</button>)}
              </div>
            </div>
          )}

          <div className={s.footer}>
            <form className={s.form} onSubmit={onSubmit}>
              <input
                ref={inputRef}
                className={s.input}
                value={input}
                maxLength={MAX_LEN}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => { if (isMobile()) window.setTimeout(() => scrollDown(false), 300); }}
                placeholder="Type your question…"
                aria-label="Type your question"
                autoComplete="off"
                autoCorrect="off"
                enterKeyHint="send"
              />
              {input.length > 400 && <span className={`${s.count} ${input.length >= MAX_LEN ? s.countWarn : ''}`}>{input.length}/{MAX_LEN}</span>}
              <button className={s.send} type="submit" disabled={!input.trim() || busy} aria-label="Send message"><Send size={18} /></button>
            </form>
            {!kbOpen && <p className={s.note}>Answers are based on the <b>NetVerge Company Profile 2026</b></p>}
          </div>
        </section>
      )}

      {/* Floating launcher */}
      {/* On phones the chat is a full-screen sheet with its own X in the header,
          so the launcher is removed entirely while the chat is open (it used to sit on top of Send). */}
      {!(open && mobile) && (
        <button
          className={s.launcher}
          onClick={() => (open ? closeChat() : openChat())}
          aria-label={open ? 'Close chat' : 'Open chat'}
          aria-expanded={open}
        >
          <MessageCircle className={`${s.launcherIcon} ${s.iconChat}`} size={27} />
          <X className={`${s.launcherIcon} ${s.iconClose}`} size={27} />
          {!open && <span className={s.badge} />}
        </button>
      )}
    </div>
  );
}
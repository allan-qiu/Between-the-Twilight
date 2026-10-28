import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, Menu, X, Sunset, Maximize, RotateCcw, Check, Copy, Download } from 'lucide-react';
import frames from './frames.json';
import { articles, paletteNames, paletteNotes } from './data';
import './style.css';
const videoSrc = '/media/sunset.mp4';
const nav = [['/', '首页'], ['/cinema', '日落放映室'], ['/palette', '暮色色谱'], ['/journal', '暮色手记'], ['/letters', '写给黄昏'], ['/about', '关于']];
const stamp = (n: number) => `00:${Math.floor(n).toString().padStart(2, '0')}`;
const serif = '"Noto Serif SC", "Songti SC", "SimSun", serif';
function Brand() { return <Link className="brand" to="/" aria-label="暮色之间 DUSK 首页"><Sunset size={31} strokeWidth={1.25}/><span>暮色之间<small>DUSK</small></span></Link>; }
function App() { const loc = useLocation(); const [menu, setMenu] = useState(false); useEffect(() => { setMenu(false); window.scrollTo(0, 0); const title = articles.find(a => loc.pathname === `/journal/${a.slug}`)?.title || nav.find(([path]) => path !== '/' && loc.pathname.startsWith(path))?.[1] || '把今天，慢慢交给晚霞。'; document.title = `${title} · 暮色之间 DUSK`; document.getElementById('main')?.focus({ preventScroll: true }); }, [loc.pathname]); return <><a className="skip" href="#main">跳至主要内容</a><header onKeyDown={e => { if (e.key === 'Escape') {
    setMenu(false);
    document.querySelector<HTMLButtonElement>('.menu-button')?.focus();
} }} className={loc.pathname === '/' ? 'site-header over-hero' : 'site-header'}><Brand /><nav aria-label="主导航" className={menu ? 'open' : ''}>{nav.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav><span className="header-note">日落之后，生活之前</span><button className="menu-button icon-button" aria-label={menu ? '关闭菜单' : '打开菜单'} aria-expanded={menu} onClick={() => { setMenu(!menu); if (!menu)
    requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>('nav a')?.focus()); }}>{menu ? <X /> : <Menu />}</button></header><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />}/><Route path="/cinema" element={<Cinema />}/><Route path="/palette" element={<Palette />}/><Route path="/journal" element={<Journal />}/><Route path="/journal/:slug" element={<Article />}/><Route path="/letters" element={<Letters />}/><Route path="/about" element={<About />}/><Route path="*" element={<section className="page narrow"><h1>这一页，暂时没有暮色。</h1><Link className="button" to="/">回到首页</Link></section>}/></Routes></main><Footer /></>; }
function Footer() { return <footer><Brand /><p>在日落与夜色之间，留一点时间给自己。</p><span>© {new Date().getFullYear()} 暮色之间 <span className="dusk">DUSK</span></span><Link to="/about">关于暮色 <ArrowUpRight size={14}/></Link></footer>; }
function Btn({ to, children, secondary = false }: {
    to: string;
    children: React.ReactNode;
    secondary?: boolean;
}) { return <Link to={to} className={`button ${secondary ? 'secondary' : ''}`}>{children}<ArrowUpRight size={17}/></Link>; }
function Home() {
    const video = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [error, setError] = useState(false);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playIntent = useRef(!reduce);
    async function toggle() { if (!video.current)
        return; try {
        if (error) {
            setError(false);
            video.current.load();
        }
        if (video.current.paused) {
            playIntent.current = true;
            if (video.current.currentTime < 1)
                video.current.currentTime = 3;
            await video.current.play();
        }
        else {
            playIntent.current = false;
            video.current.pause();
        }
    }
    catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setError(true); setPlaying(false);
    } }
    return <><section className="hero"><img className="hero-poster" src={frames[0].image} alt="橘红色落日悬在海湾上，近处水面映着暖金色的光" fetchPriority="high"/><video ref={video} className={ready ? 'hero-video ready' : 'hero-video'} src={videoSrc} poster={frames[0].image} onEnded={() => { setReady(false); if (video.current)
        video.current.currentTime = 3; }} muted={muted} playsInline preload={reduce ? 'none' : 'auto'} onLoadedMetadata={() => { if (video.current)
        video.current.currentTime = 3; }} onSeeked={() => { if (playIntent.current)
        video.current?.play().catch(() => { }); }} onPlaying={() => { setReady(true); setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => { setError(true); setReady(false); setPlaying(false); }}/><div className="hero-shade"/><div className="hero-content"><p className="hero-kicker"><span /> 一个收藏黄昏的地方</p><h1>把今天，<br />慢慢交给晚霞。</h1><p className="hero-subtitle">在日落与夜色之间，<br className="mobile-break"/>给自己一点不必赶路的时间。</p><div className="actions"><Btn to="/cinema">看一场日落</Btn><Link className="quiet-link" to="/journal">翻阅暮色手记 <ArrowUpRight size={17}/></Link></div></div><div className="hero-bottom"><span className="hero-caption">落日、海湾，和正在慢下来的世界。</span><a href="#discover" className="scroll-cue">慢慢往下看 <span>↓</span></a><div className="video-tools"><button onClick={toggle} aria-label={error ? '重试背景视频' : playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={15}/> : <Play size={15}/>}<span>{error ? '重试' : playing ? '暂停画面' : '播放画面'}</span></button><span className="tool-divider"/><button onClick={() => setMuted(!muted)} aria-label={muted ? '开启背景声音' : '关闭背景声音'}>{muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}<span>{muted ? '声音已关' : '声音已开'}</span></button></div></div></section>
    <section id="discover" className="intro wrap"><p className="section-caption">留在暮色里</p><div><h2>一天很长，<br />黄昏可以慢一点。</h2><p>这里没有需要追赶的进度。只有一段日落、几种颜色，<br className="desktop-break"/>和一些写给平常日子的文字。<br />你可以看一会儿，也可以留下一点今天的心情。</p></div><Sunset className="intro-sun" size={105} strokeWidth={.55}/></section>
    <section className="cinema-preview wrap"><div className="section-heading"><div><p className="section-caption">日落放映室</p><h2>给自己 21 秒，<br />只看一场日落。</h2></div><Link className="text-link" to="/cinema">进入放映室 <ArrowUpRight size={18}/></Link></div><Link className="film-image" to="/cinema"><img src={frames[1].image} alt="落日与城市剪影，水面留着一片金色倒影" loading="lazy"/><span className="play-circle"><Play fill="currentColor" size={22}/></span><span className="film-label">《黄昏的 21 秒》 <small>00:21</small></span></Link></section>
    <section className="palette-preview wrap"><img src={frames[2].image} alt="黄昏里呈暖金与灰褐色的水面" loading="lazy"/><div><p className="section-caption">暮色色谱</p><h2>有些颜色，<br />只在黄昏出现。</h2><p>从一帧暮色里，收藏今天的橘红、暖金与深灰。</p><div className="mini-swatches">{frames[0].colors.map(c => <span key={c} style={{ background: c }}/>)}</div><Link className="text-link" to="/palette">探索日落的颜色 <ArrowUpRight size={18}/></Link></div></section>
    <section className="wrap journal-preview"><div className="section-heading"><div><p className="section-caption">暮色手记</p><h2>把日子，读得慢一点。</h2></div><Link className="text-link" to="/journal">翻阅全部手记 <ArrowUpRight size={18}/></Link></div><div className="article-grid">{articles.map((a, i) => <ArticleCard key={a.slug} index={i}/>)}</div></section><LetterInvitation /></>;
}
function ArticleCard({ index }: {
    index: number;
}) { const a = articles[index]; return <Link to={`/journal/${a.slug}`} className="article-card"><div className="article-cover"><img src={frames[a.image].image} alt={`${a.title}：海湾日落画面`} loading="lazy"/><ArrowUpRight /></div><p className="article-meta">{a.tag}<span>约 3 分钟阅读</span></p><h3>{a.title}</h3><p>{a.summary}</p></Link>; }
function LetterInvitation() { return <section className="letter-invitation"><Sunset size={37} strokeWidth={1}/><p>有些话，适合说给黄昏听。</p><span>可以是一件小事，也可以只是一句：今天辛苦了。</span><Btn to="/letters" secondary>写下今天的心情</Btn></section>; }
function Cinema() {
    const v = useRef<HTMLVideoElement>(null);
    const area = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [playing, setPlaying] = useState(false), [muted, setMuted] = useState(true), [loop, setLoop] = useState(false), [quiet, setQuiet] = useState(false), [visible, setVisible] = useState(true), [error, setError] = useState(false), [busy, setBusy] = useState(false), [time, setTime] = useState(0), [duration, setDuration] = useState(21), [note, setNote] = useState('');
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => { if (!quiet)
        return; const surroundings = document.querySelectorAll<HTMLElement>('header.site-header,footer'); surroundings.forEach(el => el.inert = true); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { surroundings.forEach(el => el.inert = false); document.body.style.overflow = previous; }; }, [quiet]);
    useEffect(() => { function esc(e: KeyboardEvent) { if (e.key === 'Escape')
        setQuiet(false); } window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc); }, []);
    function wake() { setVisible(true); clearTimeout(timer.current); if (quiet)
        timer.current = setTimeout(() => setVisible(false), 2800); }
    async function play() { try {
        if (!v.current)
            return;
        if (v.current.paused) {
            setBusy(true);
            await v.current.play();
        }
        else
            v.current.pause();
    }
    catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setError(true);
        setBusy(false);
    } }
    async function fullscreen() { try {
        if (document.fullscreenElement)
            await document.exitFullscreen();
        else
            await area.current?.requestFullscreen();
    }
    catch {
        setNote('当前浏览器不支持全屏，可使用“静静看”模式。');
    } }
    return <section className={`page cinema-page ${quiet ? 'quiet-mode' : ''}`}><div className="page-heading"><p className="section-caption">日落放映室</p><h1>黄昏的 21 秒</h1><p>看太阳停在海湾上方，看城市慢慢成为剪影。</p></div><div ref={area} className={`player ${quiet && !visible ? 'sleeping' : ''}`} onMouseMove={wake} onTouchStart={wake} onFocusCapture={wake}><video ref={v} src={videoSrc} poster={frames[0].image} playsInline preload="metadata" muted={muted} loop={loop} onClick={play} onLoadedMetadata={() => setDuration(v.current?.duration || 21)} onTimeUpdate={() => setTime(v.current?.currentTime || 0)} onPlaying={() => { setPlaying(true); setBusy(false); }} onPause={() => { setPlaying(false); setBusy(false); }} onEnded={() => setPlaying(false)} onWaiting={() => setBusy(true)} onCanPlay={() => setBusy(false)} onError={() => { setError(true); setBusy(false); }} aria-label="黄昏的21秒，日落影像"/>{!playing && !error && <button className="center-play" onClick={play} aria-label="播放日落"><Play size={30} fill="currentColor"/></button>}{busy && !error && <span role="status" className="loading-status">画面正在准备…</span>}{error && <div className="player-error" role="alert" style={{ backgroundImage: `linear-gradient(#10151099,#101510cc),url(${frames[0].image})`, backgroundSize: "cover", backgroundPosition: "center" }}><p>这场日落暂时未能播放。</p><button className="button" onClick={() => { setError(false); v.current?.load(); play(); }}>重新加载 <RotateCcw size={17}/></button></div>}<div className="player-controls"><input aria-label="视频播放进度" type="range" min="0" max={duration} step="0.1" value={time} onChange={e => { if (v.current)
        v.current.currentTime = Number(e.target.value); }}/><div><button onClick={play} aria-label={playing ? '暂停' : '播放'}>{playing ? <Pause /> : <Play />}</button><span className="time-display">{stamp(time)} / {stamp(duration)}</span><button onClick={() => setMuted(!muted)} aria-label={muted ? '打开声音' : '关闭声音'}>{muted ? <VolumeX /> : <Volume2 />}</button><button onClick={() => { if (v.current) {
        v.current.currentTime = 0;
        v.current.play().catch(() => setError(true));
    } }} aria-label="从头重播"><RotateCcw size={19}/></button><label className="loop-control"><input type="checkbox" checked={loop} onChange={e => setLoop(e.target.checked)}/>循环播放</label><button className="quiet-button" onClick={() => { setQuiet(!quiet); setVisible(true); clearTimeout(timer.current); if (!quiet)
        timer.current = setTimeout(() => setVisible(false), 2800); }}>{quiet ? '退出静静看' : '静静看'}</button><button aria-label="全屏" onClick={fullscreen}><Maximize size={20}/></button></div></div></div><div className="cinema-below"><p>打开声音，或就这样安静地看。</p><span>原始画幅 16:9 <span className="dot">·</span> {duration.toFixed(0)} 秒</span></div>{note && <p role="status">{note}</p>}<div className="cinema-next"><span>想把这一刻留久一点？</span><Link to="/palette" className="text-link">去影像里找一种颜色 <ArrowRight size={17}/></Link></div></section>;
}
function Palette() { const [index, setIndex] = useState(0), [copied, setCopied] = useState(''); const f = frames[index]; const timeout = useRef<ReturnType<typeof setTimeout>>(undefined); useEffect(() => () => clearTimeout(timeout.current), []); async function copy(c: string) { try {
    await navigator.clipboard.writeText(c);
    setCopied(c);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(''), 2200);
}
catch {
    setCopied('复制失败，请选中色值手动复制');
} } return <section className="page palette-page"><div className="page-heading"><p className="section-caption">暮色色谱</p><h1>日落，有多少种颜色？</h1><p>从一帧暮色里，收藏今天的橘红、暖金与深灰。</p></div><div className="palette-tabs" role="tablist" aria-label="选择暮色色谱">{paletteNames.map((name, i) => <button key={name} role="tab" id={`tab-${i}`} aria-selected={index === i} aria-controls="palette-panel" tabIndex={index === i ? 0 : -1} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    const next = (index + (e.key === 'ArrowRight' ? 1 : 3)) % 4;
    setIndex(next);
    document.getElementById(`tab-${next}`)?.focus();
} }} onClick={() => setIndex(i)}>{name}<span>{stamp(frames[i].time)}</span></button>)}</div><div id="palette-panel" role="tabpanel" aria-labelledby={`tab-${index}`}><div className="palette-image"><img src={f.image} alt={`视频第${f.time}秒：落日、海湾与远岸剪影`}/><span>《黄昏的 21 秒》 / {stamp(f.time)}</span></div><div className="palette-detail"><div><h2>{paletteNames[index]}</h2><p>{paletteNotes[index]}</p></div><p>取自此帧画面<br />点击色块，收藏色值</p></div><div className="swatches">{f.colors.map(c => <div key={c}><button style={{ background: c }} onClick={() => copy(c)} aria-label={`复制色值 ${c}`}>{copied === c ? <Check size={22}/> : <Copy size={19}/>}</button><button className="hex" onClick={() => copy(c)}>{c} {copied === c ? <Check size={14}/> : <Copy size={13}/>}</button></div>)}</div></div><p className="copy-feedback" role="status">{copied.startsWith('#') ? `已复制 ${copied}` : copied || '把一种颜色，带回今天的生活里。'}</p><div className="cinema-next"><span>颜色之外，还有一些文字。</span><Link to="/journal" className="text-link">翻阅暮色手记 <ArrowRight size={17}/></Link></div></section>; }
function Journal() { return <section className="page journal-page"><div className="page-heading"><p className="section-caption">暮色手记</p><h1>在天色暗下来以前，<br />读一小段生活。</h1><p>关于黄昏，关于观看，也关于那些不必匆忙的日常片刻。</p></div><div className="journal-list">{articles.map((a, i) => <Link className="journal-row" to={`/journal/${a.slug}`} key={a.slug}><img src={frames[a.image].image} alt={`暮色手记配图：第${frames[a.image].time}秒的海湾日落`}/><div><p className="article-meta">{a.tag}<span>约 3 分钟阅读</span></p><h2>{a.title}</h2><p>{a.summary}</p><span className="text-link">慢慢读 <ArrowUpRight size={18}/></span></div><span className="journal-number">{String(i + 1).padStart(2, '0')}</span></Link>)}</div></section>; }
function Article() { const { slug } = useParams(); const i = articles.findIndex(a => a.slug === slug); if (i < 0)
    return <section className="page"><h1>这篇手记还没有写下。</h1><Btn to="/journal">返回手记列表</Btn></section>; const a = articles[i]; return <article className="article-page"><div className="article-title"><Link to="/journal" className="back-link"><ArrowLeft size={16}/>返回手记列表</Link><p className="article-meta">{a.tag}<span>约 3 分钟阅读</span></p><h1>{a.title}</h1><p className="article-summary">{a.summary}</p></div><figure className="article-wide"><img src={frames[a.image].image} alt={`视频第${frames[a.image].time}秒的日落，海面和远岸安静相映`}/><figcaption>《黄昏的 21 秒》中的一帧 / {stamp(frames[a.image].time)}</figcaption></figure><div className="article-body">{a.paragraphs.map((p, j) => <p key={j}>{p}</p>)}<span className="end-mark"><Sunset size={25}/></span></div><div className="article-pagination">{i > 0 ? <Link to={`/journal/${articles[i - 1].slug}`}><small>上一篇</small>{articles[i - 1].title}<ArrowLeft size={17}/></Link> : <Link to="/journal"><small>回到目录</small>翻阅全部手记<ArrowLeft size={17}/></Link>}{i < 2 ? <Link to={`/journal/${articles[i + 1].slug}`}><small>下一篇</small>{articles[i + 1].title}<ArrowRight size={17}/></Link> : <Link to={`/journal/${articles[0].slug}`}><small>再读一篇</small>{articles[0].title}<ArrowRight size={17}/></Link>}</div><LetterInvitation /></article>; }
const moods = ['平静', '开心', '疲惫', '想念', '期待'];
const defaultDraft = { mood: '平静', text: '', background: 0 };
function loadDraft(): {
    mood: string;
    text: string;
    background: number;
} { try {
    const d = JSON.parse(localStorage.getItem('dusk-draft') || 'null');
    if (d && moods.includes(d.mood) && typeof d.text === 'string' && Number.isInteger(d.background) && d.background >= 0 && d.background < 4)
        return { ...d, text: Array.from(d.text).slice(0, 200).join('') };
}
catch { } return defaultDraft; }
type Draft = {
    mood: string;
    text: string;
    background: number;
};
function wrapText(ctx: CanvasRenderingContext2D, text: string, width: number) { const lines: string[] = []; for (const paragraph of text.replace(/\n{3,}/g, '\n\n').trim().split('\n')) {
    let line = '';
    for (const ch of Array.from(paragraph)) {
        if (ctx.measureText(line + ch).width > width) {
            lines.push(line);
            line = ch;
        }
        else
            line += ch;
    }
    lines.push(line);
} return lines; }
async function drawCard(canvas: HTMLCanvasElement, draft: Draft, date: string) { await document.fonts.ready; const img = new Image(); img.src = frames[draft.background].image; await img.decode(); canvas.width = 1080; canvas.height = 1350; const ctx = canvas.getContext('2d'); if (!ctx)
    throw Error('canvas'); const scale = Math.max(1080 / img.width, 1350 / img.height); ctx.drawImage(img, (1080 - img.width * scale) / 2, (1350 - img.height * scale) / 2, img.width * scale, img.height * scale); const g = ctx.createLinearGradient(0, 0, 0, 1350); g.addColorStop(0, 'rgba(15,18,16,.12)'); g.addColorStop(.35, 'rgba(15,18,16,.48)'); g.addColorStop(1, 'rgba(15,18,16,.97)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1350); ctx.fillStyle = '#f5efe4'; ctx.font = `28px ${serif}`; ctx.fillText(`此刻 · ${draft.mood}`, 88, 385); const text = draft.text.trim() || '今天辛苦了。\n让心事，随着晚霞慢慢落下。'; let size = 40; let lines: string[] = []; do {
    ctx.font = `${size}px ${serif}`;
    lines = wrapText(ctx, text, 904);
    if (lines.length * size * 1.6 <= 620)
        break;
    size -= 1;
} while (size > 1); ctx.font = `${size}px ${serif}`; lines = wrapText(ctx, text, 904); lines.forEach((line, j) => ctx.fillText(line, 88, 470 + j * size * 1.6)); ctx.fillStyle = '#e2d6c4'; ctx.font = '24px "Microsoft YaHei", sans-serif'; ctx.fillText(date, 88, 1200); ctx.font = '28px Georgia, serif'; ctx.fillText('D U S K', 820, 1200); ctx.strokeStyle = 'rgba(245,239,228,.32)'; ctx.beginPath(); ctx.moveTo(88, 1145); ctx.lineTo(992, 1145); ctx.stroke(); }
function Letters() {
    const [draft, setDraft] = useState(loadDraft), [notice, setNotice] = useState(''), [exporting, setExporting] = useState(false), [rendered, setRendered] = useState(false);
    const preview = useRef<HTMLCanvasElement>(null);
    const composing = useRef(false);
    const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    useEffect(() => { try {
        localStorage.setItem('dusk-draft', JSON.stringify(draft));
    }
    catch {
        setNotice('浏览器无法保存草稿，请在离开前导出卡片。');
    } let active = true; setRendered(false); const buffer = document.createElement('canvas'); drawCard(buffer, draft, date).then(() => { if (active && preview.current) {
        preview.current.width = 1080;
        preview.current.height = 1350;
        preview.current.getContext('2d')?.drawImage(buffer, 0, 0);
        setRendered(true);
    } }).catch(() => { if (active)
        setNotice('背景图片未能加载，请切换背景或刷新后重试。'); }); return () => { active = false; }; }, [draft, date]);
    async function download() { setExporting(true); setNotice(''); try {
        if (!preview.current || !rendered)
            throw Error();
        const canvas = preview.current;
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(Error()), 'image/png'));
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `暮色之间-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.png`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        setNotice('心情卡片已生成，正在下载 PNG。');
    }
    catch {
        setNotice('卡片未能导出，请等待背景图片加载完成后重试，或换一个浏览器。');
    }
    finally {
        setExporting(false);
    } }
    return <section className="page letters-page"><div className="page-heading"><p className="section-caption">写给黄昏</p><h1>今天，有什么想留在这里？</h1><p>可以是一件小事，也可以只是一句：今天辛苦了。</p></div><div className="letter-workspace"><div className="letter-form"><fieldset><legend>此刻的心情</legend><div className="moods">{moods.map((m, i) => <button key={m} aria-pressed={draft.mood === m} className={draft.mood === m ? 'selected' : ''} onClick={() => setDraft({ ...draft, mood: m })}><span>{['◡', '☼', '☾', '♡', '✧'][i]}</span>{m}</button>)}</div></fieldset><label className="input-label" htmlFor="letter">留一句话给今天 <span>{Array.from(draft.text).length} / 200</span></label><textarea id="letter" value={draft.text} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={e => { composing.current = false; const text = Array.from(e.currentTarget.value).slice(0, 200).join(''); setDraft(previous => ({ ...previous, text })); }} onChange={e => { const value = e.target.value; setDraft(previous => ({ ...previous, text: composing.current ? value : Array.from(value).slice(0, 200).join('') })); }} placeholder="此刻，想对自己说些什么？" rows={6}/><fieldset><legend>选一帧暮色</legend><div className="background-choices">{frames.map((f, i) => <button key={f.time} className={draft.background === i ? 'selected' : ''} aria-label={`使用第${f.time}秒截图作为背景`} aria-pressed={draft.background === i} onClick={() => setDraft({ ...draft, background: i })}><img src={f.image} alt=""/>{draft.background === i && <Check size={18}/>}<small>{stamp(f.time)}</small></button>)}</div></fieldset><p className="privacy">文字仅保存在此浏览器，草稿会自动保存。</p><div className="actions"><button className="button" onClick={download} disabled={exporting || !rendered || Array.from(draft.text).length > 200}>{exporting ? '正在保存…' : '把这一刻存下来'}<Download size={17}/></button><button className="clear-button" onClick={() => { setDraft({ ...defaultDraft }); setNotice('已清空，可以重新写下今天。'); }}>清空重写</button></div><p role="status" className="form-notice">{notice}</p></div><div className="card-preview-wrap"><span className="preview-label">你的暮色卡片 · 实时预览</span><canvas ref={preview} className="mood-canvas" width="1080" height="1350" role="img" aria-label={`心情卡片：${draft.mood}，${draft.text || '今天辛苦了。让心事，随着晚霞慢慢落下。'}，${date}，DUSK`}/><p className="preview-hint">让今天，有一张可以留下的形状。</p></div></div></section>;
}
function About() { return <><section className="page about-page"><div className="about-top"><div><p className="section-caption">关于暮色</p><h1>从一段 21 秒<br />的日落开始。</h1><p className="about-lead">我们想留住的，<br />是一天结束时，终于可以慢下来的一刻。</p></div><img src={frames[0].image} alt="一轮落日停在海湾上方，水面映着天光"/></div><div className="about-content"><section><h2>为什么是黄昏</h2><p>一天里，有太多时刻被安排好了。黄昏却像一个小小的停顿：白天的事情还没完全远去，夜晚已经开始靠近。「暮色之间」想把这个停顿留得久一点。</p><p>从这段日落影像出发，我们做了一个可以观看、探索、阅读和记录的地方。你不必完成任何任务，也不需要写得漂亮。能在这里安静一会儿，就很好。</p></section><section><h2>四种停留的方式</h2><div className="about-experiences">{[['观看', '/cinema', '把二十一秒交给太阳与海湾。'], ['探索', '/palette', '在一帧画面里，找到喜欢的颜色。'], ['阅读', '/journal', '读一些关于平常日子的文字。'], ['记录', '/letters', '为今天的心情，留下一张卡片。']].map(([title, to, p]) => <Link key={to} to={to}><h3>{title}<ArrowUpRight size={18}/></h3><p>{p}</p></Link>)}</div></section><section className="source-note"><h2>关于这里的影像与声音</h2><p>当前展示的画面与声音均来自本次提供的视频文件 dusk_sunset_21s.mp4。已确认文件时长 21 秒，分辨率 1920 × 1080，并含有音轨。本站封面、色谱及心情卡片背景，均从这段视频实际截取。</p><p>文件元数据包含视频及音乐的来源标注，但尚未独立核实。原始来源、创作者及授权信息：待补充；拍摄地点与日期：待补充。此处不将文件内标注作为已核实的授权依据。</p></section><section><h2>下一场暮色</h2><p>未来，希望这里有更多日落影像、从画面中采集的色谱，以及值得慢慢读的手记。每一份新素材，都将在来源信息核实后补充说明。</p><div className="actions"><Btn to="/cinema">再看一次日落</Btn><Btn to="/letters" secondary>写下今天的心情</Btn></div></section></div></section></>; }
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);

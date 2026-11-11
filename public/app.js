import {
  React, createRoot
} from './vendor/react-runtime.js';
import {
  programme, questions
} from './program.js';
import {
  stations, chapterStation, layoutHall, positionCamera
} from './walk.js';
import {
  circuitTree
} from './tree.js';
const {
  createElement: h, useEffect, useLayoutEffect, useState, useRef
} = React;
const chapters =[
['The spark', 'The festival begins'],['Origin', 'Born in Jaipur'],['First light', 'Every rhythm has an origin'],['Amplify', 'The age of sound'],['The gallery', 'On the festival walls'],['In motion', 'The age of movement'],['The passage', 'The makers’ arcade'],['Afterglow', 'The next stage'],['Questions', 'Visitor FAQ'],['Visitor desk', 'Register interest']
];
const pad = i => String(i + 1).padStart(2, '0');
const btn =(text, action, props = { }) => h('button', {
  type: 'button', onClick: action, ... props
}, text);
const photo =(i, extra = '') => h('div', {
  'aria-hidden': true, className: 'photo ' + extra, style: {
    backgroundImage: 'url(/art/chapter-' + i + '.webp)'
  }
});
const tag =(text) => h('small', {
  className: 'kicker'
}, text);
const arrow =(text, click) => btn([h('span', {
  key: 't'
}, text), h('b', {
  key: 'a', 'aria-hidden': true
}, '↗')], click, {
  className: 'capsule'
});
function ArtTree() {
  const host = useRef();
  useLayoutEffect(() => {
    host.current.replaceChildren(circuitTree());
  },[]);
  return h('div', {
    className: 'tree', ref: host
  });
}
function Pin() {
  return h('span', {
    className: 'mark', 'aria-hidden': true
  }, 'ϟ');
}
function Gallery({
  onItem
}) {
  return h('div', {
    className: 'galleryWall'
  }, tag('CURATED PROGRAMME   /   THE GALLERY'), h('h2', null, 'ON THE WALLS'), h('div', {
    className: 'prints'
  }, ... programme.map(item =>
  btn(h(React.Fragment, null, h('div', {
    className: 'mat'
  }, photo(item.art)), h('span', null, item.name), h('small', null, item.type)),() => onItem(item), {
    key: item.id, className: 'print'
  }))));
}
function Hall({
  architecture
}) {
  return h('div', {
    className: 'architecture', ref: architecture, 'aria-hidden': true
  });
}
function FAQRoom() {
  const[active, set] = useState(0);
  return h('div', {
    className: 'faqRoom'
  }, tag('BLITZSCHLAG  /  VISITOR GUIDE'), h('h2', null, 'QUESTIONS'), h('div', {
    className: 'faq'
  }, ... questions.map(([q, a], i) => h('section', {
    key: q
  }, btn(h(React.Fragment, null, q, h('b', null, active === i ? '−': '+')),() => set(active === i ? - 1: i), {
    'aria-expanded': active === i
  }), active === i && h('p', null, a)))));
}
function LightTrail() {
  const path = useRef();
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let points =[], raf = 0;
    function frame(now) {
      points = points.filter(p => now - p.time < 300);
      path.current?.setAttribute('d', points.map((p, i) =>(i ? 'L': 'M') + p.x + ' ' + p.y).join(' '));
      raf = points.length ? requestAnimationFrame(frame): 0;
    }
    function move(e) {
      points.push({
        x: e.clientX, y: e.clientY, time: performance.now()
      });
      points = points.slice(- 18);
      if (!raf) raf = requestAnimationFrame(frame);
    }
    window.addEventListener('pointermove', move, {
      passive: true
    });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  },[]);
  return h('svg', {
    className: 'trail', 'aria-hidden': true
  }, h('path', {
    ref: path
  }));
}
function Wall({
  index, open, go, item
}) {
  const paint =(n, title, line) => h(React.Fragment, null, h('div', {
    className: 'photo mural', style: {
      backgroundImage: 'url(/art/mural-' + n + '.webp)'
    }
  }), h('div', {
    className: 'shade'
  }), h('div', {
    className: 'caption'
  }, tag('CHAPTER ' + pad(index) + '   /   BLITZSCHLAG 2027'), h('h2', null, title), h('p', null, line)));
  switch (index) {
    case 0:
    return h(React.Fragment, null, h('div', {
      className: 'orbit'
    }), h(ArtTree), h('div', {
      className: 'heroCopy'
    }, tag('MNIT JAIPUR   /   CULTURAL FESTIVAL'), h('h1', null, 'BLITZSCHLAG'), h('p', null, 'A city of sound, movement and colour. Step inside the cultural festival of MNIT Jaipur.')), h('div', {
      className: 'heroAction'
    }, arrow('Register now',() => go(chapters.length - 1))), h('span', {
      className: 'heroEdition'
    }, 'EDITION  /  2027'));
    case 1:
    return h('div', {
      className: 'originCopy'
    }, tag('PROLOGUE   /   RAJASTHAN'), h('h2', null, 'BORN IN', h('br'), 'JAIPUR'), h('p', null, 'From the pulse of a folk drum to the first note on a campus stage, every festival begins with people making something together.'), h('div', {
      className: 'seal'
    }, 'RJ', h('small', null, '26° 51′ N')));
    case 2:
    return h(React.Fragment, null, paint(0, 'EVERY RHYTHM HAS AN ORIGIN', 'A courtyard, an instrument, a song passed from one generation to the next.'), btn('Explore ↗',() => item(programme.find(p => p.id === 'roots')), {
      className: 'muralPin', 'aria-label': 'Explore Desert Sessions'
    }));
    case 3:
    return paint(1, 'THE AGE OF SOUND', 'One voice reaches the microphone. A hundred more answer.');
    case 4:
    return h(Gallery, {
      onItem: item
    });
    case 5:
    return paint(2, 'THE AGE OF MOVEMENT', 'Bodies find the beat. The stage becomes a language of its own.');
    case 6:
    return h('div', {
      className: 'arcadeCard'
    }, tag('CREATIVE QUARTER  /  WORKSHOPS'), h('h2', null, 'THE MAKERS’ ARCADE'), h('p', null, 'From hand-printed motifs to light on a stage, explore the craft behind a performance.'), btn('Explore workshops  ↗',() => open('Workshops')));
    case 7:
    return paint(3, 'THE NEXT STAGE', 'Music, performance and visual art meet under one Jaipur sky.');
    case 8:
    return h(FAQRoom);
    default:
    return h('div', {
      className: 'desk'
    }, tag('VISITOR DESK   /   2027'), h('h2', null, 'REGISTER NOW'), h('p', null, 'Explore the programme before registration opens. Confirmed dates and entry details will appear here.'), h('div', {
      className: 'deskActions'
    }, arrow('Browse programme',() => open('Events')), btn('Visitor FAQ  ↗',() => open('FAQ'))));
  }
}
function Enquiry({
  kind
}) {
  const[status, setStatus] = useState(''),[busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget, d = Object.fromEntries(new FormData(form));
    setBusy(true);
    setStatus('');
    try {
      const r = await fetch('/api/enquiry', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          ... d, kind
        })
      });
      const result = await r.json();
      if (!r.ok) throw Error(result.error || 'Please retry.');
      form.reset();
      setStatus('Enquiry saved to this site’s organiser inbox.');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  }
  return h('form', {
    className: 'enquiry', onSubmit: submit
  }, h('label', null, 'Name', h('input', {
    name: 'name', required: true, maxLength: 80
  })), h('label', null, 'Email', h('input', {
    name: 'email', type: 'email', required: true, maxLength: 180
  })), h('label', null, 'Message', h('textarea', {
    name: 'message', required: true, minLength: 5, maxLength: 2400, rows: 3
  })), h('button', {
    disabled: busy
  }, busy ? 'Saving…': 'Submit enquiry  ↗'), h('p', {
    role: 'status'
  }, status));
}
function Overlay({
  view, detail, openItem, close, go, back
}) {
  const ref = useRef(),[active, set] = useState(- 1);
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    return () => {
      d.close();
    };
  },[]);
  return h('dialog', {
    ref, className: 'modal', onCancel: e => {
      e.preventDefault();
      close();
    }, 'aria-labelledby': 'overlay-title', onClick: e => {
      if (e.target === ref.current) close();
    }
  },
  h('div', {
    className: 'modalInner'
  }, h('div', {
    className: 'modalHead'
  }, tag('BLITZSCHLAG ’27  /  MNIT JAIPUR'), btn('✕', close, {
    'aria-label': 'Close panel'
  })),
  h('h2', {
    id: 'overlay-title'
  }, detail ? detail.name: view === 'Index' ? 'Chapter index': view === 'FAQ' ? 'QUESTIONS': view),
  detail ? h(React.Fragment, null, h('div', {
    className: 'detailImage'
  }, photo(detail.art)), tag(detail.kind + '   /   ' + detail.type), h('p', null, detail.text), h('p', {
    className: 'muted'
  }, '2027 programme preview · Schedule to be confirmed.'), btn('← Back to ' + view, back)):
  view === 'Index' ? h('div', {
    className: 'indexList'
  }, ... chapters.map(([name], i) => btn(h(React.Fragment, null, h('small', null, pad(i)), name, h('span', null, '↗')),() => go(i), {
    key: name
  }))):
  view === 'FAQ' ? h('div', {
    className: 'faq'
  }, ... questions.map(([q, a], i) => h('section', {
    key: q
  }, btn(h(React.Fragment, null, q, h('b', null, active === i ? '−': '+')),() => set(active === i ? - 1: i), {
    'aria-expanded': active === i
  }), active === i && h('p', null, a)))):
  view === 'Sponsors' || view === 'Contact' ? h(React.Fragment, null, h('p', null, view === 'Sponsors' ? '2027 partners will appear here once confirmed. Use the form for a festival partnership enquiry.': 'Leave a message for the festival site organiser.'), h(Enquiry, {
    kind: view
  })):
  h(React.Fragment, null, h('p', {
    className: 'muted'
  }, '2027 programme preview'), h('div', {
    className: 'listCards'
  }, ... programme.filter(v => view === 'Events' || v.kind === view).map(v => btn(h(React.Fragment, null, photo(v.art), h('div', null, tag(v.type), h('b', null, v.name)), h('span', null, '↗')),() => openItem(v), {
    key: v.id
  }))))));
}
function App() {
  const stage = useRef(),
  world = useRef(),
  architecture = useRef(),
  walls = useRef([]),
  progress = useRef(0),
  block = useRef(false),
  trigger = useRef(),
  [idx, setIdx] = useState(0),
  [modal, setModal] = useState(''),
  [detail, setDetail] = useState(null),
  [loading, load] = useState(0),
  [nav, setNav] = useState(false);
  const reduced = useRef(matchMedia('(prefers-reduced-motion: reduce)').matches);
  const chapterHeight =() => Math.max(480, window.innerHeight * 1.02);
  const move = i => {
    dismiss(false);
    window.scrollTo({
      top: Math.max(0, Math.min(stations.length - 1, i)) * chapterHeight(), behavior: reduced.current ? 'instant': 'smooth'
    });
  };
  const jump = i => move(chapterStation(i));
  function open(v) {
    trigger.current = document.activeElement;
    block.current = true;
    setNav(false);
    setModal(v);
    setDetail(null);
  }
  function dismiss(focus = true) {
    block.current = false;
    setModal('');
    setDetail(null);
    setNav(false);
    if (focus) requestAnimationFrame(() => trigger.current?.focus?.({
      preventScroll: true
    }));
  }
  function card(v) {
    open(v.kind);
    setDetail(v);
  }
  useEffect(() => {
    const t = performance.now();
    let id;
    const frame = now => {
      const n = Math.min(100, Math.floor((now - t) /(reduced.current ? 1: 9)));
      load(n);
      if (n < 100) id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  },[]);
  useLayoutEffect(() => {
    let raf = 0, layout, position, lastTime = 0;
    const count = stations.length;
    function render(now = performance.now()) {
      raf = 0;
      const H = stage.current.clientHeight, W = stage.current.clientWidth, unit = chapterHeight();
      if (!layout || layout.W !== W || layout.H !== H) {
        layout = layoutHall(stage.current, walls.current, architecture.current);
        document.documentElement.style.setProperty('--journey',(unit *(count - 1) + window.innerHeight) + 'px');
      }
      const target = Math.min(count - 1, Math.max(0, scrollY / unit));
      const dt = Math.min(.1,(now - lastTime) / 1000);
      lastTime = now;
      if (position === undefined || reduced.current || Math.abs(target - position) < .0005) position = target;
      else position +=(target - position) *(1 - Math.exp(- dt * 15));
      const p = position;
      progress.current = p;
      if (p !== target) raf = requestAnimationFrame(render);
      const active = stations[Math.round(p)];
      setIdx(active);
      walls.current.forEach((board, id) => {
        board.inert = id !== active;
      });
      positionCamera(world.current, layout, p, reduced.current);
      stage.current.style.setProperty('--progress',(p /(count - 1) * 100) + '%');
    }
    const schedule =() => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener('scroll', schedule, {
      passive: true
    });
    window.addEventListener('resize', schedule);
    function key(e) {
      if (block.current || e.target.closest('button, input, textarea, dialog, a')) return;
      const step = {
        ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: - 1, ArrowUp: - 1, PageUp: - 1
      }[e.key];
      if (step) {
        e.preventDefault();
        move(Math.round(progress.current) + step);
      }
    }
    window.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('keydown', key);
    };
  },[]);
  useEffect(() => {
    document.documentElement.classList.toggle('locked', Boolean(modal));
    return () => document.documentElement.classList.remove('locked');
  },[modal]);
  return h(React.Fragment, null, h(LightTrail), h('header', {
    className: 'nav'
  }, btn(h(React.Fragment, null, h(Pin), h('span', null, h('strong', null, 'BLITZSCHLAG’27'), h('small', null, 'MNIT JAIPUR'))),() => jump(0), {
    className: 'wordmark', 'aria-label': 'Blitzschlag home'
  }),
  h('nav', {
    className: nav ? 'expanded': ''
  }, ...['Events', 'Competitions', 'Workshops', 'Hackathons', 'Sponsors', 'Contact'].map(v => btn(v,() => open(v), {
    key: v
  }))), btn('Menu',() => setNav(!nav), {
    className: 'menu', 'aria-expanded': nav
  }), btn('Register ↗',() => jump(chapters.length - 1), {
    className: 'lime'
  })),
  h('main', {
    className: 'journey', 'aria-label': 'Scroll-through festival exhibition'
  }, h('div', {
    className: 'stage', ref: stage
  }, h('div', {
    className: 'cameraWorld', ref: world
  }, h(Hall, {
    architecture
  }), ... chapters.map(([title], i) => h('section', {
    key: title, ref: n => {
      walls.current[i] = n;
    }, className: 'wall w' + i, 'aria-label': title
  }, h(Wall, {
    index: i, open, go: jump, item: card
  })))),
  h('div', {
    className: 'controls'
  }, btn(h(React.Fragment, null, h('b', null, pad(idx)), h('span', null, ' / ' + chapters.length + '   ·   ' + chapters[idx][0]), h('em', null, '☰')),() => open('Index'), {
    className: 'chapterButton', 'aria-label': 'Open chapter index'
  }),
  h('div', {
    className: 'scrollHint'
  }, h('span', null, idx === chapters.length - 1 ? 'VISITOR DESK': 'SCROLL TO VISIT'), h('i')),
  h('div', {
    className: 'stepBtns'
  }, btn('?',() => open('FAQ'), {
    'aria-label': 'Festival FAQ'
  }), btn('←',() => move(Math.round(progress.current) - 1), {
    disabled: idx === 0, 'aria-label': 'Previous chapter'
  }), btn('→',() => move(Math.round(progress.current) + 1), {
    disabled: idx === chapters.length - 1, 'aria-label': 'Next chapter'
  }))))),
  modal && h(Overlay, {
    key: modal, view: modal, detail, openItem: setDetail, close: dismiss, back:() => setDetail(null), go: jump
  }),
  loading < 100 && h('div', {
    className: 'loading', role: 'status'
  }, h(Pin), h('b', null, String(loading).padStart(3, '0')), h('i', {
    style: {
      width: loading * .9 + 'px'
    }
  })));
}
createRoot(document.getElementById('root')).render(h(App));

import { useState, useEffect, useRef } from "react";

const C = {
  navy: "#1B2A4A", navyL: "#243B6A", navyM: "#2D4A7A",
  gold: "#F7D76B", goldL: "#FDE68A", goldP: "#FEF3C7",
  warm: "#FAFAF5", w: "#fff",
  g1: "#F5F5F0", g2: "#E8E8E3", g4: "#9B9B93", g6: "#666660", g8: "#333330",
};

const Logo = ({ light, s = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s, cursor: "pointer" }}>
    <svg width={36 * s} height={36 * s} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill={light ? "rgba(255,255,255,0.08)" : "rgba(27,42,74,0.06)"} />
      {[0,40,80,-40,-80].map((a,i) => <line key={i} x1="18" y1="14" x2={18+Math.sin(a*Math.PI/180)*14} y2={14-Math.cos(a*Math.PI/180)*14} stroke={C.gold} strokeWidth={1.2} opacity={.3+i*.08} strokeLinecap="round"/>)}
      <circle cx="18" cy="14" r="5" fill={C.goldP} opacity=".5"/><circle cx="18" cy="14" r="3" fill={C.gold} opacity=".7"/>
      <path d="M12 26V14L24 26V14" fill="none" stroke={light?"#fff":C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18*s, fontWeight:600, color:light?"#fff":C.navy, letterSpacing:2, lineHeight:1 }}>The NILE</div>
      {s>=.85&&<div style={{ fontSize:7.5*s, color:light?"rgba(255,255,255,.5)":C.g4, letterSpacing:2.5, marginTop:2 }}>Nurtuning Into Light Everyday</div>}
    </div>
  </div>
);

const FI = ({ children, delay=0, style={} }) => {
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const el=r.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect()}},{threshold:.12});o.observe(el);return()=>o.disconnect()},[]);
  return <div ref={r} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:`opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,...style}}>{children}</div>;
};
const Sec=({bg="transparent",children,style={},id})=><section id={id} style={{padding:"80px 0",background:bg,...style}}>{children}</section>;
const Box=({children,style={}})=><div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",...style}}>{children}</div>;
const Tag=({children,color=C.gold})=><div style={{fontSize:12,fontWeight:600,letterSpacing:3,color,textTransform:"uppercase",marginBottom:8}}>{children}</div>;
const H2=({children,light,style={}})=><h2 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(24px,5vw,32px)",fontWeight:700,color:light?"#fff":C.navy,lineHeight:1.5,marginBottom:16,wordBreak:"keep-all",...style}}>{children}</h2>;
const Desc=({children,light})=><p style={{fontSize:16,lineHeight:1.8,color:light?"rgba(255,255,255,.75)":C.g6,maxWidth:640,marginBottom:32,wordBreak:"keep-all"}}>{children}</p>;
const Btn=({children,primary=true,onClick,style={}})=><button onClick={onClick} style={{padding:"14px 32px",borderRadius:50,border:primary?"none":`1.5px solid ${C.navy}`,background:primary?C.navy:"transparent",color:primary?"#fff":C.navy,fontSize:15,fontWeight:600,cursor:"pointer",transition:"all .3s",...style}}>{children}</button>;
const BG=({children,onClick,style={}})=><button onClick={onClick} style={{padding:"14px 32px",borderRadius:50,border:"none",background:C.gold,color:C.navy,fontSize:15,fontWeight:600,cursor:"pointer",...style}}>{children}</button>;
const Dot=()=><div style={{width:4,height:4,borderRadius:2,background:C.gold,flexShrink:0}}/>;

const PAGES=[
  {id:"home",label:"Home"},{id:"about",label:"더나일 소개"},{id:"programs",label:"사업소개"},
  {id:"parentscan",label:"양육불안검사"},{id:"pacer",label:"후원하기"},{id:"contact",label:"협력문의"},
];

const Nav=({page,go})=>{
  const[sc,setSc]=useState(false);const[op,setOp]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const home=page==="home";const solid=sc||!home;const txt=solid?C.navy:"#fff";
  return(<>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:solid?"rgba(255,255,255,.97)":"transparent",backdropFilter:sc?"blur(12px)":"none",borderBottom:sc?`1px solid ${C.g2}`:"none",transition:"all .3s"}}>
      <Box style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:72}}>
        <div onClick={()=>go("home")}><Logo light={home&&!sc} s={.8}/></div>
        <div style={{display:"flex",alignItems:"center",gap:24}}>
          {PAGES.map(n=><div key={n.id} onClick={()=>go(n.id)} className="nl" style={{fontSize:14,color:page===n.id?C.gold:txt,cursor:"pointer",fontWeight:page===n.id?600:400,transition:"color .2s"}}>{n.label}</div>)}
          <BG onClick={()=>go("pacer")} className="nl" style={{padding:"10px 24px",fontSize:13}}>후원하기</BG>
          <div onClick={()=>setOp(!op)} className="bg" style={{display:"none",flexDirection:"column",gap:5,cursor:"pointer",padding:8}}>{[0,1,2].map(i=><div key={i} style={{width:22,height:2,background:txt,borderRadius:1}}/>)}</div>
        </div>
      </Box>
    </nav>
    {op&&<div style={{position:"fixed",inset:0,zIndex:99,background:"rgba(27,42,74,.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}} onClick={()=>setOp(false)}>
      {PAGES.map(n=><div key={n.id} onClick={()=>go(n.id)} style={{fontSize:22,color:"#fff",cursor:"pointer",fontWeight:page===n.id?700:400}}>{n.label}</div>)}
      <BG onClick={()=>go("pacer")} style={{marginTop:16}}>후원하기</BG>
    </div>}
    <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Noto+Serif+KR:wght@400;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',sans-serif;color:${C.g8};background:${C.warm};overflow-x:hidden;word-break:keep-all}h1,h2,h3,h4,p{word-break:keep-all}.nl{display:block}.bg{display:none!important}@media(max-width:960px){.nl{display:none!important}.bg{display:flex!important}}`}</style>
  </>);
};

const Footer=({go})=>(
  <footer style={{background:"#000",color:"rgba(255,255,255,.7)",padding:"64px 0 40px"}}>
    <Box>
      {/* 로고 */}
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(36px,5vw,48px)",fontWeight:700,color:"#fff",lineHeight:1.1}}>The <span style={{fontWeight:800}}>NILE.</span></div>
      </div>
      {/* 법인명 */}
      <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:16}}>사단법인 더나일</div>
      {/* 법인 정보 */}
      <div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:2,marginBottom:24}}>
        비영리법인 설립허가번호 : 제2024-194호<br/>
        사업자등록번호 : 438-82-00797<br/>
        소재지 : 서울특별시 성동구 뚝섬로1나길 5, 7층 S721호(성수동1가, 헤이그라운드)
      </div>
      {/* 연락처 */}
      <div style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:32,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        <span>전화번호 : 010-8257-1104</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span>이메일 : cross@thenile.kr</span>
      </div>
      {/* 링크 */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:32}}>
        <span style={{cursor:"pointer"}}>이용약관</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span style={{cursor:"pointer"}}>개인정보처리방침</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span style={{cursor:"pointer"}}>공익위반신고 바로가기</span>
      </div>
      {/* 카피라이트 */}
      <div style={{fontSize:13,color:"rgba(255,255,255,.45)"}}>Copyright © 2025 사단법인 더나일 All rights reserved.</div>
    </Box>
  </footer>
);

/* ═══ ACTIVITY SLIDER — PDF p.7~12 전체 활동 빠짐없이 ═══ */
const ACTIVITIES = [
  { cat:"#성장추구", t:"양성평등 돌봄문화 확산을 위한 보조금 사업(영등포구)",
    d:"양육이라는 긴 레이스를 포기하지 않고 완주할 수 있도록 돕는 부모 교육 프로젝트로, 초기 부모들을 대상으로 하여 영등포구 내 부모의 성장을 지원했습니다",
    stats:[["참가자","총 400명 (3개 기수)"],["만족도","4.88점"],["완주율","85%"],["주요성과","남성참여자 35%"]], period:"2025년 6월 ~ 10월 (4개월)" },
  { cat:"#성장추구 #양육문화", t:"비장애 형제가정을 위한 보조금 사업 (성동구 ESG)",
    d:"공공 영역의 세밀한 사각지대를 더나일만의 기획력으로 진행한 공공사업. 장애 아동에게 집중된 기존 지원의 한계를 넘어, 상대적으로 소외된 비장애 형제와 부모의 정서 회복까지 포괄하는 통합 가족 돌봄 솔루션을 제공했습니다.",
    stats:[["상담제공","총 138회"],["평가","가족 수용도 89% 긍정 평가"]], period:"2025년 6월 ~ 10월 (4개월)" },
  { cat:"#성장추구 #양육문화", t:"전국 부모의 마음과 만난 이마트 우리동네 아이케어",
    d:"전국 거점 문화센터를 활용한 실질적 부모 지원 및 CSR 성공 모델",
    stats:[["참가자","총 800명 (4개 지역)"],["만족도","4.95점"],["양육불안지표","30% 감소"],["주요성과","전지점 조기마감"]], period:"2025년 5월 ~ 2026년 2월 (10개월)" },
  { cat:"#양육문화", t:"건강한 양육문화 확산을 위한 행사 진행",
    d:"2025년 11월 서울시여성가족재단 * 육아콘서트 (양성평등 오늘, 가족이 자라는 내일) 기획 및 운영",
    stats:[], period:"2025년 11월" },
  { cat:"#환경구조 #양육문화", t:"정책토론회 기획 및 개최",
    d:"[자녀 동반이 가능한 정책 토론회 국회 내 개최] -백혜련 의원실\n2025년 12월 국회 저출생 축소사회 대응 포럼과 공동 정책간담회 개최 (참석자 120명)",
    stats:[["참석자","120명"]], period:"2025년 12월" },
  { cat:"#성장추구", t:"긴급지원상담",
    d:"사별, 이혼 소송 중, 저소득층, 아동 학대 의심 가정 등 심리적 위기 상황에 처한 부모 및 아동 대상 후원금을 활용한 1:1 긴급 심리 상담 지원, 전문 상담사 연계, 위기 상황별 맞춤형 코칭 제공",
    stats:[], period:"상시 진행" },
  { cat:"#성장추구", t:"장애아동부모상담",
    d:"장애 아동의 부모를 대상으로 한 전문 심리상담 및 정서 지원 프로그램",
    stats:[], period:"2025년" },
  { cat:"#양육문화", t:"까르띠에 여성창업",
    d:"까르띠에 여성창업 프로그램과 연계한 양육문화 사업",
    stats:[], period:"2025년" },
];

const ActivitySlider = () => {
  const [idx, setIdx] = useState(0);
  const total = ACTIVITIES.length;
  const prev = () => setIdx(i => i === 0 ? total - 1 : i - 1);
  const next = () => setIdx(i => i === total - 1 ? 0 : i + 1);
  const a = ACTIVITIES[idx];
  return (
    <Sec bg={C.w}>
      <Box>
        <FI><div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom:32 }}>
          <div>
            <Tag>2025 주요 활동</Tag>
            <H2>2025년의 더나일의 주요 활동</H2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:14, color:C.g4 }}>{idx + 1} / {total}</span>
            <button onClick={prev} style={{ width:40, height:40, borderRadius:"50%", border:`1px solid ${C.g2}`, background:C.w, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:C.navy, transition:"all .2s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.g1} onMouseLeave={e=>e.currentTarget.style.background=C.w}>←</button>
            <button onClick={next} style={{ width:40, height:40, borderRadius:"50%", border:"none", background:C.navy, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", transition:"all .2s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.navyL} onMouseLeave={e=>e.currentTarget.style.background=C.navy}>→</button>
          </div>
        </div></FI>

        <div style={{ position:"relative", overflow:"hidden", borderRadius:20, border:`1px solid ${C.g2}`, background:C.warm }}>
          <div key={idx} style={{ padding:"40px 36px", animation:"slideIn .4s ease" }}>
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, padding:"4px 14px", borderRadius:20, background:C.goldP, color:C.navy, fontWeight:600 }}>{a.cat}</span>
              <span style={{ fontSize:12, padding:"4px 14px", borderRadius:20, background:C.g1, color:C.g6 }}>{a.period}</span>
            </div>
            <h3 style={{ fontSize:24, fontWeight:700, color:C.navy, marginBottom:16, lineHeight:1.4 }}>{a.t}</h3>
            <p style={{ fontSize:15, color:C.g6, lineHeight:1.8, marginBottom:24, whiteSpace:"pre-line", maxWidth:700 }}>{a.d}</p>
            {a.stats.length > 0 && (
              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                {a.stats.map(([k,v],j) => (
                  <div key={j} style={{ padding:"16px 24px", background:C.w, borderRadius:12, border:`1px solid ${C.g2}`, minWidth:140 }}>
                    <div style={{ fontSize:12, color:C.gold, fontWeight:600, marginBottom:4 }}>{k}</div>
                    <div style={{ fontSize:18, fontWeight:700, color:C.navy }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 하단 인디케이터 */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
          {ACTIVITIES.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)}
              style={{ width: idx===i ? 24 : 8, height:8, borderRadius:4,
                background: idx===i ? C.navy : C.g2, cursor:"pointer", transition:"all .3s" }} />
          ))}
        </div>

        <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
      </Box>
    </Sec>
  );
};

/* ═══ INSTAGRAM SECTION ═══ */
const InstagramSection = () => (
  <Sec bg={C.g1} style={{padding:"64px 0"}}>
    <Box>
      <FI><div style={{textAlign:"center",marginBottom:40}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:16}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill={C.navy} stroke="none"/></svg>
          <span style={{fontSize:"clamp(24px,4vw,32px)",fontWeight:700,color:C.g8}}>@thenile_pacer</span>
        </div>
        <p style={{fontSize:15,color:C.g6}}>인스타그램에서도 더나일의 소식을 만나보세요 :)</p>
      </div></FI>

      {/* Elfsight 위젯 영역 — elfsight.com 에서 무료 위젯 생성 후 아래 주석을 교체하세요 */}
      {/* <div className="elfsight-app-YOUR-APP-ID-HERE" /> */}

      <FI delay={.15}><div style={{textAlign:"center",padding:48,background:C.w,borderRadius:20,border:`1px solid ${C.g2}`,maxWidth:700,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff" stroke="none"/></svg>
          </div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:16,fontWeight:700,color:C.navy}}>thenile_pacer</div>
            <div style={{fontSize:12,color:C.g4}}>사단법인 더나일</div>
          </div>
        </div>
        <p style={{fontSize:14,color:C.g6,lineHeight:1.8,marginBottom:24}}>인스타그램 피드를 실시간으로 연동하려면<br/><a href="https://elfsight.com/instagram-feed-instashow/" target="_blank" rel="noopener noreferrer" style={{color:C.navy,fontWeight:600,textDecoration:"underline"}}>Elfsight 무료 위젯</a>을 생성 후 코드에 app-id를 추가하면 됩니다.</p>
        <a href="https://www.instagram.com/thenile_pacer/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 32px",borderRadius:50,background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            인스타그램에서 보기
          </div>
        </a>
      </div></FI>
    </Box>
  </Sec>
);

/* ═══ VISION FLIP CARDS ═══ */
const VisionCards = () => {
  const [flipped, setFlipped] = useState(-1);
  const toggle = i => setFlipped(f => f === i ? -1 : i);
  const visions = [
    {n:"01",t:"부모의 일상이 매일의 성장이 됩니다",d:"더나일은 양육이 단순한 의무가 아니라, 부모 스스로가 매일 성장하는 과정이라고 믿습니다. 전문 심리상담과 부모교육을 통해 부모가 자신의 가능성을 발견하고, 일상 속에서 성장의 기쁨을 경험할 수 있도록 지원합니다."},
    {n:"02",t:"양육에 대한 냉소를 다정함으로 바꿉니다",d:"가족을 향한 냉소적인 시선이 사회 전반에 퍼져 있습니다. 더나일은 양육에 대한 부정적 인식을 신뢰와 환대의 문화로 전환하고, 부모가 서로 연결되고 지지받는 따뜻한 커뮤니티를 만들어갑니다."},
    {n:"03",t:"양육의 즐거움을 사회와 공유합니다",d:"건강하게 성장한 부모들이 모여 사회적 문화를 함께 바꾸어 나갑니다. 더나일은 양육의 긍정적 경험과 가치를 사회와 나누며, 다음 세대가 더 나은 세상에서 자랄 수 있도록 환경을 만들어갑니다."},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,marginTop:16}}>
      {visions.map((v,i)=>(
        <FI key={i} delay={i*.1}>
          <div onClick={()=>toggle(i)} style={{perspective:800,cursor:"pointer"}}>
            <div style={{position:"relative",width:"100%",minHeight:180,transition:"transform .6s",transformStyle:"preserve-3d",transform:flipped===i?"rotateY(180deg)":"rotateY(0)"}}>
              {/* 앞면 */}
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",padding:28,background:C.warm,borderRadius:16,border:`1px solid ${C.g2}`,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.gold,marginBottom:12}}>Vision {v.n}</div>
                <h3 style={{fontSize:17,fontWeight:700,color:C.navy,lineHeight:1.5}}>{v.t}</h3>
                <div style={{fontSize:11,color:C.g4,marginTop:12}}>클릭하여 자세히 보기</div>
              </div>
              {/* 뒷면 */}
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",padding:28,background:C.navy,borderRadius:16,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:C.gold,marginBottom:12}}>Vision {v.n}</div>
                <p style={{fontSize:14,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>{v.d}</p>
              </div>
            </div>
          </div>
        </FI>
      ))}
    </div>
  );
};

/* ═══ HERO BANNER ═══ */
const BANNER_IMAGES = ["/images/banner/1.jpg","/images/banner/2.jpg","/images/banner/3.jpg","/images/banner/4.jpg","/images/banner/5.jpg","/images/banner/6.jpg","/images/banner/7.jpg"];

const HeroBanner = ({go}) => {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCur(c => (c + 1) % BANNER_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden",background:C.navy}}>
      {/* 배경 이미지 롤링 */}
      {BANNER_IMAGES.map((src, i) => (
        <div key={i} style={{
          position:"absolute",inset:0,
          backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center",
          opacity: cur === i ? 1 : 0,
          transition:"opacity 1.5s ease-in-out",
          transform: cur === i ? "scale(1.05)" : "scale(1)",
        }}/>
      ))}
      {/* 어두운 오버레이 */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, rgba(27,42,74,.75) 0%, rgba(27,42,74,.6) 50%, rgba(45,74,122,.65) 100%)",zIndex:1}}/>
      {/* 하단 그라데이션 */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(to top, rgba(27,42,74,.9), transparent)",zIndex:1}}/>
      {/* 콘텐츠 */}
      <Box style={{position:"relative",zIndex:2}}>
        <FI><div style={{fontSize:14,color:C.gold,letterSpacing:3,marginBottom:24,fontWeight:500}}>사단법인 더나일 · Nurtuning Into Light Everyday</div></FI>
        <FI delay={.2}><h1 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,color:"#fff",lineHeight:1.4,marginBottom:24,maxWidth:600,textShadow:"0 2px 20px rgba(0,0,0,.3)"}}>부모됨의 두려움이<br/><span style={{color:C.gold}}>기쁨</span>으로 전환되는<br/>여정을 함께 합니다</h1></FI>
        <FI delay={.4}><p style={{fontSize:17,color:"rgba(255,255,255,.8)",lineHeight:1.8,maxWidth:480,marginBottom:40}}>Parenthood : From dread to delight</p></FI>
        <FI delay={.6}><div style={{display:"flex",gap:16,flexWrap:"wrap"}}><BG onClick={()=>go("parentscan")}>양육불안검사 하기</BG><Btn primary={false} onClick={()=>go("about")} style={{borderColor:"rgba(255,255,255,.4)",color:"#fff"}}>더나일 알아보기</Btn></div></FI>
      </Box>
      {/* 인디케이터 */}
      <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:2,display:"flex",gap:8}}>
        {BANNER_IMAGES.map((_,i)=>(
          <div key={i} onClick={()=>setCur(i)} style={{width:cur===i?24:8,height:8,borderRadius:4,background:cur===i?"#fff":"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .4s"}}/>
        ))}
      </div>
      <style>{`section img{animation:none}`}</style>
    </section>
  );
};

/* ═══ HOME ═══ */
const HomePage=({go})=>(<>
  {/* HERO */}
  <HeroBanner go={go} />

  {/* MISSION & VISION — p.2 원문 */}
  <Sec bg={C.w}>
    <Box>
      <div style={{textAlign:"center",maxWidth:800,margin:"0 auto"}}>
        <FI><Tag>MISSION</Tag></FI>
        <FI delay={.1}><h2 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:700,color:C.navy,lineHeight:1.5,marginBottom:16}}>부모됨의 두려움이 기쁨으로 전환되는<br/>여정을 함께 합니다</h2></FI>
        <FI delay={.2}><p style={{fontSize:17,color:C.navyL,marginBottom:48,fontStyle:"italic"}}>Parenthood : From dread to delight</p></FI>
        <FI delay={.3}><Tag>VISION</Tag></FI>
        <FI delay={.35}>
          <VisionCards />
        </FI>
        <FI delay={.5}><p style={{fontSize:13,color:C.g4,marginTop:32}}>서울특별시 산하 비영리법인 / 기획재정부 지정 지정기부금 단체</p></FI>
      </div>
    </Box>
  </Sec>

  {/* 더나일은 믿고있습니다 — p.4 원문 */}
  <Sec bg={C.navy} style={{padding:"64px 0"}}>
    <Box style={{textAlign:"center"}}>
      <FI><H2 light style={{fontSize:"clamp(22px,3.5vw,32px)",maxWidth:700,margin:"0 auto 16px"}}>더나일은 믿고있습니다.</H2></FI>
      <FI delay={.15}><p style={{fontSize:16,color:"rgba(255,255,255,.7)",lineHeight:1.9,maxWidth:600,margin:"0 auto"}}>건강한 양육의 방식으로 자라난 아이들이 많아져야<br/>미래세대의 아이들이 살아갈 세상도 건강해질 수 있습니다</p></FI>
      <FI delay={.3}><p style={{fontSize:17,color:C.gold,lineHeight:1.8,maxWidth:600,margin:"24px auto 0",fontWeight:600}}>다음 세대가 살아갈 세상이 지금보다 더 나아지는 것에 대한 해답은<br/>바로 부모됨의 여정이 행복해지는 것입니다</p></FI>
    </Box>
  </Sec>

  {/* 이사장의 한마디 — Mission Statement p.3 원문 */}
  <Sec bg={C.warm}>
    <Box>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48,alignItems:"center"}}>
        <FI><div style={{textAlign:"center"}}>
          <img src="/images/이다랑.jpg" alt="이다랑 이사장" style={{width:"100%",maxWidth:320,borderRadius:20,margin:"0 auto 20px",objectFit:"cover",display:"block",boxShadow:"0 8px 32px rgba(27,42,74,.12)"}}/>
          <div style={{fontSize:20,fontWeight:700,color:C.navy}}>이다랑 이사장</div>
          <div style={{fontSize:13,color:C.gold,fontWeight:600,marginTop:4}}>아동심리전문가</div>
          <div style={{fontSize:12,color:C.g4,marginTop:8,lineHeight:1.6}}>아동학 학사 / 발달심리학 석사<br/>아동심리박사과정 / (주)그로잉맘 창업자</div>
        </div></FI>
        <FI delay={.2}><div>
          <Tag>Mission Statement</Tag>
          <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:22,fontWeight:700,color:C.navy,lineHeight:1.7,marginBottom:24,borderLeft:`4px solid ${C.gold}`,paddingLeft:24}}>
            "더나일은 건강하고 기쁜 '부모됨'에 집중합니다."
          </div>
          <p style={{fontSize:15,color:C.g6,lineHeight:1.9,marginBottom:16}}>오늘의 부모들은 넘쳐나는 정보와 높아진 기준 앞에서 오히려 더 불안하고, 더 외롭습니다. 가족을 향한 냉소적인 시선은 사회 전반에 퍼져 있고, 양육 불안은 부모가 자신의 가능성을 보지 못하게 합니다. 그 결과, 부모됨이 주는 기쁨은 가려지고 두려움이 가득해졌습니다.</p>
          <p style={{fontSize:15,color:C.g6,lineHeight:1.9,marginBottom:16}}>더나일은 이 문제를 정면으로 바라봅니다. 그리고 이 시대에 필요한 건강하고 균형 잡힌 부모상을 사회의 새로운 기준으로 만들어 가고자 합니다. 가족을 바라보는 냉소적인 시선을 신뢰와 환대로 바꾸고, 부모 개개인이 자신 안에 이미 가진 자원을 발견하여 양육의 효능감을 회복하며, 그렇게 변화된 부모들이 모여 사회적 문화를 함께 바꾸어 나가기를 기대합니다.</p>
          <p style={{fontSize:15,color:C.navy,lineHeight:1.9,fontWeight:600}}>부모됨이 가진 기쁨을 회복하는 것— 그것이 더 나은 다음 세대를 만드는 가장 근본적인 힘입니다.</p>
        </div></FI>
      </div>
    </Box>
  </Sec>

  {/* 우리가 바라보는 현실 — 미션/비전 연결형 서사 */}
  <Sec bg={C.w}>
    <Box>
      <FI><Tag>부모됨의 두려움</Tag></FI>
      <FI delay={.1}><H2>부모됨의 두려움은 우리가 꼭 해결해야 할{"\n"}사회적 현상입니다</H2></FI>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20,marginTop:32}}>
        {[
          {t:"양육에 대한 냉소적 시선",d:"가족을 향한 냉소적인 시선이 사회 전반에 퍼져 있습니다."},
          {t:"양육으로 인한 고립감",d:"도움을 요청하기 어려운 환경 속에서 부모는 고립됩니다."},
          {t:"지식과 정서돌봄의 부족",d:"부모의 마음을 돌봐주는 전문적 지원이 극히 부족합니다."},
          {t:"정책과 인프라의 부족",d:"부모를 위한 정책과 인프라가 현장의 필요를 따라가지 못합니다."},
        ].map((x,i)=>(
          <FI key={i} delay={i*.1}><div style={{padding:24,background:C.warm,borderRadius:16,border:`1px solid ${C.g2}`}}>
            <h3 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:8}}>{x.t}</h3>
            <p style={{fontSize:13,color:C.g6,lineHeight:1.6}}>{x.d}</p>
          </div></FI>
        ))}
      </div>
    </Box>
  </Sec>

  {/* 더나일의 접근 — 4개 축을 비전→실행 서사로 */}
  <Sec bg={C.warm}>
    <Box>
      <FI><div style={{textAlign:"center",marginBottom:16}}>
        <Tag>더나일의 접근</Tag>
        <H2>냉소를 다정함으로,<br/>두려움을 기쁨으로</H2>
        <p style={{fontSize:15,color:C.g6,maxWidth:600,margin:"0 auto",lineHeight:1.8}}>더나일은 4개의 축으로 부모됨의 여정 전체를 지원합니다. 부모 개개인의 마음돌봄에서 시작해, 연결을 만들고, 문화를 바꾸고, 구조를 바꿉니다.</p>
      </div></FI>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20,marginTop:32}}>
        {[
          {n:"01",t:"마음돌봄",d:"부모와 아동의 심리적 건강측정 전문적 개입",icon:"🤲"},
          {n:"02",t:"관계의 연결",d:"양육친화적인 문화와 심리적 공감대 조성",icon:"🔗"},
          {n:"03",t:"양육문화 개선",d:"정서적 유대감 및 사회적 지지망 강화",icon:"🌱"},
          {n:"04",t:"환경/구조",d:"제도적 변화를 이끄는 정책 옹호활동",icon:"🏛"},
        ].map((x,i)=>(
          <FI key={i} delay={i*.12} style={{cursor:"pointer"}} onClick={()=>go("programs")}>
            <div style={{padding:28,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,textAlign:"center",transition:"all .3s",height:"100%"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(27,42,74,.1)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="none"}}>
              <div style={{fontSize:28,marginBottom:8}}>{x.icon}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.gold,marginBottom:4}}>{x.n}</div>
              <h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>{x.t}</h3>
              <p style={{fontSize:13,color:C.g6,lineHeight:1.6}}>{x.d}</p>
            </div>
          </FI>
        ))}
      </div>
      <FI delay={.5}><p style={{textAlign:"center",marginTop:32,fontSize:14,color:C.g4}}>4개의 목표에 맞는 사업운영 및 임팩트 측정</p></FI>
    </Box>
  </Sec>

  {/* 2025 주요 활동 — 슬라이드 (PDF p.7~12 전체) */}
  <ActivitySlider />

  {/* 이사진 — p.19 원문 그대로 */}
  <Sec bg={C.warm}>
    <Box>
      <FI><div style={{textAlign:"center",marginBottom:48}}><Tag>이사진</Tag><H2>주요 이사진</H2></div></FI>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:20}}>
        {[
          {name:"이혜린 이사",img:"/images/이혜린.jpg",lines:["(현) 쉬벤처스 부대표","(전) 그로잉맘 부대표","부모교육전문가,","청소년상담사,","비즈니스 빌더"]},
          {name:"정우열 이사",img:"/images/정우열.jpg",lines:["정신과 전문의","생각과 느낌 원장","2016년 여성가족부장관표창","2017년 국무총리표창"]},
          {name:"김혜민 이사",img:"/images/김혜민.jpg",lines:["(전) YTN 라디오PD","극동방송 아나운서","한국자살예방협회","홍보 및 대외협력위원","국무총리표창"]},
          {name:"박장원 이사",img:"/images/변장원.jpg",lines:["정책학 박사","(전공: 필란트로피)","(전) 국가균형발전","위원회 정책홍보팀장"]},
          {name:"김혜진 이사",img:"/images/김혜진.jpg",lines:["(전) 실리콘밸리 글로벌 IT 기업 근무","(Roblox, Myriad Genetics, Counsyl 등)","저서 「실리콘밸리를 그리다」(공저)","커리어 코치 및 글로벌 조직문화 강연자"]},
        ].map((m,i)=>(
          <FI key={i} delay={i*.08}>
            <div style={{textAlign:"center",padding:20,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%"}}>
              {m.img ? <img src={m.img} alt={m.name} style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",objectFit:"cover",display:"block",border:`3px solid ${C.goldL}`}}/> : <div style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",background:`linear-gradient(135deg,${C.goldP},${C.g1})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,color:C.navy}}>{m.name[0]}</div>}
              <div style={{fontSize:15,fontWeight:600,color:C.navy,marginBottom:8}}>{m.name}</div>
              {m.lines.map((l,j)=><div key={j} style={{fontSize:12,color:C.g4,lineHeight:1.5}}>{l}</div>)}
            </div>
          </FI>
        ))}
      </div>
    </Box>
  </Sec>

  {/* 함께하는 기관 */}
  <Sec bg={C.w}>
    <Box>
      <FI><div style={{textAlign:"center"}}><Tag>함께하는 기관</Tag><H2>함께하는 기관</H2></div></FI>
      <FI delay={.2}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:16,marginTop:40}}>
        {[
          "/images/partners/seoul.png","/images/partners/emart.png","/images/partners/swff.png",
          "/images/partners/swu.png","/images/partners/korea-univ.png","/images/partners/sheventures.webp",
          "/images/partners/moomooz.jpg","/images/partners/seongdong.png","/images/partners/heyground.png",
          "/images/partners/yonsei.jpg","/images/partners/bicycle.png","/images/partners/yeongdeungpo.jpeg",
          "/images/partners/takeroot.avif","/images/partners/nts.png","/images/partners/navita.jpg",
        ].map((src,i)=>(
          <div key={i} style={{padding:20,background:C.w,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",minHeight:100,transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 16px rgba(27,42,74,.08)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="none"}}>
            <img src={src} alt="" style={{maxHeight:56,maxWidth:130,objectFit:"contain"}} onError={e=>{e.target.style.display="none"}}/>
          </div>
        ))}
      </div></FI>
    </Box>
  </Sec>

  {/* 더나일 특장점 — p.22 원문 */}
  <Sec bg={C.warm}>
    <Box>
      <FI><H2>더나일은 기존과 다른 시선으로 빠른 실행을 통해 가족의 문제를 해결합니다</H2></FI>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:20,marginTop:32}}>
        {[
          {t:"#기술력",d:"시스템적 사고를 통해 임팩트의 확산을 고민합니다."},
          {t:"#새로운 시도와 창의력",d:"열린 사고와 객관적 시선으로 새로운 접근을 추구합니다."},
          {t:"#빠른 실행-가설 검증",d:"스타트업의 속도로 빠르게 문제 해결에 도달합니다."},
          {t:"#높은 전문성",d:"임상현장 15년차 이상의 공인된 전문가들 입니다."},
          {t:"#대상에 대한 치열한 고민",d:'문제를 "진짜" 해결하기 위해 대상을 향한 깊은 고민합니다.'},
        ].map((x,i)=>(
          <FI key={i} delay={i*.1}><div style={{padding:24,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,textAlign:"center",height:"100%"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.gold,marginBottom:8}}>{x.t}</div>
            <p style={{fontSize:13,color:C.g6,lineHeight:1.6}}>{x.d}</p>
          </div></FI>
        ))}
      </div>
    </Box>
  </Sec>

  {/* 후원 CTA */}
  <Sec bg={C.navy}>
    <Box style={{textAlign:"center"}}>
      <FI><Tag color={C.gold}>페이서 PACER</Tag></FI>
      <FI delay={.1}><H2 light style={{maxWidth:500,margin:"0 auto 16px"}}>부모됨의 여정을<br/>함께 걸어주세요</H2></FI>
      <FI delay={.2}><p style={{fontSize:16,color:"rgba(255,255,255,.6)",lineHeight:1.8,maxWidth:520,margin:"0 auto 40px"}}>우리는 후원자를 페이서라고 부릅니다. 페이서는 [함께 걷는 사람들] 이라는 뜻을 가지고 있지요. [페이서] 는 더 나은 사회를 위해 가족의 가치가 회복되어야 한다는 것에 동의하며 함께 힘을 모으는 사람들입니다.</p></FI>
      <FI delay={.3}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}><BG onClick={()=>window.open("https://link.donationbox.co.kr/donationBoxJoin.jsp?campaignuid=1FuNiwn6W6","_blank")}>페이서 되기</BG><Btn primary={false} onClick={()=>go("contact")} style={{borderColor:"rgba(255,255,255,.3)",color:"#fff"}}>사업 및 협력 문의</Btn></div></FI>
    </Box>
  </Sec>

  {/* 인스타그램 */}
  <InstagramSection />
</>);

/* ═══ ABOUT ═══ */
const AboutPage=({go})=>(<>
  <section style={{paddingTop:120,paddingBottom:80,background:C.warm}}><Box>
    <FI><Tag>더나일 소개</Tag></FI>
    <FI delay={.1}><H2>The NILE · Nurtuning Into Light Everyday</H2></FI>
    <FI delay={.2}><Desc>서울특별시 산하 비영리법인 / 기획재정부 지정 지정기부금 단체</Desc></FI>
  </Box></section>

  <Sec bg={C.w}><Box>
    <FI><Tag>MISSION</Tag></FI>
    <FI delay={.1}><H2>부모됨의 두려움이 기쁨으로 전환되는 여정을 함께 합니다</H2></FI>
    <FI delay={.15}><p style={{fontSize:16,color:C.g6,marginBottom:24}}>Parenthood : From dread to delight</p></FI>
    <FI delay={.2}><div style={{marginBottom:40}}>
      <Tag>VISION</Tag>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
        {["부모의 일상이 매일의 성장이 됩니다","양육에 대한 냉소를 다정함으로 바꿉니다","양육의 즐거움을 사회와 공유합니다"].map((v,i)=>(
          <div key={i} style={{padding:24,background:C.warm,borderRadius:16}}><div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:2,marginBottom:8}}>Vision 0{i+1}</div><h3 style={{fontSize:17,fontWeight:700,color:C.navy}}>{v}</h3></div>
        ))}
      </div>
    </div></FI>
  </Box></Sec>

  <Sec bg={C.warm}><Box>
    <FI><Tag>설립목적</Tag></FI>
    <FI delay={.1}><p style={{fontSize:15,color:C.g6,lineHeight:1.9,maxWidth:800,marginBottom:40,wordBreak:"keep-all"}}>본 법인은 가족구성원의 정서적·사회적 가치의 회복이라는 가치 아래 다양한 가족 구성원들이 건강한 개인이자 가족의 일원으로 성장할 수 있도록 다양한 서비스와 기회를 제공한다. 이를 통하여 각각의 구성원의 심리·사회적 기능이 원활하게 수행되어 건강한 사회를 조성함을 목적으로 한다.</p></FI>

    <FI delay={.2}><Tag>주된사업</Tag></FI>
    <FI delay={.25}><div style={{marginBottom:40}}>
      {["부모의 건강한 양육관 조성을 위한 전문가 자문 및 교육프로그램 운영","건강한 양육환경 조성을 위한 컨퍼런스 개최","부모교육 프로그램 개발 및 콘텐츠 개발","기타 법인의 목적을 수행하기 위한 사업"].map((item,i)=>(
        <div key={i} style={{fontSize:14,color:C.g6,padding:"8px 0",display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.6}}><Dot/><span>{item}</span></div>
      ))}
    </div></FI>

    <FI delay={.3}><Tag>단체연혁</Tag></FI>
    <FI delay={.35}><div style={{position:"relative",paddingLeft:24}}>
      <div style={{position:"absolute",left:6,top:8,bottom:8,width:2,background:C.g2}}/>
      {[
        {y:"2023",items:["11월  더나일 창립 멤버 구성 (발기인 이다랑)"]},
        {y:"2024",items:["8월  사단법인 더나일 설립을 위한 창립총회 개최","9월  사단법인 더나일 설립허가 (서울특별시)","12월  지정기부금 단체 지정 (국세청)"]},
        {y:"2025",items:["3월  영등포구 양성평등기금 지원사업 '아빠와 함께하는 원팀육아' 수행","5월  성동구 ESG 공모사업 '리커넥트' 장애아동 가족 지원사업 수행","6월  ㈜이마트 CSR 사업 '우리동네 아이케어' 전국 문화센터 부모교육 운영","9월  서울여성가족재단 토크콘서트 '양성평등한 오늘, 자라는 내일' 개최","11월  국회 저출생·축소사회 대응포럼 정책간담회 참여 및 토크콘서트 주관"]},
      ].map((group,gi)=>(
        <div key={gi} style={{marginBottom:24}}>
          <div style={{position:"relative",marginBottom:12}}>
            <div style={{position:"absolute",left:-21,top:4,width:12,height:12,borderRadius:"50%",background:C.gold}}/>
            <div style={{fontSize:18,fontWeight:700,color:C.navy,paddingLeft:4}}>{group.y}</div>
          </div>
          {group.items.map((item,i)=>(
            <div key={i} style={{fontSize:14,color:C.g6,padding:"6px 0 6px 4px",lineHeight:1.6}}>{item}</div>
          ))}
        </div>
      ))}
    </div></FI>
  </Box></Sec>

  {/* 이다랑 이사장 — p.18 원문 */}
  <Sec bg={C.w}><Box>
    <FI><Tag>이다랑 이사장</Tag></FI>
    <FI delay={.1}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48,alignItems:"start",marginTop:16}}>
      <div style={{textAlign:"center",position:"sticky",top:100}}>
        <img src="/images/이다랑.jpg" alt="이다랑 이사장" style={{width:"100%",maxWidth:280,borderRadius:20,margin:"0 auto 20px",objectFit:"cover",display:"block",boxShadow:"0 8px 32px rgba(27,42,74,.12)"}}/>
        <div style={{fontSize:24,fontWeight:700,color:C.navy}}>이다랑</div>
        <div style={{fontSize:14,color:C.g6,marginTop:4}}>아동학 학사 / 발달심리학 석사 / 아동심리박사과정<br/>(주)그로잉맘 창업자 / 아동심리전문가</div>
      </div>
      <div>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:12,color:C.gold,fontWeight:600,letterSpacing:2,marginBottom:12}}>주요 저서</div>
          {["아이 마음에 상처주지 않는 습관(길벗)","불안이 많은 아이 (한빛)","초등저학년, 아이의 사회성이 자라납니다(아울북)","내 아이를 위한 심플 육아(RHK)","육아 말고 뭐라도(세종)"].map((b,j)=><div key={j} style={{fontSize:14,color:C.g6,padding:"5px 0",display:"flex",alignItems:"center",gap:8}}><Dot/>{b}</div>)}
        </div>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:12,color:C.gold,fontWeight:600,letterSpacing:2,marginBottom:12}}>주요 활동</div>
          {["NAVER 육아 공식 인플루언서","세바시 / SBS 스페셜 '스마트폰 전쟁' / KT 키즈랜드 등 출연","WEE매거진 / 맘앤앙팡 / 중앙:헬로페어런츠 / 여성신문 기고","포스코 / 구글코리아 / 스타벅스 / 삼천리 등 기업 출강","신세계 / 롯데 / 현대백화점 주요 문화센터 출강","NIA 디지털페어런팅 / 육아정책연구소 교육 프로그램 개발"].map((b,j)=><div key={j} style={{fontSize:14,color:C.g6,padding:"5px 0",display:"flex",alignItems:"flex-start",gap:8}}><Dot/>{b}</div>)}
        </div>
        <div style={{fontSize:13,color:C.g4,lineHeight:1.6}}>전) 한국청소년상담복지개발원 상담사 | 전) 한국RT센터 전문 강사 및 치료사 | 전) 마음더하기상담센터, 구리시·서초구 상담센터 상담사</div>
      </div>
    </div></FI>
  </Box></Sec>

  {/* 이사진 — p.19 원문 */}
  <Sec bg={C.warm}><Box>
    <FI><Tag>이사진</Tag></FI>
    <FI delay={.1}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:20,marginTop:16}}>
      {[
        {name:"이혜린 이사",img:"/images/이혜린.jpg",lines:["(현) 쉬벤처스 부대표","(전) 그로잉맘 부대표","부모교육전문가,","청소년상담사,","비즈니스 빌더"]},
        {name:"정우열 이사",img:"/images/정우열.jpg",lines:["정신과 전문의","생각과 느낌 원장","2016년 여성가족부장관표창","2017년 국무총리표창"]},
        {name:"김혜민 이사",img:"/images/김혜민.jpg",lines:["(전) YTN 라디오PD","극동방송 아나운서","한국자살예방협회","홍보 및 대외협력위원","국무총리표창"]},
        {name:"박장원 이사",img:"/images/변장원.jpg",lines:["정책학 박사","(전공: 필란트로피)","(전) 국가균형발전","위원회 정책홍보팀장"]},
        {name:"김혜진 이사",img:"/images/김혜진.jpg",lines:["(전) 실리콘밸리 글로벌 IT 기업 근무","(Roblox, Myriad Genetics, Counsyl 등)","저서 「실리콘밸리를 그리다」(공저)","커리어 코치 및 글로벌 조직문화 강연자"]},
      ].map((m,i)=>(
        <FI key={i} delay={i*.08}><div style={{textAlign:"center",padding:20,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%"}}>
          {m.img ? <img src={m.img} alt={m.name} style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",objectFit:"cover",display:"block",border:`3px solid ${C.goldL}`}}/> : <div style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",background:`linear-gradient(135deg,${C.goldP},${C.g1})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,color:C.navy}}>{m.name[0]}</div>}
          <div style={{fontSize:15,fontWeight:600,color:C.navy,marginBottom:8}}>{m.name}</div>
          {m.lines.map((l,j)=><div key={j} style={{fontSize:12,color:C.g4,lineHeight:1.5}}>{l}</div>)}
        </div></FI>
      ))}
    </div></FI>
  </Box></Sec>
</>);

/* ═══ PROGRAMS ═══ */
const ProgramsPage=()=>{
  const[tab,setTab]=useState(0);
  const tabs=["전체","지방보조금 사업","기타사업 (수탁 등)","2026 계획"];

  const govProjects=[
    {name:"양성평등 돌봄문화 확산을 위한 부모학교 – 아빠와 함께하는 원팀육아",period:"2025.04 ~ 2025.09",target:"영유아 부모",content:["예비부모 온라인 교육(BBH 프로그램)","영아기 부모 온라인 교육(Happy Parents)"],org:"영등포구",cat:"성장추구",imgDir:"01-원팀육아"},
    {name:"ESG 공모사업 <리커넥트> 장애아동 가족 지원",period:"2025.05 ~ 2025.12",target:"장애아동 가족",content:["장애아동 가족 심리/정서 지원 (심리상담 138회)","힐링캠프 운영 (만족도 4.9점)"],org:"성동구청",cat:"성장추구 · 양육문화",imgDir:"02-리커넥트"},
  ];

  const otherProjects=[
    {name:'CSR <우리동네 아이케어>',period:"2025년",target:"영유아 부모",content:["전국 문화센터(동탄, 천안 등) 12주 완성 부모교육","육아스트레스(PSI) 및 기질(TCI) 검사 및 석박사급 상담","겨울학기까지 진행 완료"],org:"㈜이마트",cat:"성장추구 · 양육문화",imgDir:"03-우리동네아이케어"},
    {name:"정책간담회 및 토크콘서트",period:"2025년",target:"양육 당사자",content:["국회 저출생·축소사회 대응포럼 정책간담회 참여","양육 당사자 160여 명 참여, 실질적 정책 아젠다 제언","일시: 2025년 12월 22일, 국회의원회관 대회의실"],org:"국회 저출생·축소사회 대응포럼",cat:"환경구조 · 양육문화",imgDir:"05-정책간담회"},
    {name:"서울 여성과 가족이 함께하는 토크콘서트",period:"2025년",target:"서울시민",content:["양성평등한 오늘, 자라는 내일 토크콘서트 개최","일시: 2025년 11월 8일(토), 서울시 가족플라자","약 80명 참석"],org:"서울여성가족재단",cat:"양육문화",imgDir:"06-토크콘서트"},
    {name:"위기가정 긴급 양육상담",period:"2025년",target:"위기가정",content:["사별 한부모(아빠 3명, 5회), 이혼/투병 위기 가정 6가구","총 18회기 심층 상담 지원 (공익성/남성 육아 지원 강화)","해외 제3세계 국가 양육 긴급상담 포함 (2명, 4회)"],org:"자체사업",cat:"성장추구",imgDir:"07-위기가정긴급상담"},
    {name:"자체 교육 프로그램 (페이서 교육)",period:"2025년",target:"영유아 부모",content:["온라인 교육: 방학동안 놀이의 비밀, 육아비법, 감정수업 등 5회","오프라인 교육: 어린이 사회성 교육 1회"],org:"자체사업",cat:"양육문화",imgDir:"10-페이서교육"},
    {name:"미디어 활동 및 부모역량강화",period:"2025년",target:"일반 시민",content:["YTN, CBS, 극동방송 라디오 출연","저출생 대책 및 양육 환경 개선 주제 확산"],org:"자체사업",cat:"환경구조",imgDir:"11-미디어활동"},
  ];

  const plan2026=[
    {cat:"성장추구",items:[
      {t:"긴급 부모 양육 상담",d:"대상: 사별, 이혼 소송 중, 저소득층, 아동 학대 의심 가정 등 심리적 위기 상황에 처한 부모 및 아동\n내용: 후원금을 활용한 1:1 긴급 심리 상담 지원, 전문 상담사 연계, 위기 상황별 맞춤형 코칭 제공\n상시 진행"},
      {t:"맘스 키퍼 (Mom's Keeper) 프로젝트",d:"내용: 산후우울 고위험군 조기 발굴 및 자살 예방을 위한 게이트키퍼 양성, 지역 사회 연계 심리 지원 네트워크 구축"},
    ]},
    {cat:"관계의 연결 / 양육문화",items:[
      {t:"양육자 커뮤니티 '페이서(Pacer)' 운영",d:"온/오프라인 양육자 자조 모임 지원, 선배 부모 (리더 페이서) 멘토링 프로그램 운영, 주제별 소모임 (예: 워킹맘, 아빠 육아) 활성화"},
      {t:"양성평등 기금사업 운영 (2026년 상/하반기)",d:""},
      {t:"더나일 양육포럼 - 이 불안 동역되나요",d:"온/오프라인 양육자 대상 육아포럼 진행\n연사들과 함께하는 토크콘서트 / 부모교육 및 자녀대상 프로그램 운영\n온/오프라인 캠페인을 통해 양육 친화적인 사회 분위기 조성"},
    ]},
    {cat:"환경/구조",items:[
      {t:"데이터 분석 및 리포트 발간",d:"상담 및 프로그램 운영을 통해 축적된 데이터를 분석하여 '양육 불안 리포트' 정기 발간, 지자체 및 기업에 맞춤형 양육 지원 솔루션 제안."},
      {t:"부모가 만드는 정책 해커톤 (2026년 하반기)",d:"양육자, 대학생, 개발자, 정책 전문가가 팀을 이뤄 양육 문제 해결을 위한 아이디어 발굴 및 정책/서비스 프로토타입 개발\n해커톤 결과물 및 데이터 분석 리포트를 바탕으로 국회 및 지자체 의회 대상 정책 간담회 개최, 관련 법안 발의 지원 및 조례 제정 촉구 활동"},
    ]},
  ];

  const ProjectImgSlider=({imgDir})=>{
    const imgs=[1,2,3,4,5].map(n=>`/images/projects/${imgDir}/${n}.jpg`);
    const[si,setSi]=useState(0);const[loaded,setLoaded]=useState([]);
    useEffect(()=>{
      const check=[];
      imgs.forEach((src,idx)=>{const img=new Image();img.onload=()=>{check[idx]=true;setLoaded([...check])};img.onerror=()=>{check[idx]=false;setLoaded([...check])};img.src=src});
    },[imgDir]);
    const validImgs=imgs.filter((_,idx)=>loaded[idx]===true);
    if(validImgs.length===0) return(
      <div style={{width:"100%",height:220,background:`linear-gradient(135deg,${C.g1},${C.g2})`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:C.g4,fontSize:13}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        사업 이미지 영역
      </div>
    );
    const idx=si%validImgs.length;
    return(
      <div style={{position:"relative",width:"100%",height:220,overflow:"hidden",background:C.g1}}>
        <img src={validImgs[idx]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity .4s"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(27,42,74,.15)",pointerEvents:"none"}}/>
        {validImgs.length>1&&<>
          <button onClick={e=>{e.stopPropagation();setSi(i=>i===0?validImgs.length-1:i-1)}} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.4)",color:"#fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <button onClick={e=>{e.stopPropagation();setSi(i=>(i+1)%validImgs.length)}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.4)",color:"#fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
          <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
            {validImgs.map((_,di)=><div key={di} onClick={e=>{e.stopPropagation();setSi(di)}} style={{width:idx===di?16:6,height:6,borderRadius:3,background:idx===di?"#fff":"rgba(255,255,255,.5)",cursor:"pointer",transition:"all .3s"}}/>)}
          </div>
        </>}
      </div>
    );
  };

  const ProjectCard=({p,i})=>(
    <FI delay={i*.06}>
      <div style={{background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,marginBottom:16,transition:"all .3s",overflow:"hidden"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.g2}>
        {/* 사업 이미지 슬라이더 */}
        {p.imgDir ? <ProjectImgSlider imgDir={p.imgDir}/> : (
          <div style={{width:"100%",height:220,background:`linear-gradient(135deg,${C.g1},${C.g2})`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:C.g4,fontSize:13}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            사업 이미지 영역
          </div>
        )}
        <div style={{padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
            <h4 style={{fontSize:17,fontWeight:700,color:C.navy,flex:1,minWidth:200}}>{p.name}</h4>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:C.goldP,color:C.navy,fontWeight:600}}>{p.cat}</span>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:C.g1,color:C.g6}}>{p.period}</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
            <div style={{padding:"10px 14px",background:C.warm,borderRadius:8}}><div style={{fontSize:11,color:C.gold,fontWeight:600}}>대상</div><div style={{fontSize:13,color:C.navy,fontWeight:500,marginTop:2}}>{p.target}</div></div>
            <div style={{padding:"10px 14px",background:C.warm,borderRadius:8}}><div style={{fontSize:11,color:C.gold,fontWeight:600}}>협력기관</div><div style={{fontSize:13,color:C.navy,fontWeight:500,marginTop:2}}>{p.org}</div></div>
          </div>
          <div style={{borderTop:`1px solid ${C.g1}`,paddingTop:12}}>
            <div style={{fontSize:11,color:C.gold,fontWeight:600,marginBottom:8}}>주요 내용</div>
            {p.content.map((c,j)=><div key={j} style={{fontSize:13,color:C.g6,padding:"3px 0",display:"flex",alignItems:"flex-start",gap:8,lineHeight:1.5}}><Dot/><span>{c}</span></div>)}
          </div>
        </div>
      </div>
    </FI>
  );

  const allProjects=[...govProjects,...otherProjects];
  const displayProjects = tab===0 ? allProjects : tab===1 ? govProjects : tab===2 ? otherProjects : [];

  return(<>
    <section style={{paddingTop:120,paddingBottom:40,background:C.warm}}><Box>
      <FI><Tag>사업 소개</Tag></FI>
      <FI delay={.1}><H2>더나일이 해온 일들</H2></FI>
      <FI delay={.15}><Desc>더나일은 부모의 마음돌봄에서 시작해, 연결을 만들고, 문화를 바꾸고, 구조를 바꿉니다. 2025년 한 해 동안 아래의 사업들을 수행했습니다.</Desc></FI>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}>
        {tabs.map((t,i)=><div key={i} onClick={()=>setTab(i)} style={{padding:"10px 20px",borderRadius:50,background:tab===i?C.navy:C.w,color:tab===i?"#fff":C.navy,fontSize:13,fontWeight:600,cursor:"pointer",border:`1px solid ${tab===i?C.navy:C.g2}`,transition:"all .3s"}}>{t}</div>)}
      </div>
    </Box></section>

    {tab < 3 ? (
      <Sec bg={C.w}><Box>
        {tab === 0 && <FI><div style={{padding:"16px 20px",background:C.goldP,borderRadius:12,marginBottom:24}}>
          <span style={{fontSize:13,color:C.navy,fontWeight:500}}>전체 {allProjects.length}개 사업  |  지방보조금 {govProjects.length}건  |  기타사업(수탁 등) {otherProjects.length}건</span>
        </div></FI>}

        {tab === 1 && <FI><h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>최근 5년간 지방보조금 지원사항 (사업이력)</h3><p style={{fontSize:14,color:C.g6,marginBottom:24}}>지자체 보조금을 통해 수행한 공공사업입니다.</p></FI>}

        {tab === 2 && <FI><h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>최근 5년간 기타사업 추진실적 (수탁사업 등)</h3><p style={{fontSize:14,color:C.g6,marginBottom:24}}>민간위탁, CSR, 자체사업 등으로 수행한 사업입니다.</p></FI>}

        {displayProjects.map((p,i)=><ProjectCard key={`${tab}-${i}`} p={p} i={i}/>)}
      </Box></Sec>
    ) : (
      <Sec bg={C.w}><Box>
        <FI><h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:24}}>2026년 주요 사업 계획</h3></FI>
        {plan2026.map((sec,si)=>(
          <div key={si} style={{marginBottom:32}}>
            <FI delay={si*.1}><div style={{fontSize:14,fontWeight:600,color:C.gold,letterSpacing:1,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.goldP}`}}>{sec.cat}</div></FI>
            {sec.items.map((p,i)=>(
              <FI key={i} delay={(si*.1)+(i*.08)}>
                <div style={{padding:24,background:C.warm,borderRadius:16,border:`1px solid ${C.g2}`,marginBottom:12}}>
                  <h4 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:8}}>{p.t}</h4>
                  {p.d&&<p style={{fontSize:14,color:C.g6,lineHeight:1.7,whiteSpace:"pre-line"}}>{p.d}</p>}
                </div>
              </FI>
            ))}
          </div>
        ))}
      </Box></Sec>
    )}
  </>);
};

/* ═══ PARENTSCAN — p.13 원문 ═══ */
const ParentscanPage=()=>(<>
  <section style={{paddingTop:120,paddingBottom:80,background:`linear-gradient(180deg,${C.navy} 0%,${C.navyL} 100%)`}}><Box style={{textAlign:"center"}}>
    <FI><Tag color={C.gold}>임팩트 측정</Tag></FI>
    <FI delay={.1}><H2 light>양육불안검사</H2></FI>
    <FI delay={.2}><p style={{fontSize:16,color:"rgba(255,255,255,.7)",lineHeight:1.8,maxWidth:600,margin:"0 auto 16px"}}>자체보유하고 있는 양육불안 척도를 활용하여 임팩트 지표를 지속적으로 측정합니다.</p></FI>
    <FI delay={.25}><p style={{fontSize:15,color:"rgba(255,255,255,.6)",lineHeight:1.8,maxWidth:600,margin:"0 auto 40px"}}>양육불안 척도는 양육자가 느끼는 심리/정서적 불안 수준과 양육자로서의 효능감을 측정할 수 있는 척도입니다. 더나일은 타당도가 확인된 자체 분석도구를 활용하여 누구나 쉽게 온라인으로 검사할 수 있는 시스템을 구축하고 임팩트 지표를 지속적으로 측정하고 관리합니다.</p></FI>
    <FI delay={.3}><BG onClick={()=>window.open("https://www.thenile.kr/parentscan","_blank")} style={{fontSize:17,padding:"18px 48px"}}>검사 시작하기</BG></FI>
  </Box></section>
</>);


/* ═══ PACER — 후원 안내 ═══ */
const DONATE_URL="https://link.donationbox.co.kr/donationBoxJoin.jsp?campaignuid=1FuNiwn6W6";
const PacerPage=()=>(<>
  {/* 히어로 */}
  <section style={{paddingTop:120,paddingBottom:80,background:`linear-gradient(135deg,${C.navy} 0%,${C.navyL} 100%)`}}><Box style={{textAlign:"center"}}>
    <FI><Tag color={C.gold}>PACER · 함께 걷는 사람들</Tag></FI>
    <FI delay={.1}><H2 light style={{fontSize:"clamp(28px,5vw,40px)"}}>오늘의 가족을 변화시키는 일에{"\n"}함께해주세요</H2></FI>
    <FI delay={.2}><p style={{fontSize:16,color:"rgba(255,255,255,.7)",lineHeight:1.9,maxWidth:560,margin:"0 auto",wordBreak:"keep-all"}}>페이서(PACER)란 더 나은 사회를 위해 가족의 가치가 회복되어야 한다는 것에 동의하며 더나일과 함께 걷는 사람들입니다.</p></FI>
    <FI delay={.3}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginTop:32}}>
      <BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{fontSize:17,padding:"18px 48px"}}>후원하기</BG>
    </div></FI>
    <FI delay={.35}><p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:24}}>더나일은 기획재정부 지정 지정기부금단체로 기부금영수증 발급이 가능합니다 (법인/개인)</p></FI>
  </Box></section>

  {/* 더나일은 약속합니다 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:48}}>
      <Tag>OUR PROMISE</Tag>
      <H2>더나일은 약속합니다</H2>
    </div></FI>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
      {[
        {icon:"📋",t:"신뢰로운 전문가의 연대를 통한\n건강한 양육 정보의 제공",d:"가족의 생애주기에 따라 적합한 정보를 제공하고 신뢰로운 전문가들의 POOL을 확대해 나갑니다"},
        {icon:"🤝",t:"건강한 양육관 형성을 위한\n캠페인 및 커뮤니티 형성",d:"더나일을 지지하는 건강한 양육관을 가진 페이서들과 함께 양육의 문화와 가치를 지켜나갑니다"},
        {icon:"🌍",t:"차별과 소외 없이\n모두에게 닿도록",d:"기술을 기반으로 하여 창의적이고 새로운 시도를 통해 임팩트를 확장합니다"},
      ].map((x,i)=>(
        <FI key={i} delay={i*.12}><div style={{padding:32,background:C.warm,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%",textAlign:"center",transition:"all .3s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(27,42,74,.08)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="none"}}>
          <div style={{fontSize:36,marginBottom:16}}>{x.icon}</div>
          <h3 style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:12,lineHeight:1.5,whiteSpace:"pre-line"}}>{x.t}</h3>
          <p style={{fontSize:14,color:C.g6,lineHeight:1.7,wordBreak:"keep-all"}}>{x.d}</p>
        </div></FI>
      ))}
    </div>
  </Box></Sec>

  {/* 주요 사업영역 */}
  <Sec bg={C.warm}><Box>
    <FI><div style={{textAlign:"center",marginBottom:48}}>
      <Tag>BUSINESS AREA</Tag>
      <H2>더나일의 주요 사업영역</H2>
    </div></FI>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
      {[
        {t:"양육문화 바로 세우기",color:"#E8D5B7",items:["건강한 양육 문화의 확산을 위한 포럼 개최","교육/심리 영역의 전문가 네트워킹 구축","관련 법률 및 조례 개정 지원/정책홍보"]},
        {t:"생애주기별 가족교육",color:"#D5E0D5",items:["36개월 초보가정 양육 상담","가족의 변화에 따른 맞춤 서비스","콘텐츠 연구 및 개발"]},
        {t:"위기가족 심리지원",color:"#D5DAE8",items:["사회경제적 취약계층 양육 상담","미혼/청소년부모 양육 상담","재혼/이혼 등 가족 변화 상담"]},
      ].map((x,i)=>(
        <FI key={i} delay={i*.12}><div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${C.g2}`,background:C.w,height:"100%"}}>
          <div style={{background:x.color,padding:"28px 24px",textAlign:"center"}}>
            <h3 style={{fontSize:20,fontWeight:700,color:C.navy}}>{x.t}</h3>
          </div>
          <div style={{padding:24}}>
            {x.items.map((item,j)=><div key={j} style={{fontSize:14,color:C.g6,padding:"8px 0",display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.6}}><Dot/><span>{item}</span></div>)}
          </div>
        </div></FI>
      ))}
    </div>
  </Box></Sec>

  {/* 페이서란 */}
  <Sec bg={C.navy}><Box style={{textAlign:"center"}}>
    <FI><H2 light style={{fontSize:"clamp(24px,4vw,32px)",maxWidth:600,margin:"0 auto 24px"}}>오늘의 가족을 변화시키는 일에{"\n"}함께해주세요</H2></FI>
    <FI delay={.1}><p style={{fontSize:15,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:540,margin:"0 auto",wordBreak:"keep-all"}}>가족의 가치를 회복하는 여정에 건강한 가족 문화를 형성해 나가는 더나일 커뮤니티의 일원으로서 함께합니다.</p></FI>
    <FI delay={.15}><p style={{fontSize:15,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:540,margin:"16px auto 0",wordBreak:"keep-all"}}>가족의 행복한 성장을 함께 공유할 수 있도록 페이서에게도 가족을 위한 다양한 프로그램 참여 기회를 드립니다.</p></FI>
  </Box></Sec>

  {/* 페이서 유형 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:48}}>
      <Tag>페이서 유형</Tag>
      <H2>당신에게 맞는 방식으로{"\n"}함께 걸어주세요</H2>
    </div></FI>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
      {[
        {type:"개인 페이서",sub:"(연간 후원 페이서 기준)",color:C.goldP,intro:"건강한 가족이 되어 또 다른 가족의 회복을 지원합니다.",items:["교육 및 심리지원","컨퍼런스 및 포럼 참여"]},
        {type:"전문가 페이서",sub:"(연간 후원 페이서 기준)",color:C.goldL,intro:"나의 전문성으로 건강한 가족과 사회에 기여합니다.",items:["전문가 네트워킹","사업자문 및 직접참여","컨퍼런스 및 포럼 참여"]},
        {type:"기업 페이서",sub:"(연간 후원 페이서 기준)",color:C.gold,intro:"건강한 사회 뒤에는 건강한 기업이 있습니다.",items:["가족을 위한 사회공헌 사업","사내 가족 지원","컨퍼런스 및 포럼 참여"]},
      ].map((p,i)=>(
        <FI key={i} delay={i*.12}><div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${C.g2}`,background:C.w,height:"100%",display:"flex",flexDirection:"column"}}>
          <div style={{background:p.color,padding:32,textAlign:"center"}}>
            <h3 style={{fontSize:22,fontWeight:700,color:C.navy}}>{p.type}</h3>
            <div style={{fontSize:12,color:C.g6,marginTop:4}}>{p.sub}</div>
          </div>
          <div style={{padding:28,flex:1,display:"flex",flexDirection:"column"}}>
            {p.items.map((b,j)=><div key={j} style={{fontSize:14,color:C.g6,padding:"10px 0",borderBottom:j<p.items.length-1?`1px solid ${C.g1}`:"none",display:"flex",alignItems:"center",gap:10}}><span style={{color:C.gold}}>✔</span>{b}</div>)}
            <p style={{fontSize:13,color:C.navy,fontWeight:500,marginTop:16,lineHeight:1.6,wordBreak:"keep-all"}}>{p.intro}</p>
            <BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{width:"100%",marginTop:"auto",paddingTop:16,textAlign:"center"}}>후원하기</BG>
          </div>
        </div></FI>
      ))}
    </div>
  </Box></Sec>

  {/* 페이서 혜택 */}
  <Sec bg={C.warm}><Box>
    <FI><div style={{textAlign:"center",marginBottom:48}}>
      <Tag>PACER BENEFITS</Tag>
      <H2>페이서들과 함께 걸어갈 수 있도록{"\n"}후원자의 가족까지 함께 성장할 수 있습니다</H2>
    </div></FI>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
      {[
        {emoji:"🎁",t:"우리가족 행복달력",d:"아동심리전문가가 만드는 가족을 위한 Weekly 캘린더"},
        {emoji:"✉️",t:"뉴스레터",d:"더나일과 페이서의 활동내역, 프로그램 등의 프리미엄 정보를 매월 전달드립니다"},
        {emoji:"🎟️",t:"커뮤니티 전용 프로그램",d:"가족의 문제를 해결하기 위해 새롭고 창의적인 시선으로 접근합니다"},
        {emoji:"💬",t:"온라인 상담 및 검사",d:"전문가와 이야기 나눌 수 있는 상담, 다양한 양육자 지원 프로그램 지원"},
        {emoji:"👪",t:"정기 부모 포럼",d:"한 달에 1회 이상 온라인 커뮤니티 세션 (부모교육), 전문가와 함께하는 Q&A 세션 등 우선 참여 가능"},
      ].map((x,i)=>(
        <FI key={i} delay={i*.08}><div style={{padding:24,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%"}}>
          <div style={{fontSize:28,marginBottom:10}}>{x.emoji}</div>
          <h4 style={{fontSize:16,fontWeight:700,color:C.navy,marginBottom:8}}>{x.t}</h4>
          <p style={{fontSize:13,color:C.g6,lineHeight:1.7,wordBreak:"keep-all"}}>{x.d}</p>
        </div></FI>
      ))}
    </div>
  </Box></Sec>

  {/* 월정기 후원 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:12}}>
      <Tag>MONTHLY DONATION</Tag>
      <H2>월정기 후원 페이서 제공 내역</H2>
    </div></FI>
    <FI delay={.1}><p style={{textAlign:"center",fontSize:13,color:C.g4,marginBottom:48}}>기부금 영수증 발급 / 법인 정기후원 가능(별도문의)</p></FI>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
      {[
        {amt:"월 1만원",items:["우리가족 행복달력","정기 뉴스레터","정기 부모포럼 초대"],extra:[]},
        {amt:"월 2만원",items:["우리가족 행복달력","정기 뉴스레터","정기 부모포럼 초대"],extra:["온·오프라인 아동/가족 프로그램 (최대 연 1회 우선 참여)"]},
        {amt:"월 3만원",items:["우리가족 행복달력","정기 뉴스레터","정기 부모포럼 초대"],extra:["온·오프라인 아동/가족 프로그램 (최대 연 2회 우선 참여)","온라인 양육상담 (최대 연 2회)"]},
        {amt:"월 5만원",items:["우리가족 행복달력","정기 뉴스레터","정기 부모포럼 초대"],extra:["온·오프라인 아동/가족 프로그램 (최대 연 3회 우선 참여)","온라인 양육상담 (최대 연 3회)"]},
      ].map((tier,i)=>(
        <FI key={i} delay={i*.08}><div style={{padding:24,background:C.warm,borderRadius:16,border:i===3?`2px solid ${C.gold}`:`1px solid ${C.g2}`,height:"100%",position:"relative"}}>
          {i===3&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:C.gold,color:C.navy,fontSize:11,fontWeight:700,padding:"4px 16px",borderRadius:20}}>추천</div>}
          <div style={{fontSize:13,color:C.gold,fontWeight:700,marginBottom:4}}>🎁 정기 후원</div>
          <div style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:16}}>{tier.amt}</div>
          {tier.items.map((item,j)=><div key={j} style={{fontSize:13,color:C.g6,padding:"4px 0",display:"flex",alignItems:"center",gap:6}}>👉 {item}</div>)}
          {tier.extra.length>0&&<div style={{borderTop:`1px solid ${C.g2}`,marginTop:12,paddingTop:12}}>
            {tier.extra.map((item,j)=><div key={j} style={{fontSize:13,color:C.navy,fontWeight:500,padding:"4px 0",lineHeight:1.5,wordBreak:"keep-all"}}>😍 {item}</div>)}
          </div>}
          <BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{width:"100%",marginTop:16,textAlign:"center",fontSize:13,padding:"10px 20px"}}>후원하기</BG>
        </div></FI>
      ))}
    </div>
  </Box></Sec>

  {/* 이사장 메시지 */}
  <Sec bg={C.warm}><Box>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48,alignItems:"center"}}>
      <FI><div style={{textAlign:"center"}}>
        <img src="/images/이다랑.jpg" alt="이다랑 이사장" style={{width:"100%",maxWidth:280,borderRadius:20,margin:"0 auto",objectFit:"cover",display:"block",boxShadow:"0 8px 32px rgba(27,42,74,.12)"}}/>
      </div></FI>
      <FI delay={.15}><div>
        <Tag>FROM THE CHAIRMAN</Tag>
        <H2 style={{fontSize:"clamp(20px,3.5vw,26px)"}}>안녕하세요,{"\n"}이사장 이다랑입니다.</H2>
        <p style={{fontSize:14,color:C.g6,lineHeight:1.9,marginBottom:16,wordBreak:"keep-all"}}>가족은 한 개인을 가장 안정적으로 성장시킬 수 있는 지지기반이자, 사회의 중요한 구성요소입니다. 심리적으로 안정적인 가족에서 성장한 개인은 좋은 사회구성원이 될 수 있으며, 개개인이 모인 사회 또한 건강해 집니다.</p>
        <p style={{fontSize:14,color:C.g6,lineHeight:1.9,marginBottom:16,wordBreak:"keep-all"}}>하지만 가족이 갖는 가치와 중요성에도 불구하고, 가족을 만들고 유지하는 과정은 많은 사람들에게 부담스럽고 어려운 일이 되고 있습니다. 특히 무분별하게 확산되는 비전문적이고 잘못된 정보들은 양육에 대한 불안을 더욱 강하게 만들고, 불안한 부모의 심리적 상태는 자녀를 양육하는 태도에도 부정적인 영향을 줍니다.</p>
        <p style={{fontSize:14,color:C.g6,lineHeight:1.9,wordBreak:"keep-all"}}>우리는 아이들이 살아갈 미래가 더욱 건강하길 바라는 마음으로 '오늘의 가족'을 바꾸는 일들을 하고자 합니다. 특히 양육취약계층에게 더 많은 지원이 닿을 수 있도록 하여 누구나 소외되지 않고 건강한 가족을 만들 수 있는 기회를 갖도록 하고 싶습니다.</p>
      </div></FI>
    </div>
  </Box></Sec>

  {/* 하단 CTA */}
  <Sec bg={C.navy}><Box style={{textAlign:"center"}}>
    <FI><H2 light style={{fontSize:"clamp(22px,4vw,30px)",maxWidth:560,margin:"0 auto 24px"}}>함께 걸을 날을 기다리고 있습니다</H2></FI>
    <FI delay={.1}><p style={{fontSize:16,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:520,margin:"0 auto 16px",wordBreak:"keep-all"}}>가족의 행복은 사회 전체의 행복으로 이어진다는 사실을 우리 모두는 알고 있습니다.</p></FI>
    <FI delay={.15}><p style={{fontSize:16,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:520,margin:"0 auto 40px",wordBreak:"keep-all"}}>가족을 회복시키고 더 나은 세상을 만들어가는 여정. 더나일과 함께 걸어가는 페이서가 되어주세요.</p></FI>
    <FI delay={.2}><BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{fontSize:17,padding:"18px 48px"}}>지금 후원하기</BG></FI>
  </Box></Sec>
</>);

/* ═══ CONTACT — p.23 원문 ═══ */
const ContactPage=()=>{
  const[form,setForm]=useState({type:"",org:"",name:"",email:"",phone:"",msg:""});
  const[sent,setSent]=useState(false);
  const handleSubmit=()=>{
    if(!form.name||!form.email||!form.msg){alert("담당자명, 이메일, 문의 내용은 필수 항목입니다.");return;}
    const subject=encodeURIComponent(`[더나일 협력문의] ${form.type||"기타"} - ${form.org||"개인"}`);
    const body=encodeURIComponent(`문의 유형: ${form.type||"기타"}\n기관/회사명: ${form.org||"-"}\n담당자명: ${form.name}\n이메일: ${form.email}\n연락처: ${form.phone||"-"}\n\n문의 내용:\n${form.msg}`);
    window.open(`mailto:cross@thenile.kr?subject=${subject}&body=${body}`);
    setSent(true);
  };
  if(sent) return(<>
    <section style={{paddingTop:120,paddingBottom:80,background:C.warm,minHeight:"60vh",display:"flex",alignItems:"center"}}><Box style={{textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:24}}>✉️</div>
      <H2>문의가 전송되었습니다</H2>
      <p style={{fontSize:16,color:C.g6,lineHeight:1.8,marginTop:16}}>이메일 앱에서 전송을 완료해주세요.<br/>빠른 시일 내에 답변 드리겠습니다.</p>
      <div style={{marginTop:32}}><Btn onClick={()=>{setSent(false);setForm({type:"",org:"",name:"",email:"",phone:"",msg:""});}}>새 문의 작성</Btn></div>
    </Box></section>
  </>);
  return(<>
    <section style={{paddingTop:120,paddingBottom:80,background:C.warm}}><Box>
      <FI><Tag>CONTACT US</Tag></FI>
      <FI delay={.1}><H2>사업 및 협력 문의</H2></FI>
      <FI delay={.2}><Desc>E-mail: cross@thenile.kr  |  전화: 010-8257-1104</Desc></FI>
    </Box></section>
    <Sec bg={C.w}><Box>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48}}>
        <FI><div>
          <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:24}}>협력 유형</h3>
          {[
            {t:"기업 CSR 파트너십",d:"임직원 양육교육, 사내 부모 프로그램, CSR 캠페인 공동 기획"},
            {t:"강연 · 워크숍 의뢰",d:"부모교육 전문가가 직접 진행하는 강연과 워크숍"},
            {t:"기관 협업 · 공동사업",d:"지자체, 재단, 연구기관과의 공동사업 및 프로그램 공동 기획"},
            {t:"연구 · 데이터 협력",d:"양육불안척도(PAI) 데이터 활용 공동연구, 양육 실태조사"},
            {t:"후원 협약",d:"지정기부금 협약, 매칭 그랜트 등 다양한 후원 방식"},
          ].map((x,i)=>(
            <div key={i} style={{display:"flex",gap:16,padding:"20px 0",borderBottom:`1px solid ${C.g1}`,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <h4 style={{fontSize:16,fontWeight:600,color:C.navy,marginBottom:4}}>{x.t}</h4>
                <p style={{fontSize:13,color:C.g6,lineHeight:1.6}}>{x.d}</p>
              </div>
            </div>
          ))}
        </div></FI>
        <FI delay={.2}><div style={{background:C.warm,borderRadius:20,padding:32,border:`1px solid ${C.g2}`,position:"sticky",top:100}}>
          <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:24}}>문의하기</h3>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:500,color:C.g6,display:"block",marginBottom:6}}>문의 유형</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["기업 CSR","강연/워크숍","기관 협업","연구 협력","후원 협약","기타"].map(t=><div key={t} onClick={()=>setForm({...form,type:t})} style={{padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer",background:form.type===t?C.navy:C.w,color:form.type===t?"#fff":C.g6,border:`1px solid ${form.type===t?C.navy:C.g2}`,transition:"all .2s"}}>{t}</div>)}
            </div>
          </div>
          {[{k:"org",l:"기관/회사명",p:"소속 기관 또는 회사명"},{k:"name",l:"담당자명 *",p:"성함"},{k:"email",l:"이메일 *",p:"example@company.com"},{k:"phone",l:"연락처",p:"010-0000-0000"}].map(f=>(
            <div key={f.k} style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:500,color:C.g6,display:"block",marginBottom:6}}>{f.l}</label>
              <input value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.p}
                style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.g2}`,fontSize:14,outline:"none",background:C.w,transition:"border .2s",fontFamily:"inherit"}}
                onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
            </div>
          ))}
          <div style={{marginBottom:24}}>
            <label style={{fontSize:13,fontWeight:500,color:C.g6,display:"block",marginBottom:6}}>문의 내용 *</label>
            <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="협력하고 싶은 내용을 자유롭게 작성해주세요." rows={5}
              style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.g2}`,fontSize:14,outline:"none",background:C.w,resize:"vertical",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
          </div>
          <BG onClick={handleSubmit} style={{width:"100%",padding:"16px",fontSize:16,textAlign:"center"}}>문의 보내기</BG>
          <div style={{marginTop:24,padding:"16px 20px",background:C.w,borderRadius:12,border:`1px solid ${C.g2}`}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:600,marginBottom:8}}>직접 연락</div>
            <div style={{fontSize:13,color:C.g6,lineHeight:1.8}}>E-mail: cross@thenile.kr<br/>전화: 010-8257-1104</div>
          </div>
        </div></FI>
      </div>
    </Box></Sec>
  </>);
};

/* ═══ APP ═══ */
export default function App(){
  const[page,setPage]=useState("home");
  const go=id=>{setPage(id);window.scrollTo({top:0,behavior:"smooth"})};
  const P={home:<HomePage go={go}/>,about:<AboutPage go={go}/>,programs:<ProgramsPage/>,parentscan:<ParentscanPage/>,pacer:<PacerPage/>,contact:<ContactPage/>};
  return(<div><Nav page={page} go={go}/><main>{P[page]||<HomePage go={go}/>}</main><Footer go={go}/></div>);
}

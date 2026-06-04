import { useState, useEffect, useRef, Fragment } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

/* 토스페이먼츠 테스트 클라이언트 키 (가맹점 심사 통과 후 라이브 키로 교체) */
const TOSS_CLIENT_KEY = "test_ck_mBZ1gQ4YVXW4WBvkq5z13l2KPoqN";

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
const Desc=({children,light})=><p style={{fontSize:18,lineHeight:1.8,color:light?"rgba(255,255,255,.75)":C.g6,maxWidth:640,marginBottom:32,wordBreak:"keep-all"}}>{children}</p>;
const Btn=({children,primary=true,onClick,style={}})=><button onClick={onClick} style={{padding:"14px 32px",borderRadius:50,border:primary?"none":`1.5px solid ${C.navy}`,background:primary?C.navy:"transparent",color:primary?"#fff":C.navy,fontSize:17,fontWeight:600,cursor:"pointer",transition:"all .3s",...style}}>{children}</button>;
const BG=({children,onClick,style={}})=><button onClick={onClick} style={{padding:"14px 32px",borderRadius:50,border:"none",background:C.gold,color:C.navy,fontSize:17,fontWeight:600,cursor:"pointer",...style}}>{children}</button>;
const Dot=()=><div style={{width:4,height:4,borderRadius:2,background:C.gold,flexShrink:0}}/>;

const PAGES=[
  {id:"home",label:"Home"},{id:"about",label:"더나일 소개"},{id:"programs",label:"사업소개"},
  {id:"delight",label:"딜라이트 프로젝트"},
  {id:"parentscan",label:"양육불안검사"},{id:"pacer",label:"후원하기"},{id:"shop",label:"상품"},{id:"counsel",label:"페이서 상담"},{id:"contact",label:"협력문의"},
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
          {PAGES.map(n=><div key={n.id} onClick={()=>go(n.id)} className="nl" style={{fontSize:16,color:page===n.id?C.gold:txt,cursor:"pointer",fontWeight:page===n.id?600:400,transition:"color .2s"}}>{n.label}</div>)}
          <BG onClick={()=>go("pacer")} className="nl" style={{padding:"10px 24px",fontSize:15}}>후원하기</BG>
          <div onClick={()=>setOp(!op)} className="bg" style={{display:"none",flexDirection:"column",gap:5,cursor:"pointer",padding:8}}>{[0,1,2].map(i=><div key={i} style={{width:22,height:2,background:txt,borderRadius:1}}/>)}</div>
        </div>
      </Box>
    </nav>
    {op&&<div style={{position:"fixed",inset:0,zIndex:99,background:"rgba(27,42,74,.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}} onClick={()=>setOp(false)}>
      {PAGES.map(n=><div key={n.id} onClick={()=>go(n.id)} style={{fontSize:22,color:"#fff",cursor:"pointer",fontWeight:page===n.id?700:400}}>{n.label}</div>)}
      <BG onClick={()=>go("pacer")} style={{marginTop:16}}>후원하기</BG>
    </div>}
    <style>{`*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',sans-serif;color:${C.g8};background:${C.warm};overflow-x:hidden;word-break:keep-all}h1,h2,h3,h4,p{word-break:keep-all}.nl{display:block}.bg{display:none!important}@media(min-width:961px){.about-photo{position:sticky;top:100px}}@media(max-width:960px){.nl{display:none!important}.bg{display:flex!important}}`}</style>
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
      <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:16}}>사단법인 더나일</div>
      {/* 법인 정보 */}
      <div style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:2,marginBottom:24}}>
        비영리법인 설립허가번호 : 제2024-194호<br/>
        사업자등록번호 : 438-82-00797<br/>
        대표자 : 이다랑<br/>
        소재지 : 서울특별시 성동구 뚝섬로1나길 5, 7층 S721호(성수동1가, 헤이그라운드)
      </div>
      {/* 연락처 */}
      <div style={{fontSize:16,color:"rgba(255,255,255,.6)",marginBottom:32,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        <span>전화번호 : 010-8257-1104</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span>이메일 : cross@thenile.kr</span>
      </div>
      {/* 링크 */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",fontSize:16,color:"rgba(255,255,255,.6)",marginBottom:32}}>
        <span style={{cursor:"pointer"}} onClick={()=>go&&go("refund")}>환불 정책</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span style={{cursor:"pointer"}}>이용약관</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span style={{cursor:"pointer"}}>개인정보처리방침</span>
        <span style={{color:"rgba(255,255,255,.3)"}}>|</span>
        <span style={{cursor:"pointer"}}>공익위반신고 바로가기</span>
      </div>
      {/* 카피라이트 */}
      <div style={{fontSize:15,color:"rgba(255,255,255,.45)"}}>Copyright © 2025 사단법인 더나일 All rights reserved.</div>
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
            <span style={{ fontSize:16, color:C.g4 }}>{idx + 1} / {total}</span>
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
            <p style={{ fontSize:17, color:C.g6, lineHeight:1.8, marginBottom:24, whiteSpace:"pre-line", maxWidth:700 }}>{a.d}</p>
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
        <p style={{fontSize:17,color:C.g6}}>인스타그램에서도 더나일의 소식을 만나보세요 :)</p>
      </div></FI>

      {/* Elfsight 위젯 영역 — elfsight.com 에서 무료 위젯 생성 후 아래 주석을 교체하세요 */}
      {/* <div className="elfsight-app-YOUR-APP-ID-HERE" /> */}

      <FI delay={.15}><div style={{textAlign:"center",padding:48,background:C.w,borderRadius:20,border:`1px solid ${C.g2}`,maxWidth:700,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:20}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff" stroke="none"/></svg>
          </div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:18,fontWeight:700,color:C.navy}}>thenile_pacer</div>
            <div style={{fontSize:12,color:C.g4}}>사단법인 더나일</div>
          </div>
        </div>
        <p style={{fontSize:16,color:C.g6,lineHeight:1.8,marginBottom:24}}>인스타그램 피드를 실시간으로 연동하려면<br/><a href="https://elfsight.com/instagram-feed-instashow/" target="_blank" rel="noopener noreferrer" style={{color:C.navy,fontWeight:600,textDecoration:"underline"}}>Elfsight 무료 위젯</a>을 생성 후 코드에 app-id를 추가하면 됩니다.</p>
        <a href="https://www.instagram.com/thenile_pacer/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 32px",borderRadius:50,background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff",fontSize:17,fontWeight:600,cursor:"pointer"}}>
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
                <h3 style={{fontSize:20,fontWeight:700,color:C.navy,lineHeight:1.5}}>{v.t}</h3>
                <div style={{fontSize:11,color:C.g4,marginTop:12}}>클릭하여 자세히 보기</div>
              </div>
              {/* 뒷면 */}
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",padding:28,background:C.navy,borderRadius:16,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:C.gold,marginBottom:12}}>Vision {v.n}</div>
                <p style={{fontSize:16,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>{v.d}</p>
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
        <FI><div style={{fontSize:16,color:C.gold,letterSpacing:3,marginBottom:24,fontWeight:500}}>사단법인 더나일 · Nurtuning Into Light Everyday</div></FI>
        <FI delay={.2}><h1 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,color:"#fff",lineHeight:1.4,marginBottom:24,maxWidth:600,textShadow:"0 2px 20px rgba(0,0,0,.3)"}}>부모됨의 두려움이<br/><span style={{color:C.gold}}>기쁨</span>으로 전환되는<br/>여정을 함께 합니다</h1></FI>
        <FI delay={.4}><p style={{fontSize:20,color:"rgba(255,255,255,.8)",lineHeight:1.8,maxWidth:480,marginBottom:40}}>Parenthood : From dread to delight</p></FI>
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
        <FI delay={.2}><p style={{fontSize:20,color:C.navyL,marginBottom:48,fontStyle:"italic"}}>Parenthood : From dread to delight</p></FI>
        <FI delay={.3}><Tag>VISION</Tag></FI>
        <FI delay={.35}>
          <VisionCards />
        </FI>
        <FI delay={.5}><p style={{fontSize:15,color:C.g4,marginTop:32}}>서울특별시 산하 비영리법인 / 기획재정부 지정 지정기부금 단체</p></FI>
      </div>
    </Box>
  </Sec>

  {/* 더나일은 믿고있습니다 — p.4 원문 */}
  <Sec bg={C.navy} style={{padding:"64px 0"}}>
    <Box style={{textAlign:"center"}}>
      <FI><H2 light style={{fontSize:"clamp(22px,3.5vw,32px)",maxWidth:700,margin:"0 auto 16px"}}>더나일은 믿고있습니다.</H2></FI>
      <FI delay={.15}><p style={{fontSize:18,color:"rgba(255,255,255,.7)",lineHeight:1.9,maxWidth:600,margin:"0 auto"}}>건강한 양육의 방식으로 자라난 아이들이 많아져야<br/>미래세대의 아이들이 살아갈 세상도 건강해질 수 있습니다</p></FI>
      <FI delay={.3}><p style={{fontSize:20,color:C.gold,lineHeight:1.8,maxWidth:600,margin:"24px auto 0",fontWeight:600}}>다음 세대가 살아갈 세상이 지금보다 더 나아지는 것에 대한 해답은<br/>바로 부모됨의 여정이 행복해지는 것입니다</p></FI>
    </Box>
  </Sec>

  {/* 이사장의 한마디 — Mission Statement p.3 원문 */}
  <Sec bg={C.warm}>
    <Box>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48,alignItems:"center"}}>
        <FI><div style={{textAlign:"center"}}>
          <img src="/images/이다랑.jpg" alt="이다랑 이사장" style={{width:"100%",maxWidth:320,borderRadius:20,margin:"0 auto 20px",objectFit:"cover",display:"block",boxShadow:"0 8px 32px rgba(27,42,74,.12)"}}/>
          <div style={{fontSize:20,fontWeight:700,color:C.navy}}>이다랑 이사장</div>
          <div style={{fontSize:15,color:C.gold,fontWeight:600,marginTop:4}}>아동심리전문가</div>
          <div style={{fontSize:12,color:C.g4,marginTop:8,lineHeight:1.6}}>아동학 학사 / 발달심리학 석사<br/>아동심리박사과정 / (주)그로잉맘 창업자</div>
        </div></FI>
        <FI delay={.2}><div>
          <Tag>Mission Statement</Tag>
          <div style={{fontFamily:"'Noto Serif KR',serif",fontSize:22,fontWeight:700,color:C.navy,lineHeight:1.7,marginBottom:24,borderLeft:`4px solid ${C.gold}`,paddingLeft:24}}>
            "더나일은 건강하고 기쁜 '부모됨'에 집중합니다."
          </div>
          <p style={{fontSize:17,color:C.g6,lineHeight:1.9,marginBottom:16}}>오늘의 부모들은 넘쳐나는 정보와 높아진 기준 앞에서 오히려 더 불안하고, 더 외롭습니다. 가족을 향한 냉소적인 시선은 사회 전반에 퍼져 있고, 양육 불안은 부모가 자신의 가능성을 보지 못하게 합니다. 그 결과, 부모됨이 주는 기쁨은 가려지고 두려움이 가득해졌습니다.</p>
          <p style={{fontSize:17,color:C.g6,lineHeight:1.9,marginBottom:16}}>더나일은 이 문제를 정면으로 바라봅니다. 그리고 이 시대에 필요한 건강하고 균형 잡힌 부모상을 사회의 새로운 기준으로 만들어 가고자 합니다. 가족을 바라보는 냉소적인 시선을 신뢰와 환대로 바꾸고, 부모 개개인이 자신 안에 이미 가진 자원을 발견하여 양육의 효능감을 회복하며, 그렇게 변화된 부모들이 모여 사회적 문화를 함께 바꾸어 나가기를 기대합니다.</p>
          <p style={{fontSize:17,color:C.navy,lineHeight:1.9,fontWeight:600}}>부모됨이 가진 기쁨을 회복하는 것— 그것이 더 나은 다음 세대를 만드는 가장 근본적인 힘입니다.</p>
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
            <h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>{x.t}</h3>
            <p style={{fontSize:15,color:C.g6,lineHeight:1.6}}>{x.d}</p>
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
        <p style={{fontSize:17,color:C.g6,maxWidth:600,margin:"0 auto",lineHeight:1.8}}>더나일은 4개의 축으로 부모됨의 여정 전체를 지원합니다. 부모 개개인의 마음돌봄에서 시작해, 연결을 만들고, 문화를 바꾸고, 구조를 바꿉니다.</p>
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
              <p style={{fontSize:15,color:C.g6,lineHeight:1.6}}>{x.d}</p>
            </div>
          </FI>
        ))}
      </div>
      <FI delay={.5}><p style={{textAlign:"center",marginTop:32,fontSize:16,color:C.g4}}>4개의 목표에 맞는 사업운영 및 임팩트 측정</p></FI>
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
          {name:"이혜린 이사",img:"/images/이혜린.jpg",lines:["(현) 쉬벤처스 부대표","(전) 그로잉맘 부대표","교육학 석사, 창업학 박사과정중","부모교육전문가,","청소년상담사,","비즈니스 빌더"]},
          {name:"정우열 이사",img:"/images/정우열.jpg",lines:["정신과 전문의","생각과 느낌 원장","2016년 여성가족부장관표창","2017년 국무총리표창"]},
          {name:"김혜민 이사",img:"/images/김혜민.jpg",lines:["(전) YTN 라디오PD","극동방송 아나운서","한국자살예방협회 홍보위원장","국무총리표창"]},
          {name:"박장원 이사",img:"/images/변장원.jpg",lines:["정책학 박사","(전공: 필란트로피)","(전) 국가균형발전","위원회 정책홍보팀장"]},
          {name:"김혜진 이사",img:"/images/김혜진.jpg",lines:["(현) 옥소폴리틱스 운영총괄","(전) 실리콘밸리 글로벌 기업 근무","(Roblox, Myriad Genetics, Counsyl 등)","저서 「실리콘밸리를 그리다」","커리어 코치 및 글로벌 조직문화 강연자"]},
        ].map((m,i)=>(
          <FI key={i} delay={i*.08}>
            <div style={{textAlign:"center",padding:20,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%"}}>
              {m.img ? <img src={m.img} alt={m.name} style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",objectFit:"cover",display:"block",border:`3px solid ${C.goldL}`}}/> : <div style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",background:`linear-gradient(135deg,${C.goldP},${C.g1})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,color:C.navy}}>{m.name[0]}</div>}
              <div style={{fontSize:17,fontWeight:600,color:C.navy,marginBottom:8}}>{m.name}</div>
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
            <div style={{fontSize:17,fontWeight:700,color:C.gold,marginBottom:8}}>{x.t}</div>
            <p style={{fontSize:15,color:C.g6,lineHeight:1.6}}>{x.d}</p>
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
      <FI delay={.2}><p style={{fontSize:18,color:"rgba(255,255,255,.6)",lineHeight:1.8,maxWidth:520,margin:"0 auto 40px",wordBreak:"keep-all"}}>우리는 후원자를 페이서라고 부릅니다.<br/>페이서는 [함께 걷는 사람들] 이라는 뜻을 가지고 있지요.<br/><br/>[페이서] 는 더 나은 사회를 위해 가족의 가치가 회복되어야 한다는 것에 동의하며 함께 힘을 모으는 사람들입니다.</p></FI>
      <FI delay={.3}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}><BG onClick={()=>window.open("https://link.donationbox.co.kr/donationBoxJoin.jsp?campaignuid=1FuNiwn6W6","_blank")}>페이서 되기</BG><Btn primary={false} onClick={()=>go("contact")} style={{borderColor:"rgba(255,255,255,.3)",color:"#fff"}}>사업 및 협력 문의</Btn></div></FI>
    </Box>
  </Sec>

  {/* 인스타그램 */}
  {/* <InstagramSection /> */}
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
    <FI delay={.15}><H2 style={{color:C.g6,marginBottom:24}}>Parenthood : From dread to delight</H2></FI>
    <FI delay={.2}><div style={{marginBottom:40}}>
      <Tag>VISION</Tag>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
        {["부모의 일상이 매일의 성장이 됩니다","양육에 대한 냉소를 다정함으로 바꿉니다","양육의 즐거움을 사회와 공유합니다"].map((v,i)=>(
          <div key={i} style={{padding:24,background:C.warm,borderRadius:16}}><div style={{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:2,marginBottom:8}}>Vision 0{i+1}</div><h3 style={{fontSize:20,fontWeight:700,color:C.navy}}>{v}</h3></div>
        ))}
      </div>
    </div></FI>
  </Box></Sec>

  <Sec bg={C.warm}><Box>
    <FI><Tag>설립목적</Tag></FI>
    <FI delay={.1}><p style={{fontSize:17,color:C.g6,lineHeight:1.9,maxWidth:800,marginBottom:40,wordBreak:"keep-all"}}>본 법인은 가족구성원의 정서적·사회적 가치의 회복이라는 가치 아래 다양한 가족 구성원들이 건강한 개인이자 가족의 일원으로 성장할 수 있도록 다양한 서비스와 기회를 제공한다. 이를 통하여 각각의 구성원의 심리·사회적 기능이 원활하게 수행되어 건강한 사회를 조성함을 목적으로 한다.</p></FI>

    <FI delay={.2}><Tag>주된사업</Tag></FI>
    <FI delay={.25}><div style={{marginBottom:40}}>
      {["부모의 건강한 양육관 조성을 위한 전문가 자문 및 교육프로그램 운영","건강한 양육환경 조성을 위한 컨퍼런스 개최","부모교육 프로그램 개발 및 콘텐츠 개발","기타 법인의 목적을 수행하기 위한 사업"].map((item,i)=>(
        <div key={i} style={{fontSize:16,color:C.g6,padding:"8px 0",display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.6}}><Dot/><span>{item}</span></div>
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
            <div key={i} style={{fontSize:16,color:C.g6,padding:"6px 0 6px 4px",lineHeight:1.6}}>{item}</div>
          ))}
        </div>
      ))}
    </div></FI>
  </Box></Sec>

  {/* 이다랑 이사장 — p.18 원문 */}
  <Sec bg={C.w}><Box>
    <FI><Tag>이다랑 이사장</Tag></FI>
    <FI delay={.1}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48,alignItems:"start",marginTop:16}}>
      <div className="about-photo" style={{textAlign:"center"}}>
        <img src="/images/이다랑.jpg" alt="이다랑 이사장" style={{width:"100%",maxWidth:280,borderRadius:20,margin:"0 auto 20px",objectFit:"cover",display:"block",boxShadow:"0 8px 32px rgba(27,42,74,.12)"}}/>
        <div style={{fontSize:24,fontWeight:700,color:C.navy}}>이다랑</div>
        <div style={{fontSize:16,color:C.g6,marginTop:4}}>아동학 학사 / 발달심리학 석사 / 아동심리박사과정<br/>(주)그로잉맘 창업자 / 아동심리전문가</div>
      </div>
      <div>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:12,color:C.gold,fontWeight:600,letterSpacing:2,marginBottom:12}}>주요 저서</div>
          {["아이 마음에 상처주지 않는 습관(길벗)","불안이 많은 아이 (한빛)","초등저학년, 아이의 사회성이 자라납니다(아울북)","내 아이를 위한 심플 육아(RHK)","육아 말고 뭐라도(세종)"].map((b,j)=><div key={j} style={{fontSize:16,color:C.g6,padding:"5px 0",display:"flex",alignItems:"center",gap:8}}><Dot/>{b}</div>)}
        </div>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:12,color:C.gold,fontWeight:600,letterSpacing:2,marginBottom:12}}>주요 활동</div>
          {["NAVER 육아 공식 인플루언서","세바시 / SBS 스페셜 '스마트폰 전쟁' / KT 키즈랜드 등 출연","WEE매거진 / 맘앤앙팡 / 중앙:헬로페어런츠 / 여성신문 기고","포스코 / 구글코리아 / 스타벅스 / 삼천리 등 기업 출강","신세계 / 롯데 / 현대백화점 주요 문화센터 출강","NIA 디지털페어런팅 / 육아정책연구소 교육 프로그램 개발"].map((b,j)=><div key={j} style={{fontSize:16,color:C.g6,padding:"5px 0",display:"flex",alignItems:"flex-start",gap:8}}><Dot/>{b}</div>)}
        </div>
        <div style={{fontSize:15,color:C.g4,lineHeight:1.6}}>전) 한국청소년상담복지개발원 상담사 | 전) 한국RT센터 전문 강사 및 치료사 | 전) 마음더하기상담센터, 구리시·서초구 상담센터 상담사</div>
      </div>
    </div></FI>
  </Box></Sec>

  {/* 이사진 — p.19 원문 */}
  <Sec bg={C.warm}><Box>
    <FI><Tag>이사진</Tag></FI>
    <FI delay={.1}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:20,marginTop:16}}>
      {[
        {name:"이혜린 이사",img:"/images/이혜린.jpg",lines:["(현) 쉬벤처스 부대표","(전) 그로잉맘 부대표","교육학 석사, 창업학 박사과정중","부모교육전문가,","청소년상담사,","비즈니스 빌더"]},
        {name:"정우열 이사",img:"/images/정우열.jpg",lines:["정신과 전문의","생각과 느낌 원장","2016년 여성가족부장관표창","2017년 국무총리표창"]},
        {name:"김혜민 이사",img:"/images/김혜민.jpg",lines:["(전) YTN 라디오PD","극동방송 아나운서","한국자살예방협회 홍보위원장","국무총리표창"]},
        {name:"박장원 이사",img:"/images/변장원.jpg",lines:["정책학 박사","(전공: 필란트로피)","(전) 국가균형발전","위원회 정책홍보팀장"]},
        {name:"김혜진 이사",img:"/images/김혜진.jpg",lines:["(현) 옥소폴리틱스 운영총괄","(전) 실리콘밸리 글로벌 기업 근무","(Roblox, Myriad Genetics, Counsyl 등)","저서 「실리콘밸리를 그리다」","커리어 코치 및 글로벌 조직문화 강연자"]},
      ].map((m,i)=>(
        <FI key={i} delay={i*.08}><div style={{textAlign:"center",padding:20,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%"}}>
          {m.img ? <img src={m.img} alt={m.name} style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",objectFit:"cover",display:"block",border:`3px solid ${C.goldL}`}}/> : <div style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 16px",background:`linear-gradient(135deg,${C.goldP},${C.g1})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,color:C.navy}}>{m.name[0]}</div>}
          <div style={{fontSize:17,fontWeight:600,color:C.navy,marginBottom:8}}>{m.name}</div>
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
    const[si,setSi]=useState(0);const[validImgs,setValidImgs]=useState([]);const[imgRatios,setImgRatios]=useState([]);
    useEffect(()=>{
      const srcs=[1,2,3,4,5].map(n=>`/images/projects/${encodeURIComponent(imgDir)}/${n}.jpg`);
      const results=[];const rats=[];let done=0;
      srcs.forEach((src,idx)=>{
        const img=new Image();
        img.onload=()=>{results[idx]=src;rats[idx]=img.width/img.height;done++;if(done===5){setValidImgs(results.filter(Boolean));setImgRatios(rats.filter((_,i)=>results[i]))}};
        img.onerror=()=>{results[idx]=null;done++;if(done===5){setValidImgs(results.filter(Boolean));setImgRatios(rats.filter((_,i)=>results[i]))}};
        img.src=src;
      });
    },[imgDir]);
    const validRatios=imgRatios;
    if(validImgs.length===0) return(
      <div style={{width:"100%",height:260,background:`linear-gradient(135deg,${C.g1},${C.g2})`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:C.g4,fontSize:15}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        사업 이미지 영역
      </div>
    );
    const idx=si%validImgs.length;
    const isPortrait=validRatios[idx]<1;
    return(
      <div style={{position:"relative",width:"100%",height:isPortrait?320:240,overflow:"hidden",background:C.g1,transition:"height .3s"}}>
        <img src={validImgs[idx]} alt="" style={{width:"100%",height:"100%",objectFit:isPortrait?"contain":"cover",transition:"opacity .4s"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(27,42,74,.1)",pointerEvents:"none"}}/>
        {validImgs.length>1&&<>
          <button onClick={e=>{e.stopPropagation();setSi(i=>i===0?validImgs.length-1:i-1)}} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.4)",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <button onClick={e=>{e.stopPropagation();setSi(i=>(i+1)%validImgs.length)}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.4)",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>→</button>
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
          <div style={{width:"100%",height:220,background:`linear-gradient(135deg,${C.g1},${C.g2})`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:C.g4,fontSize:15}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            사업 이미지 영역
          </div>
        )}
        <div style={{padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
            <h4 style={{fontSize:20,fontWeight:700,color:C.navy,flex:1,minWidth:200}}>{p.name}</h4>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:C.goldP,color:C.navy,fontWeight:600}}>{p.cat}</span>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:C.g1,color:C.g6}}>{p.period}</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
            <div style={{padding:"10px 14px",background:C.warm,borderRadius:8}}><div style={{fontSize:11,color:C.gold,fontWeight:600}}>대상</div><div style={{fontSize:15,color:C.navy,fontWeight:500,marginTop:2}}>{p.target}</div></div>
            <div style={{padding:"10px 14px",background:C.warm,borderRadius:8}}><div style={{fontSize:11,color:C.gold,fontWeight:600}}>협력기관</div><div style={{fontSize:15,color:C.navy,fontWeight:500,marginTop:2}}>{p.org}</div></div>
          </div>
          <div style={{borderTop:`1px solid ${C.g1}`,paddingTop:12}}>
            <div style={{fontSize:11,color:C.gold,fontWeight:600,marginBottom:8}}>주요 내용</div>
            {p.content.map((c,j)=><div key={j} style={{fontSize:15,color:C.g6,padding:"3px 0",display:"flex",alignItems:"flex-start",gap:8,lineHeight:1.5}}><Dot/><span>{c}</span></div>)}
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
        {tabs.map((t,i)=><div key={i} onClick={()=>setTab(i)} style={{padding:"10px 20px",borderRadius:50,background:tab===i?C.navy:C.w,color:tab===i?"#fff":C.navy,fontSize:15,fontWeight:600,cursor:"pointer",border:`1px solid ${tab===i?C.navy:C.g2}`,transition:"all .3s"}}>{t}</div>)}
      </div>
    </Box></section>

    {tab < 3 ? (
      <Sec bg={C.w}><Box>
        {tab === 0 && <FI><div style={{padding:"16px 20px",background:C.goldP,borderRadius:12,marginBottom:24}}>
          <span style={{fontSize:15,color:C.navy,fontWeight:500}}>전체 {allProjects.length}개 사업  |  지방보조금 {govProjects.length}건  |  기타사업(수탁 등) {otherProjects.length}건</span>
        </div></FI>}

        {tab === 1 && <FI><h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>최근 5년간 지방보조금 지원사항 (사업이력)</h3><p style={{fontSize:16,color:C.g6,marginBottom:24}}>지자체 보조금을 통해 수행한 공공사업입니다.</p></FI>}

        {tab === 2 && <FI><h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>최근 5년간 기타사업 추진실적 (수탁사업 등)</h3><p style={{fontSize:16,color:C.g6,marginBottom:24}}>민간위탁, CSR, 자체사업 등으로 수행한 사업입니다.</p></FI>}

        {displayProjects.map((p,i)=><ProjectCard key={`${tab}-${i}`} p={p} i={i}/>)}
      </Box></Sec>
    ) : (
      <Sec bg={C.w}><Box>
        <FI><h3 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:24}}>2026년 주요 사업 계획</h3></FI>
        {plan2026.map((sec,si)=>(
          <div key={si} style={{marginBottom:32}}>
            <FI delay={si*.1}><div style={{fontSize:16,fontWeight:600,color:C.gold,letterSpacing:1,marginBottom:16,paddingBottom:8,borderBottom:`2px solid ${C.goldP}`}}>{sec.cat}</div></FI>
            {sec.items.map((p,i)=>(
              <FI key={i} delay={(si*.1)+(i*.08)}>
                <div style={{padding:24,background:C.warm,borderRadius:16,border:`1px solid ${C.g2}`,marginBottom:12}}>
                  <h4 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>{p.t}</h4>
                  {p.d&&<p style={{fontSize:16,color:C.g6,lineHeight:1.7,whiteSpace:"pre-line"}}>{p.d}</p>}
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
    <FI delay={.2}><p style={{fontSize:18,color:"rgba(255,255,255,.7)",lineHeight:1.8,maxWidth:600,margin:"0 auto 16px"}}>자체보유하고 있는 양육불안 척도를 활용하여 임팩트 지표를 지속적으로 측정합니다.</p></FI>
    <FI delay={.25}><p style={{fontSize:17,color:"rgba(255,255,255,.6)",lineHeight:1.8,maxWidth:600,margin:"0 auto 40px"}}>양육불안 척도는 양육자가 느끼는 심리/정서적 불안 수준과 양육자로서의 효능감을 측정할 수 있는 척도입니다. 더나일은 타당도가 확인된 자체 분석도구를 활용하여 누구나 쉽게 온라인으로 검사할 수 있는 시스템을 구축하고 임팩트 지표를 지속적으로 측정하고 관리합니다.</p></FI>
    <FI delay={.3}><BG onClick={()=>window.open("https://www.parentscan.app/register","_blank")} style={{fontSize:20,padding:"18px 48px"}}>검사 시작하기</BG></FI>
  </Box></section>
</>);


/* ═══ PACER — 후원 안내 ═══ */
const DONATE_URL="https://link.donationbox.co.kr/donationBoxJoin.jsp?campaignuid=1FuNiwn6W6";
const PacerPage=()=>(<>
  {/* 히어로 */}
  <section style={{paddingTop:120,paddingBottom:80,background:`linear-gradient(135deg,${C.navy} 0%,${C.navyL} 100%)`}}><Box style={{textAlign:"center"}}>
    <FI><Tag color={C.gold}>PACER · 함께 걷는 사람들</Tag></FI>
    <FI delay={.1}><H2 light style={{fontSize:"clamp(28px,5vw,40px)"}}>오늘의 가족을 변화시키는 일에{"\n"}함께해주세요</H2></FI>
    <FI delay={.2}><p style={{fontSize:18,color:"rgba(255,255,255,.7)",lineHeight:1.9,maxWidth:560,margin:"0 auto",wordBreak:"keep-all"}}>페이서(PACER)란 더 나은 사회를 위해 가족의 가치가 회복되어야 한다는 것에 동의하며 더나일과 함께 걷는 사람들입니다.</p></FI>
    <FI delay={.3}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginTop:32}}>
      <BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{fontSize:20,padding:"18px 48px"}}>후원하기</BG>
    </div></FI>
    <FI delay={.35}><p style={{fontSize:15,color:"rgba(255,255,255,.4)",marginTop:24}}>더나일은 기획재정부 지정 지정기부금단체로 기부금영수증 발급이 가능합니다 (법인/개인)</p></FI>
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
          <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:12,lineHeight:1.5,whiteSpace:"pre-line"}}>{x.t}</h3>
          <p style={{fontSize:16,color:C.g6,lineHeight:1.7,wordBreak:"keep-all"}}>{x.d}</p>
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
        {t:"부모의 일상이 성장이 되게 합니다",color:"#E8D5B7",items:["부모를 위한 리더십 과정 진행","소외 계층 긴급 상담 / 심리치료 지원"]},
        {t:"양육에 대한 냉소를 다정함으로 바꿉니다",color:"#D5E0D5",items:["언어변화 프로젝트 – 말빛 프로젝트 진행","가족과 함께하는 정기후원행사"]},
        {t:"양육의 즐거움을 사회와 공유합니다",color:"#D5DAE8",items:["가족을 위한 더나일 포럼 개최","변화를 꿈꾸는 100인의 가족 커뮤니티 운영"]},
      ].map((x,i)=>(
        <FI key={i} delay={i*.12}><div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${C.g2}`,background:C.w,height:"100%"}}>
          <div style={{background:x.color,padding:"28px 24px",textAlign:"center"}}>
            <h3 style={{fontSize:20,fontWeight:700,color:C.navy}}>{x.t}</h3>
          </div>
          <div style={{padding:24}}>
            {x.items.map((item,j)=><div key={j} style={{fontSize:16,color:C.g6,padding:"8px 0",display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.6}}><Dot/><span>{item}</span></div>)}
          </div>
        </div></FI>
      ))}
    </div>
  </Box></Sec>

  {/* 페이서란 */}
  <Sec bg={C.navy}><Box style={{textAlign:"center"}}>
    <FI><H2 light style={{fontSize:"clamp(24px,4vw,32px)",maxWidth:600,margin:"0 auto 24px"}}>오늘의 가족을 변화시키는 일에{"\n"}함께해주세요</H2></FI>
    <FI delay={.1}><p style={{fontSize:17,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:540,margin:"0 auto",wordBreak:"keep-all"}}>가족의 가치를 회복하는 여정에 건강한 가족 문화를 형성해 나가는 더나일 커뮤니티의 일원으로서 함께합니다.</p></FI>
    <FI delay={.15}><p style={{fontSize:17,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:540,margin:"16px auto 0",wordBreak:"keep-all"}}>가족의 행복한 성장을 함께 공유할 수 있도록 페이서에게도 가족을 위한 다양한 프로그램 참여 기회를 드립니다.</p></FI>
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
            {p.items.map((b,j)=><div key={j} style={{fontSize:16,color:C.g6,padding:"10px 0",borderBottom:j<p.items.length-1?`1px solid ${C.g1}`:"none",display:"flex",alignItems:"center",gap:10}}><span style={{color:C.gold}}>✔</span>{b}</div>)}
            <p style={{fontSize:15,color:C.navy,fontWeight:500,marginTop:16,lineHeight:1.6,wordBreak:"keep-all"}}>{p.intro}</p>
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
        {emoji:"✉️",t:"뉴스레터",d:"매 월, 더나일과 페이서 활동 계획 및 내용과 함께 페이서의 참여가 가능한 프로그램 정보를 받아 볼 수 있습니다."},
        {emoji:"🎟️",t:"커뮤니티 참여",d:"페이서 교육 및 프로그램 참여를 위한 커뮤니티를 운영합니다."},
        {emoji:"💬",t:"온라인 상담 및 검사",d:"페이서의 가족을 위한 전문가 상담 및 검사 등을 지원합니다."},
        {emoji:"👪",t:"분기별 페이서 밋업",d:"분기별로 페이서와 임원진의 밋업을 진행하여 더나일의 소식을 전달하며 함께 계획을 세우고 프로젝트를 만들어 나갑니다."},
      ].map((x,i)=>(
        <FI key={i} delay={i*.08}><div style={{padding:24,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`,height:"100%"}}>
          <div style={{fontSize:28,marginBottom:10}}>{x.emoji}</div>
          <h4 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>{x.t}</h4>
          <p style={{fontSize:15,color:C.g6,lineHeight:1.7,wordBreak:"keep-all"}}>{x.d}</p>
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
    <FI delay={.1}><p style={{textAlign:"center",fontSize:15,color:C.g4,marginBottom:48}}>기부금 영수증 발급 / 법인 정기후원 가능(별도문의)</p></FI>
    <FI delay={.15}><div style={{maxWidth:480,margin:"0 auto",padding:40,background:C.warm,borderRadius:20,border:`2px solid ${C.gold}`,textAlign:"center"}}>
      <div style={{fontSize:17,color:C.gold,fontWeight:700,marginBottom:24}}>🎁 정기 후원</div>
      {[
        {emoji:"😍",text:"온·오프라인 아동/가족 프로그램 (우선참여 3회 / 1년)"},
        {emoji:"😍",text:"온라인 양육상담 (3회 / 1년)"},
      ].map((item,i)=>(
        <div key={i} style={{fontSize:17,color:C.navy,fontWeight:500,padding:"10px 0",borderTop:i===0?`1px solid ${C.g2}`:"none",borderBottom:`1px solid ${C.g2}`,lineHeight:1.6,wordBreak:"keep-all"}}>
          {item.emoji} {item.text}
        </div>
      ))}
      <BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{marginTop:32,fontSize:18,padding:"16px 48px"}}>후원하기</BG>
    </div></FI>
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
        <p style={{fontSize:16,color:C.g6,lineHeight:1.9,marginBottom:16,wordBreak:"keep-all"}}>오늘의 부모들은 넘쳐나는 정보와 높아진 기준 앞에서 오히려 더 불안하고, 더 외롭습니다. 가족을 향한 냉소적인 시선은 사회 전반에 퍼져 있고, 양육 불안은 부모가 자신의 가능성을 보지 못하게 합니다. 그 결과, 부모됨이 주는 기쁨은 가려지고 두려움이 가득해졌습니다.</p>
        <p style={{fontSize:16,color:C.g6,lineHeight:1.9,marginBottom:16,wordBreak:"keep-all"}}>더나일은 이 문제를 정면으로 바라봅니다. 그리고 이 시대에 필요한 건강하고 균형 잡힌 부모상을 사회의 새로운 기준으로 만들어 가고자 합니다.</p>
        <p style={{fontSize:16,color:C.g6,lineHeight:1.9,wordBreak:"keep-all"}}>가족을 바라보는 냉소적인 시선을 신뢰와 환대로 바꾸고, 부모 개개인이 자신 안에 이미 가진 자원을 발견하여 양육의 효능감을 회복하며, 그렇게 변화된 부모들이 모여 사회적 문화를 함께 바꾸어 나가기를 기대합니다. 부모됨이 가진 기쁨을 회복하는 것— 그것이 더 나은 다음 세대를 만드는 가장 근본적인 힘입니다.</p>
      </div></FI>
    </div>
  </Box></Sec>

  {/* 하단 CTA */}
  <Sec bg={C.navy}><Box style={{textAlign:"center"}}>
    <FI><H2 light style={{fontSize:"clamp(22px,4vw,30px)",maxWidth:560,margin:"0 auto 24px"}}>함께 걸을 날을 기다리고 있습니다</H2></FI>
    <FI delay={.1}><p style={{fontSize:18,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:520,margin:"0 auto 16px",wordBreak:"keep-all"}}>가족의 행복은 사회 전체의 행복으로 이어진다는 사실을 우리 모두는 알고 있습니다.</p></FI>
    <FI delay={.15}><p style={{fontSize:18,color:"rgba(255,255,255,.65)",lineHeight:1.9,maxWidth:520,margin:"0 auto 40px",wordBreak:"keep-all"}}>가족을 회복시키고 더 나은 세상을 만들어가는 여정. 더나일과 함께 걸어가는 페이서가 되어주세요.</p></FI>
    <FI delay={.2}><BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{fontSize:20,padding:"18px 48px"}}>지금 후원하기</BG></FI>
  </Box></Sec>
</>);

/* ═══ CONTACT — p.23 원문 ═══ */
const ContactPage=()=>{
  const[form,setForm]=useState({type:"",org:"",name:"",email:"",phone:"",msg:""});
  const[sent,setSent]=useState(false);const[sending,setSending]=useState(false);
  const handleSubmit=async()=>{
    if(!form.name||!form.email||!form.msg){alert("담당자명, 이메일, 문의 내용은 필수 항목입니다.");return;}
    setSending(true);
    try{
      const res=await fetch("https://formspree.io/f/xojpaoaz",{
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify({
          _subject:`[더나일 협력문의] ${form.type||"기타"} - ${form.org||"개인"}`,
          "문의 유형":form.type||"기타",
          "기관/회사명":form.org||"-",
          "담당자명":form.name,
          email:form.email,
          "연락처":form.phone||"-",
          "문의 내용":form.msg,
        })
      });
      if(res.ok){setSent(true)}else{alert("전송에 실패했습니다. 다시 시도해주세요.")}
    }catch(e){alert("네트워크 오류가 발생했습니다.")}
    setSending(false);
  };
  if(sent) return(<>
    <section style={{paddingTop:120,paddingBottom:80,background:C.warm,minHeight:"60vh",display:"flex",alignItems:"center"}}><Box style={{textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:24}}>✉️</div>
      <H2>문의가 전송되었습니다</H2>
      <p style={{fontSize:18,color:C.g6,lineHeight:1.8,marginTop:16}}>빠른 시일 내에 답변 드리겠습니다.<br/>감사합니다.</p>
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
                <h4 style={{fontSize:18,fontWeight:600,color:C.navy,marginBottom:4}}>{x.t}</h4>
                <p style={{fontSize:15,color:C.g6,lineHeight:1.6}}>{x.d}</p>
              </div>
            </div>
          ))}
        </div></FI>
        <FI delay={.2}><div style={{background:C.warm,borderRadius:20,padding:32,border:`1px solid ${C.g2}`,position:"sticky",top:100}}>
          <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:24}}>문의하기</h3>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:15,fontWeight:500,color:C.g6,display:"block",marginBottom:6}}>문의 유형</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["기업 CSR","강연/워크숍","기관 협업","연구 협력","후원 협약","기타"].map(t=><div key={t} onClick={()=>setForm({...form,type:t})} style={{padding:"8px 16px",borderRadius:20,fontSize:15,cursor:"pointer",background:form.type===t?C.navy:C.w,color:form.type===t?"#fff":C.g6,border:`1px solid ${form.type===t?C.navy:C.g2}`,transition:"all .2s"}}>{t}</div>)}
            </div>
          </div>
          {[{k:"org",l:"기관/회사명",p:"소속 기관 또는 회사명"},{k:"name",l:"담당자명 *",p:"성함"},{k:"email",l:"이메일 *",p:"example@company.com"},{k:"phone",l:"연락처",p:"010-0000-0000"}].map(f=>(
            <div key={f.k} style={{marginBottom:16}}>
              <label style={{fontSize:15,fontWeight:500,color:C.g6,display:"block",marginBottom:6}}>{f.l}</label>
              <input value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.p}
                style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.g2}`,fontSize:16,outline:"none",background:C.w,transition:"border .2s",fontFamily:"inherit"}}
                onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
            </div>
          ))}
          <div style={{marginBottom:24}}>
            <label style={{fontSize:15,fontWeight:500,color:C.g6,display:"block",marginBottom:6}}>문의 내용 *</label>
            <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="협력하고 싶은 내용을 자유롭게 작성해주세요." rows={5}
              style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.g2}`,fontSize:16,outline:"none",background:C.w,resize:"vertical",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
          </div>
          <BG onClick={handleSubmit} style={{width:"100%",padding:"16px",fontSize:18,textAlign:"center",opacity:sending?.6:1,pointerEvents:sending?"none":"auto"}}>{sending?"전송 중...":"문의 보내기"}</BG>
          <div style={{marginTop:24,padding:"16px 20px",background:C.w,borderRadius:12,border:`1px solid ${C.g2}`}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:600,marginBottom:8}}>직접 연락</div>
            <div style={{fontSize:15,color:C.g6,lineHeight:1.8}}>E-mail: cross@thenile.kr<br/>전화: 010-8257-1104</div>
          </div>
        </div></FI>
      </div>
    </Box></Sec>
  </>);
};

/* ═══ SHOP ═══ */
const ShopPage=()=>{
  const product={name:"더나일 상담(테스트)",price:100000,desc:"사단법인 더나일의 전문 상담 서비스입니다. 양육 관련 고민이나 가족 내 어려움에 대해 전문가와 함께 이야기를 나눌 수 있습니다.",features:["1:1 전문 상담","양육·가족 관련 주제","상담 후 맞춤 솔루션 제공"]};
  const [step,setStep]=useState("product"); // product | payment | success | fail
  const [widgets,setWidgets]=useState(null);
  const [widgetsReady,setWidgetsReady]=useState(false);
  const [paying,setPaying]=useState(false);
  const [resultInfo,setResultInfo]=useState(null);

  // URL 쿼리로 결제 결과 감지
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const status=params.get("status");
    if(status==="success"){
      setStep("success");
      setResultInfo({orderId:params.get("orderId"),paymentKey:params.get("paymentKey"),amount:params.get("amount")});
    }else if(status==="fail"){
      setStep("fail");
      setResultInfo({code:params.get("code"),message:params.get("message")});
    }
  },[]);

  // 결제 단계 진입 시 토스 위젯 로드
  useEffect(()=>{
    if(step!=="payment") return;
    let cancelled=false;
    (async()=>{
      try{
        const tossPayments=await loadTossPayments(TOSS_CLIENT_KEY);
        if(cancelled) return;
        const w=tossPayments.widgets({customerKey:ANONYMOUS});
        await w.setAmount({currency:"KRW",value:product.price});
        await Promise.all([
          w.renderPaymentMethods({selector:"#payment-method",variantKey:"DEFAULT"}),
          w.renderAgreement({selector:"#agreement",variantKey:"AGREEMENT"}),
        ]);
        if(cancelled) return;
        setWidgets(w);
        setWidgetsReady(true);
      }catch(e){
        console.error("[Toss widget load failed]",e);
        alert("결제 화면을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    })();
    return()=>{cancelled=true;};
  },[step]);

  const handlePayment=async()=>{
    if(!widgets||paying) return;
    setPaying(true);
    try{
      await widgets.requestPayment({
        orderId:"thenile_"+Date.now()+"_"+Math.random().toString(36).slice(2,8),
        orderName:product.name,
        successUrl:window.location.origin+"/shop?status=success",
        failUrl:window.location.origin+"/shop?status=fail",
        customerEmail:"customer@thenile.kr",
        customerName:"더나일 고객",
      });
    }catch(e){
      console.error("[Toss requestPayment failed]",e);
      setPaying(false);
    }
  };

  return(<>
    <section style={{paddingTop:120,paddingBottom:48,background:C.warm}}><Box>
      <FI><Tag>SHOP</Tag></FI>
      <FI delay={.1}><H2>상품</H2></FI>
      <FI delay={.2}><Desc>더나일의 전문 서비스를 만나보세요.</Desc></FI>
    </Box></section>

    {/* 단계 인디케이터 */}
    {(step==="product"||step==="payment")&&(
      <Sec bg={C.w} style={{paddingTop:32,paddingBottom:16}}><Box>
        <div style={{display:"flex",justifyContent:"center",gap:12,fontSize:15,color:C.g4,fontWeight:500}}>
          <span style={{color:step==="product"?C.navy:C.gold,fontWeight:step==="product"?700:600}}>① 상품 확인</span>
          <span style={{color:C.g2}}>→</span>
          <span style={{color:step==="payment"?C.navy:C.g4,fontWeight:step==="payment"?700:500}}>② 결제</span>
          <span style={{color:C.g2}}>→</span>
          <span>③ 완료</span>
        </div>
      </Box></Sec>
    )}

    {/* STEP: 상품 정보 */}
    {step==="product"&&(
      <Sec bg={C.w} style={{paddingTop:24}}><Box>
        <FI><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:48,alignItems:"start"}}>
          <div style={{background:C.warm,borderRadius:20,padding:48,display:"flex",alignItems:"center",justifyContent:"center",minHeight:320,border:`1px solid ${C.g2}`}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
                <span style={{fontSize:36,color:"#fff"}}>💬</span>
              </div>
              <p style={{fontSize:16,color:C.g6}}>Professional Counseling</p>
            </div>
          </div>
          <div>
            <h3 style={{fontSize:24,fontWeight:700,color:C.navy,marginBottom:12,fontFamily:"'Noto Serif KR',serif"}}>{product.name}</h3>
            <div style={{fontSize:28,fontWeight:700,color:C.gold,marginBottom:24}}>{product.price.toLocaleString()}원</div>
            <p style={{fontSize:17,color:C.g6,lineHeight:1.8,marginBottom:32,wordBreak:"keep-all"}}>{product.desc}</p>
            <div style={{marginBottom:32}}>
              {product.features.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.g1}`}}>
                <div style={{width:6,height:6,borderRadius:3,background:C.gold,flexShrink:0}}/>
                <span style={{fontSize:16,color:C.navy,fontWeight:500}}>{f}</span>
              </div>)}
            </div>
            <Btn onClick={()=>setStep("payment")} style={{width:"100%",textAlign:"center",fontSize:18,padding:"16px 32px"}}>구매하기</Btn>
            <p style={{fontSize:12,color:C.g6,marginTop:12,textAlign:"center"}}>결제 진행 후 담당자가 상담 일정을 안내드립니다.</p>
          </div>
        </div></FI>
      </Box></Sec>
    )}

    {/* STEP: 결제 */}
    {step==="payment"&&(
      <Sec bg={C.w} style={{paddingTop:24}}><Box style={{maxWidth:760}}>
        {/* 주문 요약 */}
        <FI><div style={{background:C.warm,borderRadius:16,padding:"24px 28px",marginBottom:32,border:`1px solid ${C.g2}`}}>
          <div style={{fontSize:12,color:C.g4,fontWeight:600,marginBottom:8,letterSpacing:".08em"}}>주문 상품</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:12}}>
            <div style={{fontSize:20,fontWeight:700,color:C.navy}}>{product.name}</div>
            <div style={{fontSize:22,fontWeight:700,color:C.gold}}>{product.price.toLocaleString()}원</div>
          </div>
        </div></FI>

        {/* 토스 결제수단 위젯 */}
        <FI delay={.1}><div style={{marginBottom:16}}>
          <h4 style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:10}}>결제수단 선택</h4>
          <div id="payment-method" style={{minHeight:200,background:C.w,borderRadius:12,border:`1px solid ${C.g2}`}}/>
        </div></FI>

        {/* 약관 동의 위젯 */}
        <FI delay={.15}><div style={{marginBottom:24}}>
          <h4 style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:10}}>약관 동의</h4>
          <div id="agreement" style={{background:C.w,borderRadius:12,border:`1px solid ${C.g2}`}}/>
        </div></FI>

        {!widgetsReady&&(
          <div style={{textAlign:"center",padding:"20px 0",fontSize:15,color:C.g4}}>결제 화면을 불러오는 중입니다…</div>
        )}

        {/* 결제하기 / 뒤로가기 */}
        <FI delay={.2}><div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}>
          <button onClick={()=>setStep("product")} style={{flex:"0 0 auto",padding:"16px 24px",fontSize:16,background:C.w,color:C.g6,border:`1px solid ${C.g2}`,borderRadius:10,cursor:"pointer",fontWeight:500}}>← 이전</button>
          <BG onClick={handlePayment} disabled={!widgetsReady||paying} style={{flex:1,textAlign:"center",fontSize:18,padding:"16px 32px",opacity:(!widgetsReady||paying)?.5:1,cursor:(!widgetsReady||paying)?"not-allowed":"pointer"}}>
            {paying?"결제창 여는 중…":`${product.price.toLocaleString()}원 결제하기`}
          </BG>
        </div></FI>

        <p style={{fontSize:12,color:C.g4,marginTop:16,textAlign:"center",lineHeight:1.6,wordBreak:"keep-all"}}>
          본 결제는 토스페이먼츠 보안 결제창을 통해 안전하게 처리됩니다.<br/>
          결제 후 7일 이내 미이용 시 전액 환불됩니다. (자세한 사항은 <span onClick={()=>{window.history.pushState({},"","/refund");window.dispatchEvent(new PopStateEvent("popstate"));}} style={{color:C.gold,cursor:"pointer",textDecoration:"underline"}}>환불 정책</span> 참조)
        </p>
      </Box></Sec>
    )}

    {/* STEP: 결제 성공 */}
    {step==="success"&&(
      <Sec bg={C.w}><Box style={{maxWidth:560,textAlign:"center"}}>
        <FI>
          <div style={{width:80,height:80,borderRadius:"50%",background:`${C.gold}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:40}}>✓</div>
          <h3 style={{fontSize:24,fontWeight:700,color:C.navy,marginBottom:16,fontFamily:"'Noto Serif KR',serif"}}>결제가 완료되었습니다</h3>
          <p style={{fontSize:17,color:C.g6,lineHeight:1.8,marginBottom:32,wordBreak:"keep-all"}}>담당자가 곧 연락드려 상담 일정을 안내드립니다.</p>
          {resultInfo&&(
            <div style={{textAlign:"left",background:C.warm,padding:"20px 24px",borderRadius:12,marginBottom:32,fontSize:15,color:C.g6,lineHeight:1.9,wordBreak:"break-all"}}>
              <div><strong style={{color:C.navy}}>주문번호</strong> : {resultInfo.orderId}</div>
              <div><strong style={{color:C.navy}}>결제금액</strong> : {Number(resultInfo.amount).toLocaleString()}원</div>
              <div><strong style={{color:C.navy}}>결제키</strong> : {resultInfo.paymentKey}</div>
            </div>
          )}
          <Btn onClick={()=>{window.history.pushState({},"","/shop");setStep("product");setResultInfo(null);}} style={{fontSize:16,padding:"12px 32px"}}>상품 페이지로 돌아가기</Btn>
        </FI>
      </Box></Sec>
    )}

    {/* STEP: 결제 실패 */}
    {step==="fail"&&(
      <Sec bg={C.w}><Box style={{maxWidth:560,textAlign:"center"}}>
        <FI>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:40,color:"#DC2626"}}>✕</div>
          <h3 style={{fontSize:24,fontWeight:700,color:C.navy,marginBottom:16,fontFamily:"'Noto Serif KR',serif"}}>결제가 완료되지 않았습니다</h3>
          {resultInfo&&resultInfo.message&&(
            <p style={{fontSize:16,color:C.g6,lineHeight:1.8,marginBottom:32,wordBreak:"keep-all"}}>{resultInfo.message}</p>
          )}
          <Btn onClick={()=>{window.history.pushState({},"","/shop");setStep("product");setResultInfo(null);}} style={{fontSize:16,padding:"12px 32px"}}>다시 시도하기</Btn>
        </FI>
      </Box></Sec>
    )}
  </>);
};

/* ═══ COUNSEL — 페이서 전용상담 ═══ */
const CONCERN_OPTIONS=["훈육/행동지도","정서/심리 발달","학습/교육","형제자매 관계","부모-자녀 의사소통","또래 관계","기타"];
const TIME_SLOTS=[];
for(let h=9;h<18;h++){TIME_SLOTS.push(`${String(h).padStart(2,"0")}:00`);TIME_SLOTS.push(`${String(h).padStart(2,"0")}:30`)}
TIME_SLOTS.push("18:00");

/* ═══ 환불 정책 페이지 (카드사 심사용) ═══ */
const RefundPage=()=>(<>
  <section style={{paddingTop:120,paddingBottom:60,background:C.warm}}><Box>
    <FI><Tag>REFUND POLICY</Tag></FI>
    <FI delay={.1}><H2>환불 정책</H2></FI>
    <FI delay={.2}><Desc>사단법인 더나일이 제공하는 상담 서비스의 환불 및 취소 규정입니다.</Desc></FI>
  </Box></section>
  <Sec bg={C.w}><Box>
    <FI><div style={{maxWidth:820,margin:"0 auto",fontSize:17,color:C.g6,lineHeight:1.95,wordBreak:"keep-all"}}>

      <div style={{padding:"24px 28px",background:C.warm,borderRadius:12,marginBottom:32,borderLeft:`4px solid ${C.gold}`}}>
        <div style={{fontSize:15,color:C.gold,fontWeight:700,marginBottom:6,letterSpacing:".05em"}}>적용 대상</div>
        <p style={{margin:0,color:C.navy,fontSize:16}}>본 환불 정책은 사단법인 더나일(www.thenile.kr)에서 제공하는 모든 상담·교육 서비스 및 디지털 콘텐츠에 적용됩니다.</p>
      </div>

      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginTop:40,marginBottom:16}}>제1조 환불 신청 가능 기간</h3>
      <p style={{marginBottom:12}}>① 결제일로부터 <strong style={{color:C.navy}}>7일 이내</strong>에 서비스 이용을 시작하지 않은 경우, 전액 환불이 가능합니다.</p>
      <p style={{marginBottom:12}}>② 서비스 이용이 시작된 경우, 이용한 회차·기간에 따라 차감 후 환불됩니다(제3조 참조).</p>
      <p style={{marginBottom:0}}>③ 환불 신청은 cross@thenile.kr 또는 010-8257-1104으로 접수해 주세요.</p>

      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginTop:40,marginBottom:16}}>제2조 환불이 가능한 경우</h3>
      <p style={{marginBottom:12}}>① 본 법인의 귀책 사유로 서비스가 정상 제공되지 못한 경우, 전액 환불됩니다.</p>
      <p style={{marginBottom:12}}>② 서비스 시작 전 결제 취소를 요청한 경우, 전액 환불됩니다.</p>
      <p style={{marginBottom:0}}>③ 결제 수단의 오류·중복 결제 등 시스템적 오류가 발생한 경우, 확인 후 즉시 환불 처리됩니다.</p>

      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginTop:40,marginBottom:16}}>제3조 환불 금액 계산 방식</h3>
      <p style={{marginBottom:12}}>① 단회성 상담의 경우, 상담 시작 전 취소 시 전액, 시작 후 취소 시 환불이 제한됩니다.</p>
      <p style={{marginBottom:12}}>② 다회 프로그램(예: 6주 프로젝트)의 경우, 다음 기준으로 환불됩니다.</p>
      <div style={{padding:"16px 20px",background:C.warm,borderRadius:8,marginBottom:12}}>
        <p style={{marginBottom:8,fontSize:16}}>· 프로그램 시작 전 : 전액 환불</p>
        <p style={{marginBottom:8,fontSize:16}}>· 전체 일정의 1/3 이내 진행 시 : 결제 금액의 2/3 환불</p>
        <p style={{marginBottom:8,fontSize:16}}>· 전체 일정의 1/2 이내 진행 시 : 결제 금액의 1/2 환불</p>
        <p style={{margin:0,fontSize:16}}>· 전체 일정의 1/2 초과 진행 시 : 환불 불가</p>
      </div>
      <p style={{marginBottom:0}}>③ 환불 금액은 카드 결제 취소 또는 계좌 이체로 환급되며, 카드 취소의 경우 카드사 정책에 따라 2~7영업일 소요됩니다.</p>

      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginTop:40,marginBottom:16}}>제4조 환불이 제한되는 경우</h3>
      <p style={{marginBottom:12}}>① 회원의 단순 변심으로 인한 환불 요청이 서비스 시작 후 발생한 경우</p>
      <p style={{marginBottom:12}}>② 서비스의 일부 또는 전부를 이용한 후 환불을 요청한 경우(제3조 비율 적용)</p>
      <p style={{marginBottom:0}}>③ 다운로드 가능한 디지털 자료가 제공된 경우, 해당 자료에 한해 환불이 제한될 수 있습니다.</p>

      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginTop:40,marginBottom:16}}>제5조 환불 절차</h3>
      <ol style={{paddingLeft:20,marginBottom:0}}>
        <li style={{marginBottom:8}}>cross@thenile.kr 또는 010-8257-1104로 환불 요청 (이름·결제일·결제 수단 명시)</li>
        <li style={{marginBottom:8}}>본 법인이 환불 사유와 회차를 확인하여 환불 가능 여부 및 금액을 안내</li>
        <li style={{marginBottom:8}}>회원 동의 후 결제 수단 환급 또는 계좌 이체로 환불</li>
        <li style={{marginBottom:0}}>환불 처리 완료 시 이메일로 결과 통보</li>
      </ol>

      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginTop:40,marginBottom:16}}>제6조 문의</h3>
      <p style={{marginBottom:8}}>환불 관련 문의는 아래로 연락 주세요.</p>
      <div style={{padding:"20px 24px",background:C.warm,borderRadius:12,marginTop:12}}>
        <p style={{marginBottom:6,fontSize:16}}><strong style={{color:C.navy}}>사단법인 더나일</strong></p>
        <p style={{marginBottom:6,fontSize:16}}>대표자 : 이다랑</p>
        <p style={{marginBottom:6,fontSize:16}}>사업자등록번호 : 438-82-00797</p>
        <p style={{marginBottom:6,fontSize:16}}>주소 : 서울특별시 성동구 뚝섬로1나길 5, 7층 S721호(성수동1가, 헤이그라운드)</p>
        <p style={{marginBottom:6,fontSize:16}}>전화 : 010-8257-1104</p>
        <p style={{margin:0,fontSize:16}}>이메일 : cross@thenile.kr</p>
      </div>

      <p style={{marginTop:40,paddingTop:24,borderTop:`1px solid ${C.g2}`,fontSize:15,color:C.g4,textAlign:"right"}}>본 환불 정책은 2026년 5월 1일부터 시행됩니다.</p>
    </div></FI>
  </Box></Sec>
</>);

/* ═══ 2026 양육불안 컨퍼런스 페이지 ═══ */
/* 자체 모달 폼 → Google Forms POST → 시트 자동 누적 → Apps Script 트리거
   → [참가] 솔라피 SMS / [제휴] lin@sheventures.kr 이메일 */
/* 폼 ID는 응답 POST endpoint용 'hashed ID' (편집 URL ID와 다름) */
const CONFERENCE_APPLY_FORM_ID="1FAIpQLSfIiuqQmHDgQcFz9DX-WYpYnXnxrSNStY0eSvcePR5RUghzCw";
const CONFERENCE_PARTNER_FORM_ID="1FAIpQLSdxQHlM5yd2p6IgQjGib_Gtopbmh4YKcAKxXOtGz7bYfRyHRQ";
const APPLY_ENTRIES={
  name:"entry.1955864862",
  phone:"entry.769543470",
  email:"entry.910879252",
  type:"entry.1151620531",
  session:"entry.737504116",  // 폼 자체 필드는 살아있으므로 silent reject 방지용 기본값 자동 전송
  childAge:"entry.203192727",
  channel:"entry.1278543734",
  message:"entry.133618965",
  agree:"entry.761898604",
};
const PARTNER_ENTRIES={
  company:"entry.739365890",
  contact:"entry.594331275",
  position:"entry.764472418",
  phone:"entry.2141595619",
  email:"entry.1963085748",
  type:"entry.299743863",
  message:"entry.1814694000",
  agree:"entry.125344078",
};

/* 구글 폼 제출 — hidden iframe + form submit 방식.
   fetch + no-cors 는 Google Forms 가 silent reject 하는 경우 있어 비추.
   iframe target 방식은 cross-origin form post 가 정상 처리되는 표준 우회법. */
function submitToGoogleForm(formId,entries,values){
  return new Promise((resolve)=>{
    const iframeName="gf-"+Date.now()+"-"+Math.floor(Math.random()*9999);
    const iframe=document.createElement("iframe");
    iframe.name=iframeName;
    iframe.style.cssText="position:absolute;width:0;height:0;border:0;visibility:hidden;left:-9999px;top:-9999px";
    document.body.appendChild(iframe);

    const form=document.createElement("form");
    form.action=`https://docs.google.com/forms/d/e/${formId}/formResponse`;
    form.method="POST";
    form.target=iframeName;
    form.style.cssText="position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;left:-9999px;top:-9999px";

    Object.entries(values).forEach(([k,v])=>{
      if(v===true) v="동의합니다";
      if(v===undefined||v===null||v===""||v===false) return;
      const eid=entries[k];if(!eid) return;
      const arr=Array.isArray(v)?v:[v];
      arr.forEach(val=>{
        const input=document.createElement("input");
        input.type="hidden";
        input.name=eid;
        input.value=String(val);
        form.appendChild(input);
      });
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(()=>{
      try{form.remove()}catch(e){}
      try{iframe.remove()}catch(e){}
      resolve();
    },1500);
  });
}

/* 폼 공통 스타일 */
const FF_INPUT={width:"100%",padding:"11px 14px",fontSize:16,border:`1px solid ${C.g2}`,borderRadius:10,background:"#fff",color:"#2A1F1A",fontFamily:"inherit",boxSizing:"border-box",outline:"none",transition:"border-color .15s"};
const FF_LABEL={display:"block",fontSize:15,fontWeight:600,color:"#2A1F1A",marginBottom:6};

/* 필드 헬퍼 */
const FormField=({label,required,children,help})=>(
  <div style={{marginBottom:16}}>
    <label style={FF_LABEL}>{label}{required&&<span style={{color:CC.coral,marginLeft:4}}>*</span>}</label>
    {children}
    {help&&<div style={{fontSize:11,color:"#9B9B93",marginTop:4,lineHeight:1.5}}>{help}</div>}
  </div>
);

/* 라디오 그룹 */
const RadioGroup=({name,options,value,onChange,accent=CC.coral})=>(
  <div style={{display:"grid",gap:8}}>
    {options.map(opt=>(
      <label key={opt} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:`1px solid ${value===opt?accent:C.g2}`,background:value===opt?`${accent}10`:"#fff",cursor:"pointer",transition:"all .15s",fontSize:16,color:"#2A1F1A"}}>
        <input type="radio" name={name} value={opt} checked={value===opt} onChange={()=>onChange(opt)} style={{accentColor:accent,margin:0}}/>
        <span>{opt}</span>
      </label>
    ))}
  </div>
);

/* 모달 컨테이너 */
const ConfModal=({open,onClose,children,accent=CC.coral,title,subtitle})=>{
  useEffect(()=>{
    if(!open) return;
    document.body.style.overflow="hidden";
    const onEsc=e=>{if(e.key==="Escape") onClose()};
    window.addEventListener("keydown",onEsc);
    return()=>{document.body.style.overflow="";window.removeEventListener("keydown",onEsc)};
  },[open,onClose]);
  if(!open) return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(20,15,12,.6)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",overflowY:"auto"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,maxWidth:560,width:"100%",position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,.25)",overflow:"hidden"}}>
        <div style={{padding:"28px 32px 20px",borderBottom:`1px solid ${C.g1}`,position:"sticky",top:0,background:"#fff",zIndex:2}}>
          <button onClick={onClose} aria-label="닫기" style={{position:"absolute",top:20,right:20,width:36,height:36,borderRadius:"50%",background:"#FAFAF5",border:"none",cursor:"pointer",fontSize:18,color:"#5A5650",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <div style={{fontSize:11,color:accent,fontWeight:700,letterSpacing:".15em",marginBottom:6}}>{subtitle}</div>
          <h3 style={{fontFamily:"'Noto Serif KR',serif",fontSize:22,fontWeight:800,color:"#2A1F1A",margin:0,lineHeight:1.3}}>{title}</h3>
        </div>
        <div style={{padding:"24px 32px 32px"}}>{children}</div>
      </div>
    </div>
  );
};

/* 참가 신청 모달 */
const ApplyFormModal=({open,onClose})=>{
  const [step,setStep]=useState("form");
  const [v,setV]=useState({name:"",phone:"",email:"",type:"",childAge:"",channel:"",message:"",agree:false});
  const upd=(k,val)=>setV(p=>({...p,[k]:val}));
  const reset=()=>{setStep("form");setV({name:"",phone:"",email:"",type:"",childAge:"",channel:"",message:"",agree:false})};
  const handleClose=()=>{onClose();setTimeout(reset,200)};
  const handleSubmit=async e=>{
    e.preventDefault();
    if(!v.name||!v.phone||!v.email||!v.type||!v.agree){alert("필수 항목을 모두 입력해 주세요.");return}
    setStep("submitting");
    try{
      // 폼의 "참여 희망 세션" 라디오 필드는 옛 옵션 ("SESSION 2-1 · 인터뷰 (메인홀)") 만 존재함.
      // 라디오는 정의된 옵션 값만 받기 때문에 임의 문자열 보내면 silent reject.
      // 따라서 폼에 실제 존재하는 옵션 값을 그대로 전송.
      await submitToGoogleForm(CONFERENCE_APPLY_FORM_ID,APPLY_ENTRIES,{...v,session:v.session||"SESSION 2-1 · 인터뷰 (메인홀)"});
      setStep("success");
    }catch(err){console.error(err);setStep("error")}
  };
  return(
    <ConfModal open={open} onClose={handleClose} accent={CC.coral} subtitle="2026 양육불안 컨퍼런스 · 참가 신청" title="신청서 작성">
      {step==="form"&&(
        <form onSubmit={handleSubmit}>
          <FormField label="이름" required>
            <input type="text" value={v.name} onChange={e=>upd("name",e.target.value)} style={FF_INPUT} placeholder="홍길동"/>
          </FormField>
          <FormField label="연락처" required help="문자 안내 발송에 사용됩니다">
            <input type="tel" value={v.phone} onChange={e=>upd("phone",e.target.value)} style={FF_INPUT} placeholder="010-0000-0000"/>
          </FormField>
          <FormField label="이메일" required>
            <input type="email" value={v.email} onChange={e=>upd("email",e.target.value)} style={FF_INPUT} placeholder="you@example.com"/>
          </FormField>
          <FormField label="참가자 유형" required>
            <RadioGroup name="type" options={["부모","학계 · 정책 전문가","미디어","페이서","기타"]} value={v.type} onChange={x=>upd("type",x)}/>
          </FormField>
          <FormField label="양육 자녀 연령대 (선택)">
            <select value={v.childAge} onChange={e=>upd("childAge",e.target.value)} style={FF_INPUT}>
              <option value="">선택 안 함</option>
              {["영유아 (0–3세)","미취학 (4–6세)","초등","중·고등","해당없음"].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="알게 된 경로 (선택)">
            <input type="text" value={v.channel} onChange={e=>upd("channel",e.target.value)} style={FF_INPUT} placeholder="예: 인스타그램, 지인 추천, 더나일 뉴스레터 등"/>
          </FormField>
          <FormField label="가장 듣고 싶은 이야기 (선택)">
            <textarea value={v.message} onChange={e=>upd("message",e.target.value)} style={{...FF_INPUT,minHeight:80,resize:"vertical",fontFamily:"inherit"}} placeholder="컨퍼런스에서 풀리길 바라는 양육불안에 대해 자유롭게 적어주세요."/>
          </FormField>
          <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",background:CC.cream,borderRadius:10,cursor:"pointer",marginTop:8}}>
            <input type="checkbox" checked={v.agree} onChange={e=>upd("agree",e.target.checked)} style={{accentColor:CC.coral,marginTop:2,flexShrink:0}}/>
            <span style={{fontSize:15,color:"#2A1F1A",lineHeight:1.6,wordBreak:"keep-all"}}>
              <strong style={{color:CC.coral}}>(필수)</strong> 개인정보 수집·이용에 동의합니다. 수집 항목: 이름·연락처·이메일·참가자 유형 등. 이용 목적: 컨퍼런스 참가 안내 및 통계. 보관 기간: 행사 종료 후 6개월.
            </span>
          </label>
          <button type="submit" style={{marginTop:24,width:"100%",padding:"16px",background:CC.ink,color:CC.cream,border:"none",borderRadius:50,fontSize:18,fontWeight:700,cursor:"pointer",letterSpacing:".02em",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background=CC.coral} onMouseLeave={e=>e.currentTarget.style.background=CC.ink}>신청서 제출하기</button>
        </form>
      )}
      {step==="submitting"&&(
        <div style={{padding:"40px 0",textAlign:"center"}}>
          <div style={{width:48,height:48,border:`3px solid ${CC.coral}33`,borderTopColor:CC.coral,borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/>
          <div style={{fontSize:16,color:"#5A5650"}}>신청서를 제출하는 중입니다…</div>
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {step==="success"&&(
        <div style={{padding:"32px 0 16px",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:`${CC.coral}22`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36,color:CC.coral}}>✓</div>
          <h4 style={{fontSize:20,fontWeight:800,color:"#2A1F1A",marginBottom:12,fontFamily:"'Noto Serif KR',serif"}}>신청이 접수되었습니다</h4>
          <p style={{fontSize:16,color:"#5A5650",lineHeight:1.8,marginBottom:28,wordBreak:"keep-all"}}>제출하신 정보로 행사 관련 안내를 드립니다.<br/>선착순 모집으로 정원이 차면 마감됩니다.</p>
          <button onClick={handleClose} style={{padding:"12px 32px",background:CC.coral,color:"#fff",border:"none",borderRadius:50,fontSize:16,fontWeight:700,cursor:"pointer"}}>확인</button>
        </div>
      )}
      {step==="error"&&(
        <div style={{padding:"32px 0 16px",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36,color:"#DC2626"}}>!</div>
          <h4 style={{fontSize:18,fontWeight:800,color:"#2A1F1A",marginBottom:12}}>제출 중 오류가 발생했습니다</h4>
          <p style={{fontSize:16,color:"#5A5650",lineHeight:1.8,marginBottom:24,wordBreak:"keep-all"}}>잠시 후 다시 시도해 주세요. 계속 문제가 발생하면 cross@thenile.kr 로 연락 부탁드립니다.</p>
          <button onClick={()=>setStep("form")} style={{padding:"12px 32px",background:CC.coral,color:"#fff",border:"none",borderRadius:50,fontSize:16,fontWeight:700,cursor:"pointer"}}>다시 시도</button>
        </div>
      )}
    </ConfModal>
  );
};

/* 기업 제휴 모달 */
const PartnerFormModal=({open,onClose})=>{
  const [step,setStep]=useState("form");
  const [v,setV]=useState({company:"",contact:"",position:"",phone:"",email:"",type:"",message:"",agree:false});
  const upd=(k,val)=>setV(p=>({...p,[k]:val}));
  const reset=()=>{setStep("form");setV({company:"",contact:"",position:"",phone:"",email:"",type:"",message:"",agree:false})};
  const handleClose=()=>{onClose();setTimeout(reset,200)};
  const handleSubmit=async e=>{
    e.preventDefault();
    if(!v.company||!v.contact||!v.phone||!v.email||!v.agree){alert("필수 항목을 모두 입력해 주세요.");return}
    setStep("submitting");
    try{
      await submitToGoogleForm(CONFERENCE_PARTNER_FORM_ID,PARTNER_ENTRIES,v);
      setStep("success");
    }catch(err){console.error(err);setStep("error")}
  };
  return(
    <ConfModal open={open} onClose={handleClose} accent={CC.sage} subtitle="2026 양육불안 컨퍼런스 · 기업 제휴" title="함께 걸어요 · 제휴 문의">
      {step==="form"&&(
        <form onSubmit={handleSubmit}>
          <FormField label="기업/기관명" required>
            <input type="text" value={v.company} onChange={e=>upd("company",e.target.value)} style={FF_INPUT}/>
          </FormField>
          <FormField label="담당자명" required>
            <input type="text" value={v.contact} onChange={e=>upd("contact",e.target.value)} style={FF_INPUT}/>
          </FormField>
          <FormField label="직책 (선택)">
            <input type="text" value={v.position} onChange={e=>upd("position",e.target.value)} style={FF_INPUT}/>
          </FormField>
          <FormField label="연락처" required>
            <input type="tel" value={v.phone} onChange={e=>upd("phone",e.target.value)} style={FF_INPUT} placeholder="010-0000-0000"/>
          </FormField>
          <FormField label="이메일" required>
            <input type="email" value={v.email} onChange={e=>upd("email",e.target.value)} style={FF_INPUT} placeholder="you@company.com"/>
          </FormField>
          <FormField label="함께하고 싶은 방식 (선택)">
            <RadioGroup name="ptype" options={["현금 후원","현물 · 서비스 협찬","콘텐츠 협력","기타 · 상담하며 결정"]} value={v.type} onChange={x=>upd("type",x)} accent={CC.sage}/>
          </FormField>
          <FormField label="메시지 (선택)" help="함께하고 싶은 이유, 구체적 제안 등 자유롭게 적어주세요.">
            <textarea value={v.message} onChange={e=>upd("message",e.target.value)} style={{...FF_INPUT,minHeight:100,resize:"vertical",fontFamily:"inherit"}}/>
          </FormField>
          <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",background:CC.cream,borderRadius:10,cursor:"pointer",marginTop:8}}>
            <input type="checkbox" checked={v.agree} onChange={e=>upd("agree",e.target.checked)} style={{accentColor:CC.sage,marginTop:2,flexShrink:0}}/>
            <span style={{fontSize:15,color:"#2A1F1A",lineHeight:1.6,wordBreak:"keep-all"}}>
              <strong style={{color:CC.sage}}>(필수)</strong> 개인정보 수집·이용에 동의합니다. 수집 항목: 담당자 정보 및 기업/기관명. 이용 목적: 제휴 검토 및 회신. 보관 기간: 회신 후 1년.
            </span>
          </label>
          <button type="submit" style={{marginTop:24,width:"100%",padding:"16px",background:CC.ink,color:CC.cream,border:"none",borderRadius:50,fontSize:18,fontWeight:700,cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background=CC.sage} onMouseLeave={e=>e.currentTarget.style.background=CC.ink}>제휴 문의 보내기</button>
        </form>
      )}
      {step==="submitting"&&(
        <div style={{padding:"40px 0",textAlign:"center"}}>
          <div style={{width:48,height:48,border:`3px solid ${CC.sage}33`,borderTopColor:CC.sage,borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/>
          <div style={{fontSize:16,color:"#5A5650"}}>전송 중입니다…</div>
        </div>
      )}
      {step==="success"&&(
        <div style={{padding:"32px 0 16px",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:`${CC.sage}22`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36,color:CC.sage}}>✓</div>
          <h4 style={{fontSize:20,fontWeight:800,color:"#2A1F1A",marginBottom:12,fontFamily:"'Noto Serif KR',serif"}}>문의가 전달되었습니다</h4>
          <p style={{fontSize:16,color:"#5A5650",lineHeight:1.8,marginBottom:28,wordBreak:"keep-all"}}>담당자가 영업일 기준 3일 이내에 회신드리겠습니다.<br/>관심과 시간 내어 주셔서 감사합니다.</p>
          <button onClick={handleClose} style={{padding:"12px 32px",background:CC.sage,color:"#fff",border:"none",borderRadius:50,fontSize:16,fontWeight:700,cursor:"pointer"}}>확인</button>
        </div>
      )}
      {step==="error"&&(
        <div style={{padding:"32px 0 16px",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36,color:"#DC2626"}}>!</div>
          <h4 style={{fontSize:18,fontWeight:800,color:"#2A1F1A",marginBottom:12}}>전송 중 오류가 발생했습니다</h4>
          <p style={{fontSize:16,color:"#5A5650",lineHeight:1.8,marginBottom:24,wordBreak:"keep-all"}}>cross@thenile.kr 로 직접 문의 부탁드립니다.</p>
          <button onClick={()=>setStep("form")} style={{padding:"12px 32px",background:CC.sage,color:"#fff",border:"none",borderRadius:50,fontSize:16,fontWeight:700,cursor:"pointer"}}>다시 시도</button>
        </div>
      )}
    </ConfModal>
  );
};

/* 컨퍼런스 전용 컬러 토큰 — Gradient Emotion 톤, 따뜻한 파스텔 위주 */
const CC={
  /* 메인 컬러 (진한) */
  coral:"#FF6B6B",peach:"#FF9A6B",mango:"#FFC93C",mint:"#5DD4A8",sage:"#9BC59D",
  sky:"#7DB9E8",lilac:"#B89AE6",rose:"#F08CB5",sand:"#E8B679",
  /* 옅은 배경 컬러 */
  cream:"#FFF8EC",blush:"#FDEEEA",mintL:"#E8F7EF",lilacL:"#F0E9F9",peachL:"#FFEFE3",
  mangoL:"#FFF4D6",skyL:"#E8F2FB",roseL:"#FCE8F0",sageL:"#EEF4EE",
  /* 잉크 (배경용 다크) */
  ink:"#2A1F1A",inkBrown:"#3D2E26"
};

/* Gradient Emotion 도형 — SVG로 그린 친근한 캐릭터 모양들 */
const EmoShape=({shape="blob",c1="#FF6B6B",c2="#FFC93C",size=80,style={},eyes=true,rotate=0})=>{
  const id=`eg-${c1.slice(1)}-${c2.slice(1)}-${shape}`;
  const paths={
    blob:"M50 8c18 0 34 12 38 28s-6 36-22 44-38 4-46-10-6-34 6-46S38 8 50 8z",
    star:"M50 8l9 24h25l-20 15 8 25-22-15-22 15 8-25L16 32h25z",
    heart:"M50 84C30 70 14 56 14 38c0-12 9-22 21-22 8 0 12 4 15 9 3-5 7-9 15-9 12 0 21 10 21 22 0 18-16 32-36 46z",
    cloud:"M30 70c-12 0-20-8-20-18 0-9 7-16 16-17 1-13 12-23 26-23 13 0 24 9 26 21 11 1 18 9 18 18 0 11-9 19-20 19H30z",
    drop:"M50 8c10 18 30 32 30 50 0 16-13 28-30 28S20 74 20 58c0-18 20-32 30-50z",
    arch:"M16 90V46c0-19 15-34 34-34s34 15 34 34v44H16z",
    flower:"M50 18c0-6 5-10 10-10s10 5 10 10c0 4-2 7-5 9 5 1 9 5 9 10s-4 9-9 10c3 2 5 5 5 9 0 6-5 10-10 10s-10-4-10-10c-2 4-6 6-10 6-6 0-10-5-10-10s4-9 10-9c-4-2-6-5-6-9 0-5 4-9 9-10-3-2-5-5-5-9 0-5 4-9 9-9 5 0 9 4 10 9z",
    burst:"M50 4l8 14 16-6-2 17 16 5-12 12 12 12-16 5 2 17-16-6-8 14-8-14-16 6 2-17-16-5 12-12-12-12 16-5-2-17 16 6z",
    pebble:"M50 12c20 0 36 14 36 34S70 88 50 88 14 72 14 46s16-34 36-34z",
    leaf:"M50 8C30 24 14 40 14 60c0 16 14 28 36 28s36-12 36-28C86 40 70 24 50 8z",
  };
  const d=paths[shape]||paths.blob;
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" style={{display:"block",transform:rotate?`rotate(${rotate}deg)`:undefined,...style}}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1}/>
          <stop offset="100%" stopColor={c2}/>
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`}/>
      {eyes&&<g fill="#1a1a1a">
        <ellipse cx="40" cy="45" rx="2.5" ry="3.5"/>
        <ellipse cx="60" cy="45" rx="2.5" ry="3.5"/>
      </g>}
    </svg>
  );
};

const ConferencePage=()=>{
  /* 통일된 컬러 운용:
     · SESSION 1 (키노트)       — coral
     · SESSION 2 (패널토크)     — lilac
     배경: cream / white / inkBrown 3톤만 alternating */
  const speakers=[
    {n:"장동선",r:"뇌과학자",img:"/images/speakers/장동선.png",part:"SESSION 1",color:CC.coral,c2:CC.peach,sh:"burst"},
    {n:"이다랑",r:"아동심리전문가 · 사단법인 더나일 이사장",img:"/images/speakers/이다랑.png",part:"SESSION 1",color:CC.coral,c2:CC.rose,sh:"heart"},
    {n:"김혜민",r:"사회자 · 사단법인 더나일 이사",img:"/images/김혜민.jpg",part:"SESSION 1",color:CC.coral,c2:CC.mango,sh:"flower"},
    {n:"이혜린",r:"쉬벤처스 부대표 · 사단법인 더나일 이사",img:"/images/speakers/이혜린.png",part:"SESSION 2",color:CC.lilac,c2:CC.rose,sh:"pebble"},
    {n:"신두란",r:"고마워서그래 대표",img:"/images/speakers/신두란.png",part:"SESSION 2",color:CC.lilac,c2:CC.coral,sh:"flower"},
    {n:"정지우",r:"작가 · 변호사",img:"/images/speakers/정지우.png",part:"SESSION 2",color:CC.lilac,c2:CC.sage,sh:"arch"},
    {n:"후추맘",r:"육아 크리에이터",img:"/images/speakers/후추맘.png",part:"SESSION 2",color:CC.lilac,c2:CC.mint,sh:"leaf"},
  ];
  const [showApply,setShowApply]=useState(false);
  const [showPartner,setShowPartner]=useState(false);
  /* D-Day 카운트다운 (컨퍼런스: 2026-07-09 11:00 KST) */
  const [dday,setDday]=useState(null);
  const [stickyVisible,setStickyVisible]=useState(false);
  useEffect(()=>{
    const eventTs=new Date("2026-07-09T11:00:00+09:00").getTime();
    const calc=()=>{
      const diff=eventTs-Date.now();
      if(diff<=0) return 0;
      return Math.ceil(diff/(1000*60*60*24));
    };
    setDday(calc());
    const id=setInterval(()=>setDday(calc()),60000);
    return()=>clearInterval(id);
  },[]);
  /* 히어로 지나면 sticky bar 표시 */
  useEffect(()=>{
    const onScroll=()=>setStickyVisible(window.scrollY>520);
    window.addEventListener("scroll",onScroll,{passive:true});
    onScroll();
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  return(<>
    <ApplyFormModal open={showApply} onClose={()=>setShowApply(false)}/>
    <PartnerFormModal open={showPartner} onClose={()=>setShowPartner(false)}/>

    {/* D-Day 고정 신청 바 (히어로 지나면 등장) */}
    <div className="conf-sticky-bar" style={{position:"fixed",top:72,left:0,right:0,zIndex:90,padding:"0 12px",pointerEvents:"none",transform:stickyVisible?"translateY(0)":"translateY(-200%)",opacity:stickyVisible?1:0,transition:"transform .35s cubic-bezier(.2,.7,.3,1),opacity .25s"}}>
      <div style={{maxWidth:960,margin:"0 auto",pointerEvents:"auto",background:CC.ink,color:CC.cream,borderRadius:50,padding:"8px 8px 8px 20px",display:"flex",alignItems:"center",gap:8,boxShadow:"0 10px 30px rgba(42,31,26,.28)"}}>
        <div className="conf-sticky-info" style={{display:"flex",alignItems:"center",gap:8,minWidth:0,flex:1}}>
          {dday!==null&&dday>0&&(
            <span style={{padding:"4px 12px",background:CC.coral,color:C.w,borderRadius:30,fontWeight:800,letterSpacing:".02em",flexShrink:0,fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(17px,2.2vw,18px)"}}>D-{dday}</span>
          )}
          {dday===0&&(
            <span style={{padding:"4px 12px",background:CC.coral,color:C.w,borderRadius:30,fontSize:12,fontWeight:800,letterSpacing:".05em",flexShrink:0}}>D-DAY</span>
          )}
          <span className="conf-sticky-title" style={{fontSize:"clamp(12px,1.7vw,16px)",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>2026 양육불안 컨퍼런스</span>
        </div>
        <button onClick={()=>setShowPartner(true)} className="conf-sticky-partner" style={{padding:"8px 14px",background:"transparent",color:CC.cream,border:"1px solid rgba(255,248,236,.35)",borderRadius:30,fontSize:"clamp(11px,1.5vw,15px)",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,248,236,.1)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          제휴 문의
        </button>
        <button onClick={()=>setShowApply(true)} style={{padding:"10px 18px",background:CC.coral,color:C.w,border:"none",borderRadius:30,fontSize:"clamp(12px,1.7vw,16px)",fontWeight:700,cursor:"pointer",letterSpacing:".02em",whiteSpace:"nowrap",flexShrink:0,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=CC.peach} onMouseLeave={e=>e.currentTarget.style.background=CC.coral}>
          참가 신청 →
        </button>
      </div>
      <style>{`@media (max-width:520px){.conf-sticky-title{display:none}.conf-sticky-partner{padding:8px 12px!important}}`}</style>
    </div>
    {/* HERO */}
    <Sec style={{paddingTop:140,paddingBottom:100,background:CC.cream,position:"relative",overflow:"hidden"}}><Box>
      {/* Gradient Emotion 도형들 */}
      <div style={{position:"absolute",top:90,right:"6%",pointerEvents:"none",opacity:.9}}><EmoShape shape="blob" c1={CC.coral} c2={CC.mango} size={110} rotate={-15}/></div>
      <div style={{position:"absolute",top:260,right:"22%",pointerEvents:"none",opacity:.85}}><EmoShape shape="heart" c1={CC.rose} c2={CC.lilac} size={70} rotate={10} eyes={false}/></div>
      <div style={{position:"absolute",bottom:140,left:"5%",pointerEvents:"none",opacity:.85}}><EmoShape shape="cloud" c1={CC.sky} c2={CC.mint} size={130} rotate={5}/></div>
      <div style={{position:"absolute",top:180,left:"10%",pointerEvents:"none",opacity:.7}}><EmoShape shape="star" c1={CC.mango} c2={CC.peach} size={55} eyes={false}/></div>
      <div style={{position:"absolute",bottom:80,right:"8%",pointerEvents:"none",opacity:.85}}><EmoShape shape="drop" c1={CC.lilac} c2={CC.rose} size={75} rotate={-10}/></div>

      <FI><div style={{position:"relative",maxWidth:920,margin:"0 auto"}}>
        <div style={{display:"inline-block",padding:"6px 16px",background:C.w,border:`1px solid ${CC.coral}33`,borderRadius:30,fontSize:12,color:CC.coral,fontWeight:700,letterSpacing:".1em",marginBottom:32}}>
          사단법인 더나일 비영리 컨퍼런스
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:"clamp(12px,2vw,20px)",flexWrap:"wrap",marginBottom:36}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(56px,9vw,104px)",fontWeight:700,lineHeight:.95,letterSpacing:"-.02em",background:`linear-gradient(135deg,${CC.coral} 0%,${CC.mango} 50%,${CC.lilac} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>2026</span>
          <span style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(22px,3.5vw,36px)",fontWeight:700,color:CC.ink,letterSpacing:"-.01em"}}>양육불안 컨퍼런스</span>
        </div>
        <h1 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(34px,7.5vw,76px)",fontWeight:800,color:CC.ink,lineHeight:1.15,marginBottom:48,wordBreak:"keep-all",letterSpacing:"-.02em"}}>
          <span style={{display:"inline-block"}}>불안을</span>{" "}
          <span style={{display:"inline-block"}}>불안해하지 마세요</span>
        </h1>
      </div></FI>

      <FI delay={.15}><div style={{position:"relative",maxWidth:920,margin:"40px auto 0"}}>
        <div className="conf-info-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[
            {k:"일시",v:"2026.07.09 (목)",sub:"11:00 – 15:00",c:CC.coral},
            {k:"장소",v:"헤이그라운드",sub:"브릭스홀",c:CC.mango},
            {k:"인원",v:"100–120명",sub:"무료 / 사전신청",c:CC.mint},
            {k:"주최",v:"사단법인 더나일",sub:"협력 · 성동구청",c:CC.lilac},
          ].map((x,i)=>(
            <div key={i} style={{padding:"18px 14px",background:C.w,borderRadius:16,textAlign:"left",border:`2px solid ${x.c}33`,position:"relative"}}>
              <div style={{position:"absolute",top:-8,left:14,width:14,height:14,borderRadius:"50%",background:x.c}}/>
              <div style={{fontSize:11,color:x.c,fontWeight:700,marginBottom:8,letterSpacing:".08em"}}>{x.k}</div>
              <div style={{fontSize:"clamp(15px,1.8vw,20px)",fontWeight:700,color:CC.ink,marginBottom:4,wordBreak:"keep-all",lineHeight:1.3}}>{x.v}</div>
              <div style={{fontSize:11,color:C.g4,wordBreak:"keep-all",lineHeight:1.4}}>{x.sub}</div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width:720px){.conf-info-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </div></FI>

      <FI delay={.25}><div style={{textAlign:"center",marginTop:56,position:"relative"}}>
        <button onClick={()=>setShowApply(true)} style={{padding:"18px 56px",background:CC.ink,color:CC.cream,border:"none",borderRadius:50,fontSize:18,fontWeight:700,cursor:"pointer",letterSpacing:".02em",transition:"all .25s",boxShadow:`0 8px 24px ${CC.ink}33`}} onMouseEnter={e=>{e.currentTarget.style.background=CC.coral;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.background=CC.ink;e.currentTarget.style.transform="translateY(0)"}}>
          참가 신청하기 →
        </button>
        <p style={{fontSize:15,color:CC.inkBrown,marginTop:16,opacity:.65}}>참가 무료 · 사전 신청 필수</p>
      </div></FI>
    </Box></Sec>

    {/* 문제 의식 */}
    <Sec style={{background:CC.inkBrown,color:CC.cream,paddingTop:96,paddingBottom:96,position:"relative",overflow:"hidden"}}><Box>
      <div style={{position:"absolute",top:40,right:"4%",pointerEvents:"none",opacity:.85}}><EmoShape shape="burst" c1={CC.coral} c2={CC.peach} size={120} rotate={20}/></div>
      <div style={{position:"absolute",bottom:60,left:"3%",pointerEvents:"none",opacity:.85}}><EmoShape shape="flower" c1={CC.mint} c2={CC.sky} size={100} rotate={-15}/></div>
      <FI><div style={{textAlign:"center",maxWidth:840,margin:"0 auto",position:"relative"}}>
        <div style={{fontSize:15,color:CC.peach,fontWeight:700,letterSpacing:".15em",marginBottom:24}}>WHY · 문제의식</div>
        <h2 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:CC.cream,lineHeight:1.4,marginBottom:48,wordBreak:"keep-all"}}>
          <span style={{display:"inline-block"}}>양육불안의 시대,</span>{" "}
          <span style={{display:"inline-block"}}>우리는 괜찮은 걸까요?</span>
        </h2>
      </div></FI>
      <FI delay={.1}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,maxWidth:880,margin:"0 auto 48px",position:"relative"}}>
        {[
          {t:"양육에 대한 냉소적 시선",c:CC.coral,sh:"blob"},
          {t:"양육으로 인한 고립감",c:CC.lilac,sh:"drop"},
          {t:"지식과 정서돌봄의 부족",c:CC.mint,sh:"heart"},
          {t:"정책과 인프라의 부족",c:CC.mango,sh:"arch"},
        ].map((x,i)=>(
          <div key={i} style={{padding:"24px 20px",background:"rgba(255,255,255,.06)",backdropFilter:"blur(10px)",borderRadius:18,border:"1px solid rgba(255,255,255,.12)",textAlign:"center",position:"relative"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><EmoShape shape={x.sh} c1={x.c} c2={CC.cream} size={48} eyes={false}/></div>
            <div style={{fontSize:11,color:x.c,fontWeight:700,marginBottom:6,letterSpacing:".1em"}}>0{i+1}</div>
            <div style={{fontSize:"clamp(16px,2vw,17px)",color:CC.cream,fontWeight:600,lineHeight:1.5,wordBreak:"keep-all"}}>{x.t}</div>
          </div>
        ))}
      </div></FI>
      <FI delay={.2}><div style={{textAlign:"center",position:"relative"}}>
        <p style={{fontSize:"clamp(17px,2vw,20px)",color:"rgba(255,248,236,.82)",lineHeight:1.85,maxWidth:680,marginLeft:"auto",marginRight:"auto",wordBreak:"keep-all"}}>
          <span style={{display:"inline-block"}}>그동안 양육불안은 "부모 개인이 다루어야 할 감정"으로만 다뤄져 왔습니다.</span>{" "}
          <span style={{display:"inline-block"}}>그러나 양육불안에 대한 솔루션은 다양한 사회문제의 게이트키퍼 역할을 할 수 있습니다.</span>
        </p>
      </div></FI>
    </Box></Sec>

    {/* 3개 키 메시지 */}
    <Sec bg={C.w} style={{paddingTop:96,paddingBottom:48}}><Box>
      <FI><div style={{textAlign:"center",marginBottom:64}}>
        <div style={{fontSize:15,color:CC.coral,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>KEY MESSAGES</div>
        <H2><span style={{display:"inline-block"}}>세 가지 질문에 대해</span>{" "}<span style={{display:"inline-block"}}>함께 이야기 나눕니다.</span></H2>
      </div></FI>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:1080,margin:"0 auto"}}>
        {[
          {n:"01",c:CC.coral,c2:CC.peach,cl:CC.peachL,t:"양육불안은 어디에나 있다",d:"지금의 양육 부담이 부모 개인의 부족함이 아니라, 사회 전체가 만들어온 무게라는 사실을 함께 짚어봅니다.",sh:"blob"},
          {n:"02",c:CC.lilac,c2:CC.rose,cl:CC.lilacL,t:"양육불안은 어디에서 오는가",d:"뇌과학·발달심리학자의 시선으로 양육불안의 뿌리를 다층적으로 살펴봅니다.",sh:"drop"},
          {n:"03",c:CC.sage,c2:CC.mint,cl:CC.sageL,t:"양육불안과 어떻게 살아갈 것인가",d:"인터뷰와 사례 개념화 워크숍을 통해, 양육불안과 함께 살아간다는 것의 실제를 정직하게 나눕니다.",sh:"flower"},
        ].map((x,i)=>(
          <FI key={i} delay={i*.1}><div style={{padding:"40px 30px 32px",background:x.cl,borderRadius:24,height:"100%",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,opacity:.55,pointerEvents:"none"}}><EmoShape shape={x.sh} c1={x.c} c2={x.c2} size={140} rotate={15} eyes={false}/></div>
            <div style={{position:"relative"}}>
              <div style={{fontSize:11,color:x.c,fontWeight:700,letterSpacing:".15em",marginBottom:8}}>PART {parseInt(x.n)}</div>
              <h3 style={{fontSize:"clamp(20px,2.6vw,24px)",fontWeight:800,color:CC.ink,marginBottom:16,lineHeight:1.35,wordBreak:"keep-all",fontFamily:"'Noto Serif KR',serif"}}>{x.t}</h3>
              <p style={{fontSize:16,color:CC.inkBrown,opacity:.78,lineHeight:1.85,wordBreak:"keep-all"}}>{x.d}</p>
            </div>
          </div></FI>
        ))}
      </div>
    </Box></Sec>

    {/* 연사 라인업 */}
    <Sec bg={CC.cream} style={{paddingTop:96,position:"relative",overflow:"hidden"}}><Box>
      <div style={{position:"absolute",top:40,left:"4%",pointerEvents:"none",opacity:.45}}><EmoShape shape="pebble" c1={CC.sage} c2={CC.mint} size={70} rotate={-10} eyes={false}/></div>
      <div style={{position:"absolute",bottom:60,right:"5%",pointerEvents:"none",opacity:.45}}><EmoShape shape="cloud" c1={CC.lilac} c2={CC.rose} size={75} rotate={10} eyes={false}/></div>
      <FI><div style={{textAlign:"center",marginBottom:48,position:"relative"}}>
        <div style={{fontSize:15,color:CC.coral,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>SPEAKERS · 함께 모시는 발표자</div>
        <H2>연사 라인업</H2>
      </div></FI>
      <FI delay={.1}><div style={{maxWidth:880,margin:"0 auto",position:"relative"}}>
        {[speakers.slice(0,3),speakers.slice(3,7)].map((row,rowIdx)=>(
          <div key={rowIdx} className={rowIdx===0?"conf-spk-row-top":"conf-spk-row-bot"} style={{display:"grid",gridTemplateColumns:`repeat(${row.length},1fr)`,gap:24,marginTop:rowIdx===0?0:32,maxWidth:rowIdx===0?660:"none",marginLeft:"auto",marginRight:"auto"}}>
            {row.map((s,i)=>{
              const idx=rowIdx===0?i:3+i;
              return (
                <div key={idx} style={{textAlign:"center"}}>
                  <div style={{width:"100%",aspectRatio:"1/1",borderRadius:"50%",overflow:"hidden",marginBottom:14,background:CC.cream,border:`2px solid ${s.color}33`,position:"relative",boxShadow:`0 4px 16px ${s.color}15`}}>
                    <img src={s.img} alt={s.n} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 18%",display:"block"}} onError={e=>{const wrap=e.currentTarget.parentElement;e.currentTarget.style.display="none";if(!wrap.dataset.fb){wrap.dataset.fb="1";const c1=s.color,c2=s.c2,id=`fb${idx}-${Math.floor(Math.random()*9999)}`;wrap.insertAdjacentHTML("beforeend",`<svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block"><defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="${c1}22"/><text x="50" y="62" text-anchor="middle" font-size="32" font-weight="700" fill="${c1}" font-family="serif">${s.n[0]}</text></svg>`)}}}/>
                  </div>
                  <div style={{display:"inline-block",fontSize:10,color:s.color,fontWeight:700,letterSpacing:".1em",marginBottom:6,padding:"3px 10px",background:`${s.color}15`,borderRadius:12}}>{s.part}</div>
                  <div style={{fontSize:18,fontWeight:700,color:CC.ink,marginBottom:4,fontFamily:"'Noto Serif KR',serif"}}>{s.n}</div>
                  <div style={{fontSize:12,color:CC.inkBrown,opacity:.7,lineHeight:1.5,wordBreak:"keep-all"}}>{s.r}</div>
                </div>
              );
            })}
          </div>
        ))}
        <style>{`@media (max-width:720px){.conf-spk-row-top,.conf-spk-row-bot{grid-template-columns:repeat(2,1fr)!important;max-width:none!important}}`}</style>
      </div></FI>
    </Box></Sec>

    {/* 시간표 */}
    <Sec bg={C.w} style={{position:"relative",overflow:"hidden"}}><Box>
      <div style={{position:"absolute",top:60,right:"4%",pointerEvents:"none",opacity:.55}}><EmoShape shape="star" c1={CC.coral} c2={CC.peach} size={70} rotate={15} eyes={false}/></div>
      <FI><div style={{textAlign:"center",marginBottom:48,position:"relative"}}>
        <div style={{fontSize:15,color:CC.coral,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>PROGRAM · 2026.07.09 (목)</div>
        <H2>시간표</H2>
      </div></FI>
      <FI delay={.1}><div style={{maxWidth:880,margin:"0 auto",borderRadius:24,overflow:"hidden",background:CC.cream,boxShadow:"0 4px 24px rgba(0,0,0,.05)"}}>
        {[
          {t:"10:50 – 11:00",s:"등록",d:"체크인 · 입장",c:CC.inkBrown},
          {t:"11:00 – 12:30",s:"SESSION 1 · 키노트",sub:"90분 · 메인홀",d:"양육불안은 어디에서 오는가 — 장동선 / 이다랑 · 사회 김혜민",c:CC.coral},
          {t:"12:30 – 13:00",s:"밍글링 / 식사",d:"참가자 네트워킹 · 가벼운 식사",c:CC.inkBrown},
          {t:"13:00 – 14:30",s:"SESSION 2 · 패널토크",sub:"90분 · 메인홀",d:"양육불안과 함께 살아간다는 것 — 이혜린 모더레이터 + 신두란 / 정지우 / 후추맘",c:CC.lilac},
          {t:"14:30",s:"클로징",d:"마무리 인사 및 후원사 소개",c:CC.inkBrown},
        ].map((x,i,a)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"clamp(120px,22vw,150px) 1fr",gap:16,padding:"18px 24px",borderBottom:i<a.length-1?`1px solid ${C.g1}`:"none",alignItems:"start"}}>
            <div style={{fontSize:15,color:x.c,fontWeight:700,letterSpacing:".02em"}}>{x.t}</div>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap",marginBottom:6}}>
                <span style={{fontSize:"clamp(16px,2vw,17px)",fontWeight:700,color:CC.ink,wordBreak:"keep-all",lineHeight:1.4}}>{x.s}</span>
                {x.sub&&<span style={{fontSize:11,color:x.c,fontWeight:700,padding:"2px 8px",background:`${x.c}15`,borderRadius:12,letterSpacing:".05em"}}>{x.sub}</span>}
              </div>
              <div style={{fontSize:15,color:CC.inkBrown,opacity:.7,lineHeight:1.7,wordBreak:"keep-all"}}>{x.d}</div>
            </div>
          </div>
        ))}
      </div></FI>
      <FI delay={.2}><p style={{textAlign:"center",fontSize:12,color:CC.inkBrown,opacity:.55,marginTop:24,wordBreak:"keep-all"}}>오프닝 등록은 10:50부터 시작됩니다. 시간에 맞춰 도착해 주세요.</p></FI>
    </Box></Sec>

    {/* 키노트 상세 (SESSION 1) */}
    <Sec bg={C.w}><Box>
      <FI><div style={{textAlign:"center",marginBottom:48}}>
        <div style={{fontSize:15,color:CC.coral,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>SESSION 1 · 키노트 · 오전 90분</div>
        <H2>양육불안은 어디에서 오는가</H2>
        <p style={{fontSize:"clamp(16px,2vw,18px)",color:CC.inkBrown,opacity:.7,lineHeight:1.8,maxWidth:560,margin:"16px auto 0",wordBreak:"keep-all"}}>뇌과학과 발달심리학, 두 시선이 한 자리에서 만나 양육불안의 뿌리를 짚어드립니다.</p>
      </div></FI>
      <div style={{display:"grid",gap:24,maxWidth:960,margin:"0 auto"}}>
        {[
          {n:"KEYNOTE 01",c:CC.coral,c2:CC.peach,name:"장동선",role:"뇌과학자",img:"/images/speakers/장동선.png",title:"양육불안, 우리의 마음은 어떻게 작동될까?",desc:"부모가 된 이후 우리 뇌에서는 어떤 변화가 일어날까요? 뇌과학자의 시선으로 부모들의 양육불안의 원인을 다루어 봅니다.",sh:"burst"},
          {n:"KEYNOTE 02",c:CC.coral,c2:CC.rose,name:"이다랑",role:"아동심리전문가 · 사단법인 더나일 이사장",img:"/images/speakers/이다랑.png",title:"한국 부모의 양육불안, 어떻게 다를까?",desc:"한국 부모들이 겪는 양육불안은 어디에서 비롯될까요? 7만 명의 부모를 만나며 그려온 마음의 지도를, 아동심리전문가의 시선으로 함께 풀어봅니다.",sh:"heart"},
        ].map((k,i)=>(
          <FI key={i} delay={i*.1}><div style={{display:"grid",gridTemplateColumns:"minmax(180px,260px) 1fr",gap:0,background:CC.cream,borderRadius:28,overflow:"hidden",position:"relative"}} className="conf-keynote-card">
            {/* 좌측 큰 인물 사진 */}
            <div style={{position:"relative",aspectRatio:"4/5",background:`linear-gradient(135deg,${k.c}22 0%,${k.c2}22 100%)`,overflow:"hidden"}}>
              <img src={k.img} alt={k.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 18%",display:"block"}} onError={e=>{const wrap=e.currentTarget.parentElement;e.currentTarget.style.display="none";if(!wrap.dataset.fb){wrap.dataset.fb="1";wrap.insertAdjacentHTML("beforeend",`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:88px;color:${k.c};font-weight:700;font-family:'Noto Serif KR',serif;opacity:.7">${k.name[0]}</div>`)}}}/>
              <div style={{position:"absolute",bottom:14,left:14,padding:"5px 12px",background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)",borderRadius:20,fontSize:10,color:C.w,fontWeight:700,letterSpacing:".12em"}}>{k.n} · 20분</div>
            </div>
            {/* 우측 정보 */}
            <div style={{padding:"32px 32px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,opacity:.25,pointerEvents:"none"}}><EmoShape shape={k.sh} c1={k.c} c2={k.c2} size={130} rotate={20} eyes={false}/></div>
              <div style={{position:"relative"}}>
                <div style={{fontSize:28,fontWeight:800,color:CC.ink,marginBottom:4,fontFamily:"'Noto Serif KR',serif"}}>{k.name}</div>
                <div style={{fontSize:15,color:CC.inkBrown,opacity:.65,marginBottom:20,wordBreak:"keep-all"}}>{k.role}</div>
                <h4 style={{fontSize:"clamp(18px,2.3vw,19px)",fontWeight:700,color:CC.ink,marginBottom:18,lineHeight:1.4,wordBreak:"keep-all",paddingBottom:16,borderBottom:`1px solid ${k.c}33`}}>{k.title}</h4>
                <p style={{fontSize:16,color:CC.inkBrown,opacity:.82,lineHeight:1.85,wordBreak:"keep-all",margin:0}}>{k.desc}</p>
              </div>
            </div>
          </div></FI>
        ))}
      </div>
      <style>{`@media (max-width:680px){.conf-keynote-card{grid-template-columns:1fr!important}.conf-keynote-card>div:first-child{aspect-ratio:16/10!important}}`}</style>

      {/* SESSION 1 사회자 — 김혜민 */}
      <FI delay={.25}><div style={{maxWidth:960,margin:"24px auto 0",padding:"14px 20px",background:C.w,border:`1px solid ${CC.coral}33`,borderRadius:50,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
        <div style={{width:46,height:46,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:CC.cream,border:`2px solid ${CC.coral}55`}}>
          <img src="/images/김혜민.jpg" alt="김혜민" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 18%",display:"block"}} onError={e=>{const wrap=e.currentTarget.parentElement;e.currentTarget.style.display="none";if(!wrap.dataset.fb){wrap.dataset.fb="1";wrap.insertAdjacentHTML("beforeend",`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:18px;color:${CC.coral};font-weight:700;background:${CC.coral}15;font-family:'Noto Serif KR',serif">김</div>`)}}}/>
        </div>
        <span style={{fontSize:11,color:CC.coral,fontWeight:700,letterSpacing:".15em"}}>MC · 사회</span>
        <span style={{fontSize:17,fontWeight:700,color:CC.ink,fontFamily:"'Noto Serif KR',serif"}}>김혜민</span>
        <span style={{fontSize:15,color:CC.inkBrown,opacity:.65}}>사단법인 더나일 이사</span>
      </div></FI>
    </Box></Sec>

    {/* SESSION 2 · 패널토크 (단독 섹션, 2x2 그리드) */}
    <Sec bg={CC.cream}><Box>
      <FI><div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:15,color:CC.lilac,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>SESSION 2 · 메인홀 · 13:00 – 14:30</div>
        <H2>양육불안과 함께 살아간다는 것</H2>
        <div style={{display:"inline-block",marginTop:14,padding:"6px 16px",background:`${CC.lilac}15`,borderRadius:30,fontSize:15,color:CC.lilac,fontWeight:700,letterSpacing:".02em"}}>
          패널토크 · 이혜린 / 신두란 / 정지우 / 후추맘
        </div>
      </div></FI>
      <FI delay={.08}><p style={{fontSize:"clamp(16px,2vw,18px)",color:CC.inkBrown,opacity:.7,lineHeight:1.85,maxWidth:640,margin:"16px auto 48px",textAlign:"center",wordBreak:"keep-all"}}>다른 자리에서 양육과 만나온 네 분이 자신의 양육불안을 어떻게 통과해왔는지 나누는 대화</p></FI>

      {/* 모더 + 패널 4명 — PC 4열 · 태블릿 2열 · 모바일 1열 */}
      <div className="conf-panel-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,maxWidth:1100,margin:"0 auto"}}>
        <style>{`
          @media (max-width:1023px){.conf-panel-grid{grid-template-columns:repeat(2,1fr)!important;max-width:880px!important;gap:24px!important}}
          @media (max-width:560px){.conf-panel-grid{grid-template-columns:1fr!important}}
        `}</style>
        {[
          {role:"MODERATOR",label:"패널토크 진행",name:"이혜린",pos:"쉬벤처스 부대표 · 더나일 이사",img:"/images/speakers/이혜린.png",c:CC.lilac,c2:CC.rose,desc:"교육심리학 석사. 그로잉맘과 더나일에서 부모 마음을 가장 가까이 들여다본 경험을 바탕으로 대화의 결을 잡습니다.",sh:"heart"},
          {role:"PANEL 01",label:"고마워서그래 대표의 시선",name:"신두란",pos:"고마워서그래 대표",img:"/images/speakers/신두란.png",c:CC.lilac,c2:CC.coral,desc:"비건 식문화 브랜드 '고마워서그래'를 운영하며 일·양육·가치관이 한 사람 안에서 어떻게 자리잡는지 나눕니다.",sh:"flower"},
          {role:"PANEL 02",label:"글 쓰는 아빠의 시선",name:"정지우",pos:"작가 · 변호사",img:"/images/speakers/정지우.png",c:CC.lilac,c2:CC.peach,desc:"양육과 시대를 함께 쓰는 에세이스트. 일과 글, 양육이 한 사람 안에서 부딪힐 때 무엇이 남는지 정직하게 풀어냅니다.",sh:"arch"},
          {role:"PANEL 03",label:"결을 다르게 둔 양육의 시선",name:"후추맘",pos:"육아 크리에이터",img:"/images/speakers/후추맘.png",c:CC.lilac,c2:CC.sage,desc:"정해진 트랙을 따라가지 않는 양육의 결. 불안을 통과하는 또 하나의 길을 자신의 일상으로 보여줍니다.",sh:"leaf"},
        ].map((p,i)=>(
          <FI key={i} delay={i*.08}><div style={{background:C.w,borderRadius:20,overflow:"hidden",position:"relative",border:`1px solid ${p.c}22`,height:"100%",display:"flex",flexDirection:"column"}}>
            {/* 상단 이미지 — PC 정사각, 모바일 4:3 */}
            <div className="conf-panel-img" style={{position:"relative",aspectRatio:"1/1",background:`linear-gradient(135deg,${p.c}22 0%,${p.c2}22 100%)`,overflow:"hidden"}}>
              <style>{`@media (max-width:1023px){.conf-panel-img{aspect-ratio:4/3!important}}`}</style>
              <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 18%",display:"block"}} onError={e=>{const wrap=e.currentTarget.parentElement;e.currentTarget.style.display="none";if(!wrap.dataset.fb){wrap.dataset.fb="1";wrap.insertAdjacentHTML("beforeend",`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:72px;color:${p.c};font-weight:700;font-family:'Noto Serif KR',serif;opacity:.7">${p.name[0]}</div>`)}}}/>
              <div style={{position:"absolute",bottom:12,left:12,padding:"4px 10px",background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)",borderRadius:18,fontSize:9,color:C.w,fontWeight:700,letterSpacing:".12em"}}>{p.role}</div>
            </div>
            {/* 하단 정보 */}
            <div style={{padding:"20px 20px",position:"relative",overflow:"hidden",flex:1,display:"flex",flexDirection:"column"}}>
              <div style={{position:"absolute",top:-18,right:-18,opacity:.15,pointerEvents:"none"}}><EmoShape shape={p.sh} c1={p.c} c2={p.c2} size={90} rotate={20} eyes={false}/></div>
              <div style={{position:"relative",flex:1}}>
                <div style={{fontSize:20,fontWeight:800,color:CC.ink,marginBottom:3,fontFamily:"'Noto Serif KR',serif"}}>{p.name}</div>
                <div style={{fontSize:13,color:CC.inkBrown,opacity:.65,marginBottom:10,wordBreak:"keep-all"}}>{p.pos}</div>
                <div style={{fontSize:13,color:p.c,fontWeight:700,marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${p.c}33`,wordBreak:"keep-all",lineHeight:1.4}}>{p.label}</div>
                <p style={{fontSize:14,color:CC.inkBrown,opacity:.82,lineHeight:1.75,wordBreak:"keep-all",margin:0}}>{p.desc}</p>
              </div>
            </div>
          </div></FI>
        ))}
      </div>
    </Box></Sec>

    {/* 장소 안내 — 헤이그라운드 사진 포함 */}
    <Sec bg={CC.cream}><Box>
      <FI><div style={{textAlign:"center",marginBottom:48}}>
        <div style={{fontSize:15,color:CC.coral,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>VENUE · 장소 안내</div>
        <H2>헤이그라운드 브릭스홀</H2>
        <p style={{fontSize:"clamp(16px,2vw,18px)",color:CC.inkBrown,opacity:.7,lineHeight:1.8,maxWidth:560,margin:"16px auto 0",wordBreak:"keep-all"}}>성수동, 사회혁신 그룹들이 함께 모인 공간. 100~120명을 포근하게 담아낼 수 있는 메인홀입니다.</p>
      </div></FI>
      <FI delay={.1}><div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:24}}>
        {[
          {src:"/images/venue/heyground-exterior.jpg",label:"HEYGROUND · 외관",fallback:CC.sage,sh:"arch"},
          {src:"/images/venue/heyground-bricks-hall.jpg",label:"BRICKS HALL · 메인 베뉴",fallback:CC.coral,sh:"pebble"},
        ].map((v,i)=>(
          <div key={i} style={{position:"relative",aspectRatio:"4/3",borderRadius:20,overflow:"hidden",background:C.g1}}>
            <img src={v.src} alt={v.label} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>{const wrap=e.currentTarget.parentElement;e.currentTarget.style.display="none";if(!wrap.dataset.fb){wrap.dataset.fb="1";wrap.style.background=`linear-gradient(135deg,${v.fallback}33 0%,${v.fallback}11 100%)`;wrap.insertAdjacentHTML("beforeend",`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px"><div style="font-size:13px;color:${CC.inkBrown};opacity:.5;letter-spacing:.1em;font-weight:600">${v.label}</div><div style="font-size:11px;color:${CC.inkBrown};opacity:.4">이미지 추가 예정</div></div>`)}}}/>
            <div style={{position:"absolute",top:16,left:16,padding:"6px 12px",background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)",borderRadius:20,fontSize:11,color:C.w,fontWeight:700,letterSpacing:".1em"}}>{v.label}</div>
          </div>
        ))}
      </div></FI>
      <FI delay={.2}><div style={{maxWidth:1000,margin:"0 auto",padding:"28px 32px",background:CC.inkBrown,color:CC.cream,borderRadius:20}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24}}>
          <div>
            <div style={{fontSize:11,color:CC.mango,fontWeight:700,letterSpacing:".15em",marginBottom:8}}>주소</div>
            <p style={{fontSize:16,lineHeight:1.7,wordBreak:"keep-all",margin:0}}>서울특별시 성동구 뚝섬로1나길 5,<br/>헤이그라운드 성수시작점 B1</p>
          </div>
          <div>
            <div style={{fontSize:11,color:CC.mango,fontWeight:700,letterSpacing:".15em",marginBottom:8}}>오시는 길</div>
            <p style={{fontSize:15,lineHeight:1.8,wordBreak:"keep-all",margin:0,color:"rgba(255,248,236,.85)"}}>
              · 2호선 뚝섬역 6번 출구 도보 5분<br/>
              · 수인분당선 서울숲역 1번 출구 도보 6분
            </p>
          </div>
        </div>
      </div></FI>
    </Box></Sec>

    {/* 기업 파트너십 — 함께하자 톤, 금액 미공시, 협력사 로고 강조 */}
    <Sec bg={C.w} style={{position:"relative",overflow:"hidden"}}><Box>
      <div style={{position:"absolute",top:60,right:"4%",pointerEvents:"none",opacity:.45}}><EmoShape shape="heart" c1={CC.coral} c2={CC.rose} size={75} rotate={15} eyes={false}/></div>
      <div style={{position:"absolute",bottom:80,left:"4%",pointerEvents:"none",opacity:.4}}><EmoShape shape="star" c1={CC.sage} c2={CC.mint} size={60} rotate={-10} eyes={false}/></div>
      <FI><div style={{textAlign:"center",marginBottom:48,maxWidth:760,margin:"0 auto",position:"relative"}}>
        <div style={{fontSize:15,color:CC.coral,fontWeight:700,letterSpacing:".15em",marginBottom:16}}>PARTNERSHIP · 함께하는 분들</div>
        <H2><span style={{display:"inline-block"}}>혼자 풀 수 없는 문제,</span>{" "}<span style={{display:"inline-block"}}>함께 만들고 싶습니다.</span></H2>
        <p style={{fontSize:"clamp(16px,2vw,18px)",color:CC.inkBrown,opacity:.75,lineHeight:1.9,marginTop:24,wordBreak:"keep-all"}}>
          <span style={{display:"inline-block"}}>양육불안은 한 부모, 한 단체의 힘만으로는 풀리지 않는 문제입니다.</span>{" "}
          <span style={{display:"inline-block"}}>같은 문제 의식을 가진 기업과 기관이 함께 모일 때,</span>{" "}
          <span style={{display:"inline-block"}}>이 자리는 비로소 사회의 변화를 일으키는 출발점이 될 것이라 믿습니다.</span>
        </p>
        <p style={{fontSize:"clamp(15px,1.8vw,16px)",color:CC.inkBrown,opacity:.6,lineHeight:1.8,marginTop:16,wordBreak:"keep-all"}}>
          현금 후원, 현물·서비스 협찬, 콘텐츠 협력 등 함께할 수 있는 방식은 다양합니다. 더나일은 지정기부금단체로 기부금영수증 발급이 가능합니다.
        </p>
      </div></FI>

      {/* 함께하는 기업 로고 */}
      <FI delay={.15}><div style={{maxWidth:1000,margin:"56px auto 0",position:"relative"}}>
        <div style={{fontSize:12,color:CC.inkBrown,opacity:.55,fontWeight:700,letterSpacing:".15em",textAlign:"center",marginBottom:32}}>이미 함께하고 있는 협력사 · 계속 모집 중</div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"clamp(32px,5vw,72px)",flexWrap:"wrap",padding:"36px 24px",background:CC.cream,borderRadius:24}}>
          {[
            {n:"성동구청",img:"/images/partners/seongdong.png",c:CC.coral},
            {n:"헤이그라운드",img:"/images/partners/heyground.png",c:CC.sage},
            {n:"Take Root",img:"/images/partners/takeroot.png",c:CC.sage},
            {n:"BICYCLE",img:"/images/partners/bicycle.png",c:CC.lilac},
          ].map((p,i)=>(
            <div key={i} style={{height:64,display:"flex",alignItems:"center",justifyContent:"center",minWidth:120}}>
              <img src={p.img} alt={p.n} style={{maxHeight:60,maxWidth:160,objectFit:"contain"}} onError={e=>{const wrap=e.currentTarget.parentElement;e.currentTarget.style.display="none";if(!wrap.dataset.fb){wrap.dataset.fb="1";wrap.insertAdjacentHTML("beforeend",`<div style="font-size:15px;color:${p.c};font-weight:700;letterSpacing:.02em">${p.n}</div>`)}}}/>
            </div>
          ))}
        </div>
      </div></FI>

      <FI delay={.25}><div style={{textAlign:"center",marginTop:56}}>
        <button onClick={()=>setShowPartner(true)} style={{padding:"18px 44px",background:CC.ink,color:CC.cream,border:"none",borderRadius:50,fontSize:17,fontWeight:700,cursor:"pointer",transition:"all .25s",boxShadow:`0 8px 24px ${CC.ink}33`}} onMouseEnter={e=>{e.currentTarget.style.background=CC.coral;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.background=CC.ink;e.currentTarget.style.transform="translateY(0)"}}>
          함께 걷고 싶어요 · 제휴 문의 →
        </button>
        <p style={{fontSize:12,color:CC.inkBrown,opacity:.5,marginTop:16,wordBreak:"keep-all"}}>회신 요청 · 2026.05.22 (목)까지</p>
      </div></FI>
    </Box></Sec>

    {/* 최종 신청 CTA */}
    <Sec style={{background:CC.inkBrown,color:CC.cream,paddingTop:96,paddingBottom:96,position:"relative",overflow:"hidden"}}><Box style={{textAlign:"center",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:"5%",pointerEvents:"none",opacity:.6}}><EmoShape shape="burst" c1={CC.coral} c2={CC.mango} size={100} rotate={20}/></div>
      <div style={{position:"absolute",top:40,right:"6%",pointerEvents:"none",opacity:.55}}><EmoShape shape="cloud" c1={CC.lilac} c2={CC.sky} size={110} rotate={-10}/></div>
      <div style={{position:"absolute",bottom:30,left:"8%",pointerEvents:"none",opacity:.5}}><EmoShape shape="leaf" c1={CC.mint} c2={CC.sage} size={80} rotate={15}/></div>
      <div style={{position:"absolute",bottom:60,right:"10%",pointerEvents:"none",opacity:.55}}><EmoShape shape="heart" c1={CC.rose} c2={CC.coral} size={70} rotate={-15} eyes={false}/></div>
      <FI><div style={{maxWidth:680,margin:"0 auto",position:"relative"}}>
        <div style={{fontSize:15,color:CC.mango,fontWeight:700,letterSpacing:".15em",marginBottom:24}}>JOIN US · 신청</div>
        <h2 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(28px,5vw,40px)",fontWeight:700,color:CC.cream,lineHeight:1.4,marginBottom:24,wordBreak:"keep-all"}}>
          <span style={{display:"inline-block"}}>양육의 두려움이 기쁨이 되도록</span>{" "}
          <span style={{display:"inline-block"}}>더나일과 함께해주세요</span>
        </h2>
        <p style={{fontSize:"clamp(16px,2vw,18px)",color:"rgba(255,248,236,.7)",lineHeight:1.9,marginBottom:48,wordBreak:"keep-all"}}>
          참가비는 없지만, 선착순 100–120명으로 마감됩니다.<br/>
          신청해주신 정보로 행사 관련 안내를 드립니다.
        </p>
      </div></FI>
      <FI delay={.15}><div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",maxWidth:560,margin:"0 auto",position:"relative"}}>
        <button onClick={()=>setShowApply(true)} style={{padding:"18px 40px",background:CC.cream,color:CC.inkBrown,border:"none",borderRadius:50,fontSize:18,fontWeight:700,cursor:"pointer",transition:"all .25s"}} onMouseEnter={e=>{e.currentTarget.style.background=CC.coral;e.currentTarget.style.color=CC.cream}} onMouseLeave={e=>{e.currentTarget.style.background=CC.cream;e.currentTarget.style.color=CC.inkBrown}}>
          참가 신청하기 →
        </button>
        <button onClick={()=>setShowPartner(true)} style={{padding:"18px 40px",background:"transparent",color:CC.cream,border:"1px solid rgba(255,248,236,.3)",borderRadius:50,fontSize:18,fontWeight:700,cursor:"pointer",transition:"all .25s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,248,236,.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          기업 제휴 문의
        </button>
      </div></FI>
      <FI delay={.25}><div style={{marginTop:64,paddingTop:32,borderTop:"1px solid rgba(255,248,236,.1)",fontSize:15,color:"rgba(255,248,236,.5)",lineHeight:1.8,position:"relative"}}>
        <p style={{margin:"0 0 8px"}}>사단법인 더나일 · 이사장 이다랑 / 이사 이혜린</p>
        <p style={{margin:0}}>lin@thenile.kr · cross@thenile.kr · https://thenile.kr</p>
      </div></FI>
    </Box></Sec>
  </>);
};

/* ═══ 딜라이트 프로젝트 페이지 ═══ */
const DELIGHT_APPLY_URL="https://docs.google.com/forms/d/e/1FAIpQLSePoLfSazbmm0Cd4CyPaGISSWvkgvDInTtSuijbpvSjV8sdkw/viewform";
const DelightPage=()=>(<>
  {/* HERO */}
  <Sec style={{paddingTop:140,paddingBottom:80,background:`linear-gradient(180deg,${C.navy} 0%,${C.navyL} 100%)`,position:"relative",overflow:"hidden"}}><Box>
    <div style={{position:"absolute",top:-100,right:-100,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}22 0%,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
    <FI><div style={{textAlign:"center",maxWidth:760,margin:"0 auto",position:"relative"}}>
      <div style={{display:"inline-block",padding:"6px 16px",background:`${C.gold}22`,border:`1px solid ${C.gold}55`,borderRadius:30,fontSize:12,color:C.gold,fontWeight:600,letterSpacing:".08em",marginBottom:24}}>
        딜라이트 프로젝트 · 1기 모집
      </div>
      <h2 style={{fontFamily:"'Noto Serif KR',serif",fontSize:"clamp(26px,6vw,46px)",fontWeight:700,color:"#fff",lineHeight:1.45,marginBottom:32,wordBreak:"keep-all"}}>
        <span style={{display:"inline-block"}}>"오늘도 비슷한 장면에서</span>{" "}
        <span style={{display:"inline-block"}}>비슷하게 무너졌다면."</span>
      </h2>
      <p style={{fontSize:"clamp(18px,2.4vw,19px)",color:"rgba(255,255,255,.88)",lineHeight:1.9,wordBreak:"keep-all",marginBottom:48,maxWidth:560,marginLeft:"auto",marginRight:"auto",padding:"0 8px",fontWeight:500}}>
        <span style={{display:"inline-block"}}>아이를 바꾸기 전에,</span>{" "}
        <span style={{display:"inline-block"}}>내가 보는 방식을 다시 봅니다.</span>
      </p>
    </div></FI>
    <FI delay={.15}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,maxWidth:680,margin:"0 auto 24px",position:"relative"}}>
      {[
        {k:"정원",v:"12명"},
        {k:"기간",v:"6주"},
        {k:"시작",v:"2026.06.05"},
        {k:"참가비",v:"35만원",strike:"50만원",badge:"1기 특별가"},
      ].map((x,i)=>(
        <div key={i} style={{padding:"22px 16px",background:"rgba(255,255,255,.06)",backdropFilter:"blur(10px)",borderRadius:14,border:x.badge?`1px solid ${C.gold}`:"1px solid rgba(247,215,107,.25)",textAlign:"center",position:"relative"}}>
          {x.badge&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:C.gold,color:C.navy,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap",letterSpacing:".03em"}}>{x.badge}</div>}
          <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:8,letterSpacing:".08em"}}>{x.k}</div>
          {x.strike&&<div style={{fontSize:15,color:"rgba(255,255,255,.4)",textDecoration:"line-through",marginBottom:2}}>{x.strike}</div>}
          <div style={{fontSize:19,fontWeight:700,color:C.gold}}>{x.v}</div>
        </div>
      ))}
    </div></FI>
    <FI delay={.2}><p style={{textAlign:"center",fontSize:15,color:"rgba(255,255,255,.65)",marginBottom:32,wordBreak:"keep-all",padding:"0 16px"}}>
      <span style={{display:"inline-block"}}>정가 50만원 → 1기 모집 특별가 35만원</span>{" "}
      <span style={{display:"inline-block",color:C.gold,fontWeight:600}}>(30% 할인)</span>
    </p></FI>
    <FI delay={.25}><div style={{textAlign:"center",position:"relative"}}>
      <BG onClick={()=>window.open(DELIGHT_APPLY_URL,"_blank")} style={{fontSize:18,padding:"16px 48px"}}>지원서 작성하기 →</BG>
      <p style={{fontSize:15,color:"rgba(255,255,255,.55)",marginTop:18}}>모집 마감 · 2026.05.29 (금)</p>
    </div></FI>
  </Box></Sec>

  {/* 왜 딜라이트인가 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:48}}>
      <Tag>왜 "딜라이트"인가</Tag>
      <H2><span style={{display:"inline-block"}}>부모됨의 두려움이,</span>{" "}<span style={{display:"inline-block"}}>기쁨에 가까워지도록.</span></H2>
    </div></FI>
    <FI delay={.1}><div style={{maxWidth:680,margin:"0 auto",fontSize:18,color:C.g6,lineHeight:2,wordBreak:"keep-all"}}>
      <p style={{marginBottom:20}}>부모됨에는 두려움과 기쁨이 함께 있습니다. 두려움이 크면 자꾸 피하게 되고, 기쁨이 자라면 책임은 자연스럽게 따라옵니다.</p>
      <p style={{marginBottom:24}}>더나일이 그리는 부모의 모습은 이렇습니다.</p>
      <blockquote style={{borderLeft:`3px solid ${C.gold}`,paddingLeft:20,fontSize:"clamp(18px,2.2vw,18px)",color:C.navy,fontStyle:"italic",margin:"24px 0",lineHeight:1.7,wordBreak:"keep-all"}}>
        <span style={{display:"inline-block"}}>"모두의 육아를</span>{" "}
        <span style={{display:"inline-block"}}>다정하게 해석하는 부모."</span>
      </blockquote>
      <p style={{marginBottom:20}}>내 육아를 객관화해 볼 수 있고, 다른 육아에도 다정한 해석을 할 수 있는 부모. 그렇게 부모와 부모가 서로의 불안을 비난 대신 해석으로 만나는 자리를 꿈꿉니다.</p>
      <p>양육이 두려움보다 기쁨에 가까워지는 자리. 그래서 우리는 이 프로젝트를 <em style={{color:C.gold,fontStyle:"normal",fontWeight:600}}>딜라이트</em>라고 부릅니다.</p>
    </div></FI>
  </Box></Sec>

  {/* 우리의 입장 */}
  <Sec bg={C.warm}><Box>
    <FI><div style={{textAlign:"center",marginBottom:40}}>
      <Tag>왜 딜라이트 프로젝트를 시작했나요?</Tag>
      <H2><span style={{display:"inline-block"}}>아이를 바꾸기 전에,</span>{" "}<span style={{display:"inline-block"}}>내가 보는 방식을 다시 봅니다.</span></H2>
    </div></FI>
    <FI delay={.1}><div style={{maxWidth:680,margin:"0 auto",fontSize:18,color:C.g6,lineHeight:2,wordBreak:"keep-all"}}>
      <p style={{marginBottom:20}}>부모교육은 이미 차고 넘칩니다. 영상은 끝없고, 책은 빼곡하고, 전문가의 조언은 매일 도착합니다.</p>
      <p style={{marginBottom:20}}>그런데 왜 우리는 여전히, 어제와 같은 방식으로 아이에게 반응할까요.</p>
      <p style={{fontSize:"clamp(17px,2.2vw,20px)",color:C.navy,fontWeight:500,lineHeight:1.8}}>
        <span style={{display:"inline-block"}}>"방법"은 더 이상 부족한 것이 아닙니다.</span>{" "}
        <span style={{display:"inline-block"}}>부족한 것은, 내 양육을 들여다보는 시선입니다.</span>
      </p>
    </div></FI>
    <FI delay={.2}><div style={{maxWidth:760,margin:"56px auto 0",padding:"32px 28px",background:C.w,borderRadius:16,border:`1px solid ${C.g2}`}}>
      <div style={{fontSize:15,color:C.gold,fontWeight:700,letterSpacing:".1em",textAlign:"center",marginBottom:24}}>우리가 바라는 것</div>
      <div style={{display:"grid",gap:18}}>
        {[
          "우리는 부모가 자기 양육을 객관화할 수 있는 힘을 갖기를 바랍니다.",
          "타인의 육아도 다정하게 볼 수 있는 눈을 갖기를 바랍니다.",
          "불안한 부모를 비난하지 않고, 그 불안이 어디에서 왔는지 함께 해석할 수 있는 사람이 되기를 바랍니다.",
        ].map((t,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{flexShrink:0,width:24,height:24,borderRadius:"50%",background:`${C.gold}33`,color:C.navy,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
            <p style={{fontSize:"clamp(16px,2vw,17px)",color:C.g6,lineHeight:1.85,wordBreak:"keep-all",margin:0}}>{t}</p>
          </div>
        ))}
      </div>
      <p style={{marginTop:28,paddingTop:24,borderTop:`1px solid ${C.g2}`,textAlign:"center",fontSize:"clamp(16px,2.2vw,18px)",color:C.navy,fontWeight:600,lineHeight:1.7,wordBreak:"keep-all"}}>
        그 동행을 함께 해주실 분을 기다리고 있어요.
      </p>
    </div></FI>
  </Box></Sec>

  {/* 6주 후, 되어가는 부모 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:40}}>
      <Tag>6주 후, 되어가는 부모</Tag>
      <H2><span style={{display:"inline-block"}}>완벽한 부모가 아니라,</span>{" "}<span style={{display:"inline-block"}}>양육을 해석할 줄 아는 부모로.</span></H2>
    </div></FI>
    <FI delay={.1}><div style={{maxWidth:680,margin:"0 auto",fontSize:18,color:C.g6,lineHeight:2,wordBreak:"keep-all"}}>
      <p style={{marginBottom:24}}>별로인 나, 반복해서 무너지는 나, 아이 앞에서 작아지는 나를 왜곡 없이 바라볼 수 있는 부모. 그래서 내 아이의 장면도 조금 더 선명하게 보이는 부모.</p>
      <blockquote style={{borderLeft:`3px solid ${C.gold}`,paddingLeft:20,fontSize:20,color:C.navy,fontStyle:"italic",lineHeight:1.7}}>
        "모두의 육아를 다정하게 해석하는 부모."
      </blockquote>
    </div></FI>
  </Box></Sec>

  {/* 양육프레임워크 */}
  <Sec bg={C.warm}><Box>
    <FI><div style={{textAlign:"center",marginBottom:40}}>
      <Tag>양육프레임워크</Tag>
      <H2><span style={{display:"inline-block"}}>내 양육의 구조를,</span>{" "}<span style={{display:"inline-block"}}>내가 만든다.</span></H2>
    </div></FI>
    <FI delay={.1}><div style={{maxWidth:680,margin:"0 auto",fontSize:17,color:C.g6,lineHeight:1.9,wordBreak:"keep-all",marginBottom:32}}>
      <p>양육프레임워크란, 나의 감정·생각·행동이 어떻게 연결되어 있는지를 스스로 들여다보는 시선입니다. 남의 방법을 따라 하는 것이 아니라, 나 자신과 우리 아이에게 맞는 나만의 양육 구조를 찾는 일입니다.</p>
    </div></FI>
    <FI delay={.15}><div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"clamp(12px,3vw,32px)",margin:"32px 0 48px",flexWrap:"wrap"}}>
      {["감정","생각","행동"].map((w,i)=>(
        <Fragment key={i}>
          <div style={{padding:"18px 28px",background:C.w,border:`2px solid ${C.gold}`,borderRadius:50,fontSize:18,fontWeight:700,color:C.navy}}>{w}</div>
          {i<2&&<div style={{fontSize:20,color:C.gold}}>↔</div>}
        </Fragment>
      ))}
    </div></FI>
    <FI delay={.2}><div style={{maxWidth:760,margin:"0 auto"}}>
      <h3 style={{textAlign:"center",fontSize:20,fontWeight:700,color:C.navy,marginBottom:24}}>6주간 나에게 일어날 변화</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
        {[
          {n:"01",t:"내 반응을 알아차리는 눈",d:'"내가 지금 왜 이렇게 반응하고 있지?"를 그 한가운데서 알아챕니다.'},
          {n:"02",t:"책임의 경계를 보는 눈",d:"내가 져야 할 책임, 아이에게 넘기지 말아야 할 책임, 아이에게 가르쳐야 할 책임을 구분합니다. 양육의 불안은 이 경계가 흐려질 때 커집니다."},
          {n:"03",t:"다른 육아도 다정하게 보는 눈",d:"내 육아뿐 아니라, 다른 육아에도 다정한 해석을 할 수 있는 부모."},
        ].map((x,i)=>(
          <div key={i} style={{padding:24,background:C.w,borderRadius:16,border:`1px solid ${C.g2}`}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:700,marginBottom:8,letterSpacing:".1em"}}>{x.n}</div>
            <h4 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:10,lineHeight:1.5}}>{x.t}</h4>
            <p style={{fontSize:15,color:C.g6,lineHeight:1.8,wordBreak:"keep-all"}}>{x.d}</p>
          </div>
        ))}
      </div>
      <blockquote style={{maxWidth:560,margin:"40px auto 0",borderLeft:`3px solid ${C.gold}`,paddingLeft:20,fontSize:17,color:C.navy,fontStyle:"italic",lineHeight:1.7,textAlign:"left"}}>
        "누구의 답도 아닌, 내 답으로 양육하는 부모."<br/>
        <span style={{fontSize:15,color:C.g4,fontStyle:"normal"}}>— 이 프로그램이 길러내는 사람</span>
      </blockquote>
    </div></FI>
  </Box></Sec>

  {/* 6주 커리큘럼 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:24}}>
      <Tag>6주 커리큘럼</Tag>
      <H2><span style={{display:"inline-block"}}>6주, 한 회씩,</span>{" "}<span style={{display:"inline-block"}}>내 양육의 구조가 보이기 시작합니다.</span></H2>
    </div></FI>
    <FI delay={.1}><p style={{textAlign:"center",fontSize:16,color:C.g4,marginBottom:32,wordBreak:"keep-all"}}>매 회차 사전 과제(독서 + 분석쓰기)가 있고, 세션은 강의 + 자기분석 + 나눔으로 구성됩니다.</p></FI>
    <FI delay={.15}><div style={{maxWidth:820,margin:"0 auto",display:"grid",gap:12}}>
      {[
        {n:"01",d:"6/5 (금)",t:"프로젝트 세우기",c:"소개와 나눔, 목적과 방향성, 핵심 문제 나누기, 도서 및 과제 안내"},
        {n:"02",d:"6/12 (금)",t:"양육프레임워크, 왜 필요한가",c:"어떻게 세우는가 (강의 + 실습)"},
        {n:"03",d:"6/19 (금)",t:"나의 심리도식 이해하기",c:"검사 해석 및 양육분석지도 수정"},
        {n:"04",d:"6/26 (금)",t:"사랑과 책임감",c:"사랑을 어떻게 받고 어떻게 주는가, 나의 관계에서 책임감은 어떻게 나타나는가",online:true},
        {n:"05",d:"7/3 (금)",t:"나의 양육프레임워크 작성하기",c:"10회 분량의 피드백 및 검사결과 반영"},
        {n:"06",d:"7/10 (금)",t:"나의 양육프레임워크 공유하기",c:"상호 피드백"},
      ].map((x,i)=>(
        <div key={i} style={{padding:"18px 20px",background:C.warm,borderRadius:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:C.gold,fontWeight:700,letterSpacing:".08em",background:C.w,padding:"3px 10px",borderRadius:20,border:`1px solid ${C.gold}66`}}>{x.n}</span>
            <span style={{fontSize:15,color:C.g6,fontWeight:600}}>{x.d}</span>
            {x.online&&<span style={{fontSize:11,padding:"3px 10px",background:C.gold,color:C.navy,borderRadius:20,fontWeight:700,letterSpacing:".05em"}}>온라인</span>}
          </div>
          <div style={{fontSize:"clamp(16px,2vw,17px)",fontWeight:700,color:C.navy,marginBottom:6,wordBreak:"keep-all",lineHeight:1.5}}>{x.t}</div>
          <div style={{fontSize:15,color:C.g6,lineHeight:1.7,wordBreak:"keep-all"}}>{x.c}</div>
        </div>
      ))}
    </div></FI>
    <FI delay={.2}><p style={{textAlign:"center",fontSize:12,color:C.g4,marginTop:24,fontStyle:"italic"}}>* 모든 회기 사이에 '생각-감정-행동'에 대한 분석쓰기 과제 피드백이 진행됩니다.</p></FI>
  </Box></Sec>

  {/* 함께할 12명 */}
  <Sec bg={C.warm}><Box>
    <FI><div style={{textAlign:"center",marginBottom:24}}>
      <Tag>함께할 12명을 찾습니다</Tag>
      <H2>함께할 12명을 찾습니다.</H2>
    </div></FI>
    <FI delay={.1}><p style={{textAlign:"center",fontSize:"clamp(16px,2vw,17px)",color:C.g6,maxWidth:680,margin:"0 auto 48px",lineHeight:1.95,wordBreak:"keep-all",padding:"0 12px"}}>
      <span style={{display:"inline-block"}}>다만 자신의 양육을 진지하게 들여다보고 싶은 사람,</span>{" "}
      <span style={{display:"inline-block"}}>반복되는 고리를 끊고 싶은 사람,</span>{" "}
      <span style={{display:"inline-block"}}>아이를 더 잘 통제하고 싶은 것이 아니라</span>{" "}
      <span style={{display:"inline-block"}}>아이와 나를 더 정확하고 다정하게 이해하고 싶은 사람을 기다립니다.</span>
    </p></FI>
    <FI delay={.15}><div style={{maxWidth:560,margin:"0 auto",padding:"32px 28px",background:C.w,borderRadius:16,border:`2px solid ${C.gold}`}}>
      <h3 style={{fontSize:20,fontWeight:700,color:C.navy,marginBottom:20,textAlign:"center"}}>이런 분과 함께하고 싶습니다</h3>
      {[
        "처방보다 시선을 갖고 싶은 부모",
        "별로인 나, 무너지는 나를 회피하지 않고 보겠다고 결심한 부모",
        "매주 3시간과 사전 과제 시간을 낼 수 있는 부모",
        "그룹 안에서 실수와 부끄러움을 솔직히 나눌 수 있는 부모",
        "이 변화를 가까운 사람들과 나누고 싶은 부모",
      ].map((t,i)=>(
        <div key={i} style={{fontSize:"clamp(16px,2vw,17px)",color:C.g6,padding:"10px 0",display:"flex",alignItems:"flex-start",gap:12,lineHeight:1.7,wordBreak:"keep-all"}}>
          <span style={{color:C.gold,flexShrink:0,fontWeight:700}}>✓</span><span>{t}</span>
        </div>
      ))}
    </div></FI>
  </Box></Sec>

  {/* 실제 정보 */}
  <Sec bg={C.w}><Box>
    <FI><div style={{textAlign:"center",marginBottom:32}}>
      <Tag>실제 정보</Tag>
      <H2>모집·일정·장소</H2>
    </div></FI>
    <FI delay={.1}><div style={{maxWidth:680,margin:"0 auto",borderRadius:16,border:`1px solid ${C.g2}`,overflow:"hidden"}}>
      {[
        {k:"기간",v:"2026.06.05 ~ 07.10 (총 6주)"},
        {k:"시간",v:"매주 금요일 오전 10:00 ~ 오후 1:00 (3시간)"},
        {k:"형식",v:"오프라인 5회 + 온라인 1회 (4주차 / 6.26)"},
        {k:"사전 과제",v:"매주 독서 1권·챕터 + 분석일지 주 3회 이상"},
        {k:"장소",v:"헤이그라운드 성수시작점"},
        {k:"정원",v:"12명 (지원서 검토 후 선발)"},
        {k:"참가비",v:"35만원 (정가 50만원 · 1기 특별 30% 할인)"},
        {k:"모집 마감",v:"2026.05.29 (금)",bold:true},
        {k:"결과 통보",v:"2026.05.29 (금)"},
        {k:"1주차 시작",v:"2026.06.05 (금)"},
      ].map((x,i,a)=>(
        <div key={i} className="info-row" style={{padding:"14px 20px",borderBottom:i<a.length-1?`1px solid ${C.g2}`:"none",background:x.bold?C.warm:C.w}}>
          <div style={{fontSize:12,color:C.g4,fontWeight:500,marginBottom:4,letterSpacing:".03em"}}>{x.k}</div>
          <div style={{fontSize:"clamp(15px,2vw,16px)",color:x.bold?C.navy:C.g6,fontWeight:x.bold?700:500,wordBreak:"keep-all",lineHeight:1.6}}>{x.v}</div>
        </div>
      ))}
    </div></FI>
  </Box></Sec>

  {/* CTA */}
  <Sec bg={C.navy}><Box style={{textAlign:"center"}}>
    <FI><H2 light style={{fontSize:"clamp(22px,4vw,30px)",maxWidth:620,margin:"0 auto 24px"}}><span style={{display:"inline-block"}}>내 양육 장면을,</span>{" "}<span style={{display:"inline-block"}}>다시 보고 싶은 분의 자리입니다.</span></H2></FI>
    <FI delay={.1}><p style={{fontSize:"clamp(17px,2.2vw,18px)",color:"rgba(255,255,255,.78)",lineHeight:1.9,maxWidth:520,margin:"0 auto 40px",wordBreak:"keep-all",padding:"0 12px"}}>
      <span style={{display:"inline-block"}}>지원서는 편안하고 솔직하게 적어주세요.</span>{" "}
      <span style={{display:"inline-block"}}>정답을 묻는 자리가 아니니까요.</span>
    </p></FI>
    <FI delay={.15}><div style={{maxWidth:520,margin:"0 auto 40px",padding:24,background:"rgba(255,255,255,.05)",borderRadius:14,border:"1px solid rgba(255,255,255,.1)",textAlign:"left"}}>
      <h4 style={{fontSize:16,color:C.gold,fontWeight:700,marginBottom:14,textAlign:"center"}}>시작하기 전에, 이 세 가지가 가능한가요?</h4>
      {[
        "매주 금요일 3시간 (10:00–13:00) 정기 참석",
        "매주 사전 과제, 독서와 분석일지 (주 3회 이상)",
        "그룹 안에서 자기 이야기를 솔직히 나누기",
      ].map((t,i)=>(
        <div key={i} style={{fontSize:16,color:"rgba(255,255,255,.85)",padding:"6px 0",display:"flex",gap:10,alignItems:"flex-start",wordBreak:"keep-all"}}>
          <span style={{color:C.gold,flexShrink:0}}>○</span><span>{t}</span>
        </div>
      ))}
    </div></FI>
    <FI delay={.2}>
      <BG onClick={()=>window.open(DELIGHT_APPLY_URL,"_blank")} style={{fontSize:18,padding:"16px 48px"}}>지원서 작성하기 →</BG>
      <p style={{fontSize:15,color:"rgba(255,255,255,.5)",marginTop:16}}>모집 마감 · 2026.05.29 (금)</p>
    </FI>
  </Box></Sec>
</>);

const CounselPage=()=>{
  const[step,setStep]=useState("ask"); // ask | notPacer | form | done
  const[form,setForm]=useState({name:"",phone:"",childAge:"",childGender:"",concerns:[],date:"",time:"",detail:""});
  const[sending,setSending]=useState(false);

  const toggleConcern=c=>{
    setForm(f=>({...f,concerns:f.concerns.includes(c)?f.concerns.filter(x=>x!==c):[...f.concerns,c]}));
  };

  const handleSubmit=async()=>{
    if(!form.name||!form.phone||!form.childAge||!form.childGender||form.concerns.length===0||!form.date||!form.time){
      alert("필수 항목을 모두 입력해주세요.");return;
    }
    setSending(true);
    try{
      const res=await fetch("https://formspree.io/f/xojpaoaz",{
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify({
          _subject:`[페이서 상담 신청] ${form.name}`,
          "신청자명":form.name,
          "연락처":form.phone,
          "아이 연령":form.childAge,
          "아이 성별":form.childGender,
          "고민 유형":form.concerns.join(", "),
          "희망 날짜":form.date,
          "희망 시간":form.time,
          "기타 내용":form.detail||"-",
        })
      });
      if(res.ok){setStep("done")}else{alert("전송에 실패했습니다. 다시 시도해주세요.")}
    }catch(e){alert("네트워크 오류가 발생했습니다.")}
    setSending(false);
  };

  const inputStyle={width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${C.g2}`,fontSize:16,outline:"none",background:C.w,fontFamily:"inherit",transition:"border .2s"};
  const labelStyle={fontSize:15,fontWeight:500,color:C.g6,display:"block",marginBottom:6};

  // 첫 화면: 페이서 여부 확인
  if(step==="ask") return(<>
    <section style={{paddingTop:120,paddingBottom:80,background:C.warm,minHeight:"60vh",display:"flex",alignItems:"center"}}><Box style={{textAlign:"center"}}>
      <FI><div style={{width:80,height:80,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><span style={{fontSize:36,color:"#fff"}}>🤝</span></div></FI>
      <FI delay={.1}><H2>페이서 전용 상담 신청</H2></FI>
      <FI delay={.2}><p style={{fontSize:18,color:C.g6,lineHeight:1.8,maxWidth:480,margin:"0 auto 40px",wordBreak:"keep-all"}}>더나일의 페이서(PACER) 후원자를 위한 전문 양육 상담 서비스입니다.</p></FI>
      <FI delay={.3}><p style={{fontSize:18,fontWeight:600,color:C.navy,marginBottom:24}}>페이서이신가요?</p></FI>
      <FI delay={.35}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn onClick={()=>setStep("form")} style={{minWidth:140,fontSize:18,padding:"16px 40px"}}>네, 페이서입니다</Btn>
        <Btn primary={false} onClick={()=>setStep("notPacer")} style={{minWidth:140,fontSize:18,padding:"16px 40px"}}>아니요</Btn>
      </div></FI>
    </Box></section>
  </>);

  // 페이서가 아닌 경우: 후원 안내
  if(step==="notPacer") return(<>
    <section style={{paddingTop:120,paddingBottom:80,background:C.warm,minHeight:"60vh",display:"flex",alignItems:"center"}}><Box style={{textAlign:"center"}}>
      <FI><div style={{fontSize:48,marginBottom:24}}>💛</div></FI>
      <FI delay={.1}><H2>페이서가 되시면 상담을 받으실 수 있습니다</H2></FI>
      <FI delay={.2}><p style={{fontSize:18,color:C.g6,lineHeight:1.8,maxWidth:520,margin:"0 auto 16px",wordBreak:"keep-all"}}>페이서(PACER)는 더나일과 함께 걷는 후원자입니다. 월 정기후원을 통해 페이서가 되시면 전문 양육 상담 서비스를 이용하실 수 있습니다.</p></FI>
      <FI delay={.25}><p style={{fontSize:17,color:C.g6,lineHeight:1.8,maxWidth:520,margin:"0 auto 40px",wordBreak:"keep-all"}}>가족의 가치를 회복하는 여정에 함께해 주세요.</p></FI>
      <FI delay={.3}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
        <BG onClick={()=>window.open(DONATE_URL,"_blank")} style={{fontSize:18,padding:"16px 40px"}}>후원하고 페이서 되기</BG>
        <Btn primary={false} onClick={()=>setStep("ask")} style={{fontSize:16,padding:"12px 24px"}}>돌아가기</Btn>
      </div></FI>
    </Box></section>
  </>);

  // 상담 완료
  if(step==="done") return(<>
    <section style={{paddingTop:120,paddingBottom:80,background:C.warm,minHeight:"60vh",display:"flex",alignItems:"center"}}><Box style={{textAlign:"center"}}>
      <FI><div style={{fontSize:48,marginBottom:24}}>✅</div></FI>
      <FI delay={.1}><H2>상담 신청이 완료되었습니다</H2></FI>
      <FI delay={.2}><p style={{fontSize:18,color:C.g6,lineHeight:1.8,marginTop:16,wordBreak:"keep-all"}}>담당자가 확인 후 연락드리겠습니다.<br/>감사합니다.</p></FI>
      <FI delay={.3}><div style={{marginTop:32}}><Btn onClick={()=>{setStep("ask");setForm({name:"",phone:"",childAge:"",childGender:"",concerns:[],date:"",time:"",detail:""});}}>새 상담 신청</Btn></div></FI>
    </Box></section>
  </>);

  // 상담 신청 폼
  return(<>
    <section style={{paddingTop:120,paddingBottom:60,background:C.warm}}><Box>
      <FI><Tag>PACER COUNSELING</Tag></FI>
      <FI delay={.1}><H2>페이서 상담 신청</H2></FI>
      <FI delay={.2}><Desc>양육 관련 고민을 전문가와 함께 나눠보세요.</Desc></FI>
    </Box></section>
    <Sec bg={C.w}><Box style={{maxWidth:640}}>
      <FI><div style={{background:C.warm,borderRadius:20,padding:32,border:`1px solid ${C.g2}`}}>

        {/* 이름 */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>이름 *</label>
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="신청자 성함" style={inputStyle}
            onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
        </div>

        {/* 연락처 */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>연락처 *</label>
          <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="010-0000-0000" style={inputStyle}
            onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
        </div>

        {/* 아이 연령 */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>아이 연령 *</label>
          <select value={form.childAge} onChange={e=>setForm({...form,childAge:e.target.value})} style={{...inputStyle,cursor:"pointer",appearance:"auto"}}>
            <option value="">선택해주세요</option>
            {Array.from({length:19},(_, i)=><option key={i} value={`${i}세`}>{i}세</option>)}
          </select>
        </div>

        {/* 아이 성별 */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>아이 성별 *</label>
          <div style={{display:"flex",gap:12}}>
            {["남","여"].map(g=><div key={g} onClick={()=>setForm({...form,childGender:g})} style={{flex:1,padding:"12px 16px",borderRadius:10,textAlign:"center",cursor:"pointer",fontSize:16,fontWeight:500,border:`1px solid ${form.childGender===g?C.navy:C.g2}`,background:form.childGender===g?C.navy:"transparent",color:form.childGender===g?"#fff":C.g6,transition:"all .2s"}}>{g}</div>)}
          </div>
        </div>

        {/* 고민 유형 (체크박스) */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>고민 유형 * (중복 선택 가능)</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {CONCERN_OPTIONS.map(c=><div key={c} onClick={()=>toggleConcern(c)} style={{padding:"8px 16px",borderRadius:20,fontSize:15,cursor:"pointer",background:form.concerns.includes(c)?C.navy:C.w,color:form.concerns.includes(c)?"#fff":C.g6,border:`1px solid ${form.concerns.includes(c)?C.navy:C.g2}`,transition:"all .2s"}}>{form.concerns.includes(c)?"✓ ":""}{c}</div>)}
          </div>
        </div>

        {/* 희망 날짜 */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>상담 희망 날짜 *</label>
          <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{...inputStyle,cursor:"pointer"}}
            min={new Date().toISOString().split("T")[0]}
            onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
        </div>

        {/* 희망 시간 */}
        <div style={{marginBottom:20}}>
          <label style={labelStyle}>상담 희망 시간 *</label>
          <select value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={{...inputStyle,cursor:"pointer",appearance:"auto"}}>
            <option value="">선택해주세요</option>
            {TIME_SLOTS.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* 기타 내용 */}
        <div style={{marginBottom:28}}>
          <label style={labelStyle}>기타 고민 내용</label>
          <textarea value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})} placeholder="상담받고 싶은 내용을 자유롭게 작성해주세요." rows={4}
            style={{...inputStyle,resize:"vertical"}}
            onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.g2}/>
        </div>

        <BG onClick={handleSubmit} style={{width:"100%",padding:"16px",fontSize:18,textAlign:"center",opacity:sending?.6:1,pointerEvents:sending?"none":"auto"}}>{sending?"전송 중...":"상담 신청하기"}</BG>
        <div style={{marginTop:16,textAlign:"center"}}><span onClick={()=>setStep("ask")} style={{fontSize:15,color:C.g6,cursor:"pointer",textDecoration:"underline"}}>돌아가기</span></div>
      </div></FI>
    </Box></Sec>
  </>);
};

/* ═══ SEO META ═══ */
const PAGE_META={
  home:{title:"사단법인 더나일 | 부모됨의 두려움이 기쁨으로 전환되는 여정",desc:"사단법인 더나일은 건강한 양육문화 확산과 부모의 심리적 안정을 위해 활동하는 서울특별시 산하 비영리법인입니다."},
  about:{title:"더나일 소개 | 사단법인 더나일",desc:"더나일의 미션, 비전, 설립목적, 주된사업, 연혁, 이사진을 소개합니다."},
  programs:{title:"사업소개 | 사단법인 더나일",desc:"더나일이 수행한 양육문화 확산, 부모교육, 위기가족 지원 등 주요 사업을 소개합니다."},
  delight:{title:"딜라이트 프로젝트 1기 모집 | 사단법인 더나일",desc:"방법은 충분히 배웠는데, 왜 어제와 똑같을까요. 내 양육 장면을 다시 보는 6주, 12명을 모집합니다."},
  parentscan:{title:"양육불안검사 | 사단법인 더나일",desc:"양육자가 느끼는 심리/정서적 불안 수준과 양육 효능감을 측정하는 양육불안척도 검사입니다."},
  pacer:{title:"후원하기 - 페이서(PACER) | 사단법인 더나일",desc:"더나일과 함께 걷는 페이서가 되어주세요. 가족의 가치를 회복하는 여정에 함께합니다."},
  shop:{title:"상품 | 사단법인 더나일",desc:"더나일의 전문 상담 서비스를 만나보세요."},
  counsel:{title:"페이서 상담 | 사단법인 더나일",desc:"페이서 후원자를 위한 전문 양육 상담 신청 페이지입니다."},
  contact:{title:"협력문의 | 사단법인 더나일",desc:"기업 CSR, 강연, 기관 협업, 연구 협력, 후원 협약 등 더나일과의 협력을 문의하세요."},
  refund:{title:"환불 정책 | 사단법인 더나일",desc:"사단법인 더나일 상담·교육 서비스의 환불 및 취소 규정 안내."},
  conference:{title:"2026 양육불안 컨퍼런스 | 사단법인 더나일",desc:"부모의 불안은 어디에서 오는가 — 뇌과학·발달심리·당사자의 시선으로 양육불안을 함께 풀어보는 비영리 컨퍼런스. 2026.07.09 헤이그라운드 브릭스홀."},
};

const PATH_MAP={"/":"home","/about":"about","/programs":"programs","/delight":"delight","/conference":"conference","/parentscan":"parentscan","/pacer":"pacer","/shop":"shop","/counsel":"counsel","/contact":"contact","/refund":"refund"};
const ID_TO_PATH={home:"/",about:"/about",programs:"/programs",delight:"/delight",conference:"/conference",parentscan:"/parentscan",pacer:"/pacer",shop:"/shop",counsel:"/counsel",contact:"/contact",refund:"/refund"};

/* ═══ APP ═══ */
export default function App(){
  const getPageFromPath=()=>{const p=window.location.pathname.replace(/\/$/,"");return PATH_MAP[p||"/"]||"home"};
  const[page,setPage]=useState(getPageFromPath);

  useEffect(()=>{
    const onPop=()=>setPage(getPageFromPath());
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

  useEffect(()=>{
    const meta=PAGE_META[page]||PAGE_META.home;
    document.title=meta.title;
    let desc=document.querySelector('meta[name="description"]');
    if(!desc){desc=document.createElement("meta");desc.name="description";document.head.appendChild(desc)}
    desc.content=meta.desc;
  },[page]);

  const go=id=>{
    setPage(id);
    const path=ID_TO_PATH[id]||"/";
    window.history.pushState({},"",path);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const P={home:<HomePage go={go}/>,about:<AboutPage go={go}/>,programs:<ProgramsPage/>,delight:<DelightPage/>,conference:<ConferencePage/>,parentscan:<ParentscanPage/>,pacer:<PacerPage/>,shop:<ShopPage/>,counsel:<CounselPage/>,contact:<ContactPage/>,refund:<RefundPage/>};
  return(<div><Nav page={page} go={go}/><main>{P[page]||<HomePage go={go}/>}</main><Footer go={go}/></div>);
}

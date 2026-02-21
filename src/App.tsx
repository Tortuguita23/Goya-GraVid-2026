import { useState, useEffect } from "react";

declare global {
  interface Window {
    storage?: {
      get: (key: string) => Promise<{ value: string } | null>;
      set: (key: string, value: string) => Promise<void>;
    };
  }
}

const CATS = [
  { id:"pelicula", label:"Mejor Película", emoji:"🏆", nominees:[
    {id:"cena",name:"La cena"},{id:"domingos",name:"Los domingos",nv:true},
    {id:"maspalomas",name:"Maspalomas"},{id:"sirat",name:"Sirât"},{id:"sorda",name:"Sorda"},
  ]},
  { id:"direccion", label:"Mejor Dirección", emoji:"🎬", nominees:[
    {id:"domingos_d",name:"Alauda Ruiz de Azúa",film:"Los domingos",nv:true},
    {id:"maspalomas_d",name:"Arregi & Goenaga",film:"Maspalomas"},
    {id:"romeria_d",name:"Carla Simón",film:"Romería"},
    {id:"sirat_d",name:"Oliver Laxe",film:"Sirât"},
    {id:"tardes_d",name:"Albert Serra",film:"Tardes de soledad"},
  ]},
  { id:"actriz_p", label:"Actriz Protagonista", emoji:"👩‍🎭", nominees:[
    {id:"furia_ap",name:"Ángela Cervantes",film:"La furia"},
    {id:"domingos_ap",name:"Patricia López Arnaiz",film:"Los domingos",nv:true},
    {id:"tortuga_ap",name:"Antonia Zegers",film:"Los Tortuga"},
    {id:"eva_ap",name:"Nora Navas",film:"Mi amiga Eva"},
    {id:"fantasma_ap",name:"Susana Abaitua",film:"Un fantasma en la batalla"},
  ]},
  { id:"actor_p", label:"Actor Protagonista", emoji:"🧔", nominees:[
    {id:"cena_ap",name:"Alberto San Juan",film:"La cena"},
    {id:"domingos_ap2",name:"Miguel Garcés",film:"Los domingos",nv:true},
    {id:"maspalomas_ap",name:"José Ramón Soroiz",film:"Maspalomas"},
    {id:"muylejos_ap",name:"Mario Casas",film:"Muy lejos"},
    {id:"quinta_ap",name:"Manolo Solo",film:"Una quinta portuguesa"},
  ]},
  { id:"actriz_r", label:"Actriz de Reparto", emoji:"✨", nominees:[
    {id:"cena_ar",name:"Elvira Mínguez",film:"La cena"},
    {id:"domingos_ar",name:"Nagore Aranburu",film:"Los domingos",nv:true},
    {id:"romeria_ar",name:"Miryam Gallego",film:"Romería"},
    {id:"sorda_ar",name:"Elena Irureta",film:"Sorda"},
    {id:"quinta_ar",name:"María de Medeiros",film:"Una quinta portuguesa"},
  ]},
  { id:"actor_r", label:"Actor de Reparto", emoji:"🎭", nominees:[
    {id:"cautivo_ar",name:"Miguel Rellán",film:"El cautivo",nv:true},
    {id:"domingos_ar2",name:"Juan Minujín",film:"Los domingos",nv:true},
    {id:"maspalomas_ar",name:"Kandido Uranga",film:"Maspalomas"},
    {id:"rondallas_ar",name:"Tamar Novas",film:"Rondallas",nv:true},
    {id:"sorda_ar2",name:"Álvaro Cervantes",film:"Sorda"},
  ]},
  { id:"actriz_rev", label:"Actriz Revelación", emoji:"⭐", nominees:[
    {id:"cena_rv",name:"Nora Hernández",film:"La cena"},
    {id:"domingos_rv",name:"Blanca Soroa",film:"Los domingos",nv:true},
    {id:"tortuga_rv",name:"Elvira Lara",film:"Los Tortuga"},
    {id:"romeria_rv",name:"Llúcia Garcia",film:"Romería"},
    {id:"sorda_rv",name:"Miriam Garlo",film:"Sorda"},
  ]},
  { id:"actor_rev", label:"Actor Revelación", emoji:"⭐", nominees:[
    {id:"ciudad_rv",name:"Toni Fernández",film:"Ciudad sin sueño",nv:true},
    {id:"cautivo_rv",name:"Julio Peña",film:"El cautivo",nv:true},
    {id:"enemigos_rv",name:"Hugo Welzel",film:"Enemigos"},
    {id:"estrany_rv",name:"Jan Monter",film:"Estrany riu"},
    {id:"romeria_rv2",name:"Mitch",film:"Romería"},
  ]},
  { id:"guion_ad", label:"Guion Adaptado", emoji:"📝", nominees:[
    {id:"ciudad_ga",name:"Ciudad sin sueño",nv:true},{id:"buetra_ga",name:"La buena letra"},
    {id:"cena_ga",name:"La cena"},{id:"romeria_ga",name:"Romería"},{id:"sorda_ga",name:"Sorda"},
  ]},
  { id:"guion_or", label:"Guion Original", emoji:"📝", nominees:[
    {id:"domingos_go",name:"Los domingos",nv:true},{id:"maspalomas_go",name:"Maspalomas"},
    {id:"sirat_go",name:"Sirât"},{id:"fantasma_go",name:"Un fantasma en la batalla"},{id:"quinta_go",name:"Una quinta portuguesa"},
  ]},
  { id:"dir_nov", label:"Dirección Novel", emoji:"🌱", nominees:[
    {id:"balearic_dn",name:"Ion de Sosa",film:"Balearic",nv:true},{id:"estrany_dn",name:"Jaume Claret",film:"Estrany riu"},
    {id:"furia_dn",name:"Gemma Blasco",film:"La furia"},{id:"muylejos_dn",name:"Gerard Oms",film:"Muy lejos"},
    {id:"sorda_dn",name:"Eva Libertad",film:"Sorda"},
  ]},
  { id:"fotografia", label:"Fotografía", emoji:"📷", nominees:[
    {id:"ciudad_fo",name:"Ciudad sin sueño",nv:true},{id:"domingos_fo",name:"Los domingos",nv:true},
    {id:"tigres_fo",name:"Los Tigres",nv:true},{id:"maspalomas_fo",name:"Maspalomas"},{id:"sirat_fo",name:"Sirât"},
  ]},
  { id:"montaje", label:"Montaje", emoji:"✂️", nominees:[
    {id:"ciudad_mo",name:"Ciudad sin sueño",nv:true},{id:"domingos_mo",name:"Los domingos",nv:true},
    {id:"tigres_mo",name:"Los Tigres",nv:true},{id:"sirat_mo",name:"Sirât"},{id:"fantasma_mo",name:"Un fantasma en la batalla"},
  ]},
  { id:"dir_prod", label:"Dir. de Producción", emoji:"🏗️", nominees:[
    {id:"ciudad_dp",name:"Ciudad sin sueño",nv:true},{id:"cautivo_dp",name:"El cautivo",nv:true},
    {id:"domingos_dp",name:"Los domingos",nv:true},{id:"tigres_dp",name:"Los Tigres",nv:true},{id:"sirat_dp",name:"Sirât"},
  ]},
  { id:"dir_arte", label:"Dir. de Arte", emoji:"🎨", nominees:[
    {id:"cautivo_da",name:"El cautivo",nv:true},{id:"cena_da",name:"La cena"},
    {id:"tigres_da",name:"Los Tigres",nv:true},{id:"maspalomas_da",name:"Maspalomas"},{id:"sirat_da",name:"Sirât"},
  ]},
  { id:"vestuario", label:"Diseño de Vestuario", emoji:"👗", nominees:[
    {id:"cautivo_ve",name:"El cautivo",nv:true},{id:"gaua_ve",name:"Gaua"},
    {id:"cena_ve",name:"La cena"},{id:"domingos_ve",name:"Los domingos",nv:true},{id:"romeria_ve",name:"Romería"},
  ]},
  { id:"maquillaje", label:"Maquillaje y Peluquería", emoji:"💄", nominees:[
    {id:"cautivo_mq",name:"El cautivo",nv:true},{id:"gaua_mq",name:"Gaua"},
    {id:"tregua_mq",name:"La tregua",nv:true},{id:"maspalomas_mq",name:"Maspalomas"},{id:"sirat_mq",name:"Sirât"},
  ]},
  { id:"vfx", label:"Efectos Especiales", emoji:"💥", nominees:[
    {id:"enemigos_vf",name:"Enemigos"},{id:"gaua_vf",name:"Gaua"},
    {id:"tigres_vf",name:"Los Tigres",nv:true},{id:"sirat_vf",name:"Sirât"},{id:"fantasma_vf",name:"Un fantasma en la batalla"},
  ]},
  { id:"sonido", label:"Sonido", emoji:"🔊", nominees:[
    {id:"cautivo_so",name:"El cautivo",nv:true},{id:"domingos_so",name:"Los domingos",nv:true},
    {id:"tigres_so",name:"Los Tigres",nv:true},{id:"sirat_so",name:"Sirât"},{id:"sorda_so",name:"Sorda"},
  ]},
  { id:"musica", label:"Música Original", emoji:"🎵", nominees:[
    {id:"talento_mu",name:"El talento",nv:true},{id:"leolou_mu",name:"Leo & Lou",nv:true},
    {id:"tigres_mu",name:"Los Tigres",nv:true},{id:"maspalomas_mu",name:"Maspalomas"},{id:"sirat_mu",name:"Sirât"},
  ]},
  { id:"cancion", label:"Canción Original", emoji:"🎶", nominees:[
    {id:"caigan_ca",name:"¡Caigan las rosas blancas!",nv:true},{id:"flores_ca",name:"Flores para Antonio",nv:true},
    {id:"hasta_ca",name:"Hasta que me quede sin voz",nv:true},{id:"cena_ca",name:"Y mientras tanto, canto",film:"La cena"},
    {id:"parecido_ca",name:"Caminar el tiempo",film:"Parecido a un asesinato",nv:true},
  ]},
];

const INIT = {
  G: {
    pelicula:["sorda","maspalomas","sirat","cena"], direccion:["sirat_d","romeria_d","maspalomas_d","tardes_d"],
    actriz_p:["furia_ap","tortuga_ap","fantasma_ap","eva_ap"], actor_p:["maspalomas_ap","cena_ap","muylejos_ap","quinta_ap"],
    actriz_r:["cena_ar","quinta_ar","sorda_ar","romeria_ar"], actor_r:["sorda_ar2","maspalomas_ar"],
    actriz_rev:["tortuga_rv","romeria_rv","sorda_rv","cena_rv"], actor_rev:["enemigos_rv","romeria_rv2","estrany_rv"],
    guion_ad:["sorda_ga","romeria_ga","buetra_ga","cena_ga"], guion_or:["sirat_go","maspalomas_go","quinta_go","fantasma_go"],
    dir_nov:["sorda_dn","furia_dn","muylejos_dn","estrany_dn"], fotografia:["sirat_fo","maspalomas_fo"],
    montaje:["sirat_mo","fantasma_mo"], dir_prod:["sirat_dp"], dir_arte:["cena_da"],
    vestuario:["cena_ve","romeria_ve","gaua_ve"], maquillaje:["maspalomas_mq","sirat_mq","gaua_mq"],
    vfx:["sirat_vf","enemigos_vf","gaua_vf","fantasma_vf"], sonido:["sirat_so","sorda_so"],
    musica:["sirat_mu","maspalomas_mu"], cancion:["cena_ca"],
  },
  D: {
    pelicula:["sirat","maspalomas","sorda","cena"], direccion:["sirat_d","maspalomas_d","romeria_d","tardes_d"],
    actriz_p:["furia_ap","tortuga_ap","fantasma_ap","eva_ap"], actor_p:["maspalomas_ap","muylejos_ap","cena_ap","quinta_ap"],
    actriz_r:["cena_ar","quinta_ar","sorda_ar","romeria_ar"], actor_r:["sorda_ar2","maspalomas_ar"],
    actriz_rev:["tortuga_rv","sorda_rv","romeria_rv","cena_rv"], actor_rev:["enemigos_rv","estrany_rv","romeria_rv2"],
    guion_ad:["romeria_ga","sorda_ga","buetra_ga","cena_ga"], guion_or:["sirat_go","maspalomas_go","quinta_go","fantasma_go"],
    dir_nov:["sorda_dn","estrany_dn","muylejos_dn","furia_dn"], fotografia:["sirat_fo","maspalomas_fo"],
    montaje:["sirat_mo","fantasma_mo"], dir_prod:["sirat_dp"], dir_arte:["sirat_da"],
    vestuario:["cena_ve","romeria_ve","gaua_ve"], maquillaje:["maspalomas_mq","sirat_mq","gaua_mq"],
    vfx:["sirat_vf","enemigos_vf","gaua_vf","fantasma_vf"], sonido:["sirat_so","sorda_so"],
    musica:["sirat_mu","maspalomas_mu"], cancion:["cena_ca"],
  },
};

const GOLD = "#C9A84C";
const PC = { G:"#5B9BD5", D:"#D4763A" };
const PN = { G:"Graciela", D:"David" };
const pts = r => r ? Math.max(0, 6 - r) : 0;
const SECRET = "23";

const storage = window.storage ?? {
  async get(key) {
    const value = window.localStorage.getItem(key);
    return value == null ? null : { value };
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
  },
};

function insertAtPos(arr, nomId, pos) {
  const f = arr.filter(id => id !== nomId);
  f.splice(pos - 1, 0, nomId);
  return f;
}
function removeFromRank(arr, nomId) { return arr.filter(id => id !== nomId); }

function PinScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const tryPin = (p) => {
    if (p === SECRET) { onUnlock(); }
    else if (p.length >= SECRET.length) { setErr(true); setTimeout(() => { setPin(""); setErr(false); }, 700); }
  };

  const press = (d) => {
    const next = pin + d;
    setPin(next);
    setErr(false);
    tryPin(next);
  };
  const del = () => { setPin(p => p.slice(0,-1)); setErr(false); };

  return (
    <div style={{minHeight:"100vh", background:"#1e1608", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif"}}>
      {/* Film strip top */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:18,background:"#111",display:"flex",gap:3,padding:"4px 6px",boxSizing:"border-box"}}>
        {Array.from({length:40}).map((_,i)=>(
          <div key={i} style={{flex:1,background:i%3===1?"#2a2010":"transparent",borderRadius:1}}/>
        ))}
      </div>

      <div style={{textAlign:"center",padding:"0 24px",maxWidth:320}}>
        <div style={{fontSize:36, color:GOLD, marginBottom:4, letterSpacing:4}}>✦</div>
        <div style={{fontSize:26, fontWeight:700, color:GOLD, letterSpacing:3, marginBottom:4}}>GOYA GraVid</div>
        <div style={{fontSize:12, color:"rgba(200,170,100,0.5)", letterSpacing:2, marginBottom:36}}>2026 · BARCELONA</div>

        {/* Dots */}
        <div style={{display:"flex", justifyContent:"center", gap:14, marginBottom:32}}>
          {Array.from({length:pin.length||1}).map((_,i)=>(
            <div key={i} style={{width:12, height:12, borderRadius:"50%",
              background: err ? "#c05040" : pin.length > i ? GOLD : "transparent",
              border:`2px solid ${err?"#c05040":GOLD}`,
              transition:"all .15s"}}/>
          ))}
          {pin.length === 0 && <div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${GOLD}55`}}/>}
        </div>

        {/* Keypad */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12}}>
          {[1,2,3,4,5,6,7,8,9].map(d=>(
            <button key={d} onClick={()=>press(String(d))} style={{
              padding:"16px 0", borderRadius:4, border:`1px solid ${GOLD}33`,
              background:"rgba(200,165,80,0.07)", color:"rgba(220,195,130,0.9)",
              fontSize:20, fontFamily:"Georgia,serif", cursor:"pointer",
              transition:"all .1s"
            }}
            onMouseEnter={e=>{ e.target.style.background=`rgba(200,165,80,0.18)`; e.target.style.color=GOLD; }}
            onMouseLeave={e=>{ e.target.style.background="rgba(200,165,80,0.07)"; e.target.style.color="rgba(220,195,130,0.9)"; }}
            >{d}</button>
          ))}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
          <div/>
          <button onClick={()=>press("0")} style={{
            padding:"16px 0", borderRadius:4, border:`1px solid ${GOLD}33`,
            background:"rgba(200,165,80,0.07)", color:"rgba(220,195,130,0.9)",
            fontSize:20, fontFamily:"Georgia,serif", cursor:"pointer",
            transition:"all .1s"
          }}
          onMouseEnter={e=>{ e.target.style.background=`rgba(200,165,80,0.18)`; e.target.style.color=GOLD; }}
          onMouseLeave={e=>{ e.target.style.background="rgba(200,165,80,0.07)"; e.target.style.color="rgba(220,195,130,0.9)"; }}
          >0</button>
          <button onClick={del} style={{
            padding:"16px 0", borderRadius:4, border:"1px solid rgba(180,160,110,0.15)",
            background:"transparent", color:"rgba(180,160,110,0.5)",
            fontSize:16, fontFamily:"Georgia,serif", cursor:"pointer"
          }}>⌫</button>
        </div>

        {err && <div style={{marginTop:20,fontSize:12,color:"#c07060",letterSpacing:1}}>PIN incorrecto</div>}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,height:18,background:"#111",display:"flex",gap:3,padding:"4px 6px",boxSizing:"border-box"}}>
        {Array.from({length:40}).map((_,i)=>(
          <div key={i} style={{flex:1,background:i%3===1?"#2a2010":"transparent",borderRadius:1}}/>
        ))}
      </div>
    </div>
  );
}

function RankColumn({ cat, player, order, onInsert, onRemove, winner }) {
  const color = PC[player];
  const nom = id => cat.nominees.find(n => n.id === id);
  const ranked = (order||[]).map(id => nom(id)).filter(Boolean);
  const unranked = cat.nominees.filter(n => !(order||[]).includes(n.id));
  const maxPos = ranked.length + 1;

  return (
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13,fontWeight:700,color,marginBottom:8,textAlign:"center",
        paddingBottom:6,borderBottom:`2px solid ${color}66`,letterSpacing:1}}>
        {PN[player]}
      </div>

      {ranked.map((n, idx) => {
        const pos = idx+1;
        const isW = winner===n.id;
        return (
          <div key={n.id} style={{
            marginBottom:5,borderRadius:5,
            background:isW?"rgba(200,165,80,0.1)":pos===1?`${color}15`:"rgba(0,0,0,0.06)",
            border:isW?`1px solid ${GOLD}66`:pos===1?`1px solid ${color}44`:"1px solid rgba(0,0,0,0.08)",
            padding:"7px 8px",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <div style={{width:24,height:24,borderRadius:4,flexShrink:0,
                background:pos===1?color:"rgba(0,0,0,0.12)",
                color:pos===1?"#fff":"rgba(80,60,30,0.6)",
                fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {pos}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:isW?"#a07828":pos===1?"#3a2a10":"#4a3a18",lineHeight:1.25,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {n.name}
                </div>
                {n.film&&<div style={{fontSize:10,color:"rgba(100,80,40,0.6)",marginTop:1}}>{n.film}</div>}
                {n.nv&&<div style={{fontSize:10,color:"rgba(160,120,40,0.7)",marginTop:1}}>📺 pendiente</div>}
                {isW&&<div style={{fontSize:10,color:"#a07828",fontWeight:700}}>🏆 {pts(pos)} puntos</div>}
              </div>
              <button onClick={()=>onRemove(player,cat.id,n.id)} style={{
                background:"none",border:"none",cursor:"pointer",
                color:"rgba(100,80,40,0.3)",fontSize:16,padding:"0 2px",lineHeight:1,flexShrink:0,
              }} onMouseEnter={e=>e.target.style.color="rgba(180,60,40,0.6)"}
                 onMouseLeave={e=>e.target.style.color="rgba(100,80,40,0.3)"}>×</button>
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {Array.from({length:ranked.length},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>onInsert(player,cat.id,n.id,p)} style={{
                  width:24,height:20,borderRadius:3,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                  background:p===pos?color:"rgba(0,0,0,0.08)",
                  color:p===pos?"#fff":"rgba(100,80,40,0.5)",
                  transition:"all .12s"
                }}>{p}</button>
              ))}
            </div>
          </div>
        );
      })}

      {unranked.length>0&&(
        <div style={{fontSize:10,color:"rgba(100,80,40,0.4)",textAlign:"center",
          margin:"8px 0 5px",display:"flex",alignItems:"center",gap:6}}>
          <div style={{flex:1,height:1,background:"rgba(0,0,0,0.1)"}}/>
          <span style={{letterSpacing:1}}>SIN POSICIÓN</span>
          <div style={{flex:1,height:1,background:"rgba(0,0,0,0.1)"}}/>
        </div>
      )}

      {unranked.map(n=>{
        const isW=winner===n.id;
        return (
          <div key={n.id} style={{
            marginBottom:5,borderRadius:5,padding:"7px 8px",
            background:"rgba(0,0,0,0.03)",
            border:isW?`1px solid ${GOLD}44`:"1px dashed rgba(0,0,0,0.1)",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,color:isW?"#a07828":"rgba(100,80,40,0.5)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {n.name}
                </div>
                {n.film&&<div style={{fontSize:10,color:"rgba(100,80,40,0.4)",marginTop:1}}>{n.film}</div>}
                {n.nv&&<div style={{fontSize:10,color:"rgba(160,120,40,0.6)",marginTop:1}}>📺 pendiente</div>}
              </div>
              {isW&&<span style={{fontSize:10,color:"#b06050",fontWeight:700,flexShrink:0}}>🏆 0pts</span>}
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {Array.from({length:maxPos},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>onInsert(player,cat.id,n.id,p)} style={{
                  width:24,height:20,borderRadius:3,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                  background:"rgba(0,0,0,0.07)",color:"rgba(100,80,40,0.4)",transition:"all .12s"
                }}
                onMouseEnter={e=>{ e.target.style.background=color; e.target.style.color="#fff"; }}
                onMouseLeave={e=>{ e.target.style.background="rgba(0,0,0,0.07)"; e.target.style.color="rgba(100,80,40,0.4)"; }}
                >{p}</button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [ranks, setRanks] = useState(INIT);
  const [winners, setWinners] = useState({});
  const [tab, setTab] = useState("apuestas");
  const [open, setOpen] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    (async()=>{
      try { const r=await storage.get("g26_r3"); if(r) setRanks(JSON.parse(r.value)); } catch(e){}
      try { const w=await storage.get("g26_w3"); if(w) setWinners(JSON.parse(w.value)); } catch(e){}
      setLoaded(true);
    })();
  },[]);

  const save = async(nr,nw)=>{
    try { await storage.set("g26_r3",JSON.stringify(nr)); } catch(e){}
    try { await storage.set("g26_w3",JSON.stringify(nw||winners)); } catch(e){}
  };

  const handleInsert=(player,catId,nomId,pos)=>{
    const nr={...ranks,[player]:{...ranks[player],[catId]:insertAtPos(ranks[player][catId]||[],nomId,pos)}};
    setRanks(nr); save(nr);
  };
  const handleRemove=(player,catId,nomId)=>{
    const nr={...ranks,[player]:{...ranks[player],[catId]:removeFromRank(ranks[player][catId]||[],nomId)}};
    setRanks(nr); save(nr);
  };
  const setWinner=(catId,nomId)=>{
    const nw={...winners,[catId]:winners[catId]===nomId?undefined:nomId};
    if(!nw[catId]) delete nw[catId];
    setWinners(nw); save(ranks,nw);
  };

  if(!loaded) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5efe0",fontFamily:"Georgia,serif",color:GOLD,letterSpacing:3}}>CARGANDO…</div>;
  if(!unlocked) return <PinScreen onUnlock={()=>setUnlocked(true)}/>;

  const revCats=CATS.filter(c=>winners[c.id]);
  const score={G:0,D:0};
  revCats.forEach(c=>["G","D"].forEach(p=>{
    const pos=(ranks[p][c.id]||[]).indexOf(winners[c.id]);
    score[p]+=pos>=0?pts(pos+1):0;
  }));
  const progress=p=>CATS.filter(c=>(ranks[p][c.id]||[]).length>0).length;

  const BG="#f5efe0";
  const BG2="#ede5ce";
  const TEXT="#3a2a10";

  return (
    <div style={{fontFamily:"Georgia,'Times New Roman',serif",background:BG,minHeight:"100vh",color:TEXT,paddingBottom:60}}>

      {/* Header */}
      <div style={{background:`linear-gradient(180deg,#2a1e08,#3d2d0e)`,padding:"18px 16px 14px",borderBottom:`3px solid ${GOLD}`}}>
        <div style={{display:"flex",gap:3,marginBottom:12,opacity:.3}}>
          {Array.from({length:32}).map((_,i)=>(
            <div key={i} style={{flex:1,height:7,background:i%3===1?GOLD:"transparent",borderRadius:1}}/>
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:26,fontWeight:700,color:GOLD,letterSpacing:3,textShadow:`0 0 30px ${GOLD}55`}}>
            GOYA GraVid 2026
          </div>
          <div style={{width:50,height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,margin:"8px auto"}}/>
          <div style={{fontSize:12,color:"rgba(200,170,100,0.7)",letterSpacing:2,marginBottom:10}}>40ª Edición · Barcelona · 28 de Febrero de 2026</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,fontSize:13}}>
            <span style={{color:PC.G}}>● <b>Graciela</b> <span style={{color:"rgba(200,170,100,0.5)",fontSize:12}}>{progress("G")}/{CATS.length}</span></span>
            <span style={{color:PC.D}}>● <b>David</b> <span style={{color:"rgba(200,170,100,0.5)",fontSize:12}}>{progress("D")}/{CATS.length}</span></span>
            {revCats.length>0&&<span style={{color:GOLD,fontSize:12}}>{revCats.length} revelados</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:3,marginTop:12,opacity:.3}}>
          {Array.from({length:32}).map((_,i)=>(
            <div key={i} style={{flex:1,height:7,background:i%3===1?GOLD:"transparent",borderRadius:1}}/>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:"#2a1e08",position:"sticky",top:0,zIndex:10,borderBottom:`2px solid ${GOLD}44`}}>
        {[["apuestas","RANKINGS"],["difs","DIFERENCIAS"],["resultados","GALA"],["podio","PODIO"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1,padding:"12px 2px",background:"none",border:"none",
            color:tab===id?GOLD:"rgba(200,170,100,0.4)",
            fontFamily:"Georgia,serif",fontSize:11,letterSpacing:2,cursor:"pointer",
            borderBottom:tab===id?`2px solid ${GOLD}`:"2px solid transparent",
            transition:"all .2s"
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"14px 10px"}}>

        {/* RANKINGS */}
        {tab==="apuestas"&&(
          <div>
            <div style={{fontSize:12,color:"rgba(80,60,30,0.5)",letterSpacing:.5,padding:"2px 4px 12px"}}>
              Pulsa un número para insertar en esa posición · Los demás se desplazan · 📺 pendiente de ver
            </div>
            {CATS.map(cat=>{
              const isOpen=open===cat.id;
              const gO=ranks.G[cat.id]||[], dO=ranks.D[cat.id]||[];
              const gTop=gO[0]?cat.nominees.find(n=>n.id===gO[0]):null;
              const dTop=dO[0]?cat.nominees.find(n=>n.id===dO[0]):null;
              const wId=winners[cat.id], wNom=wId?cat.nominees.find(n=>n.id===wId):null;
              const gPos=wId?(gO.indexOf(wId)+1||null):null;
              const dPos=wId?(dO.indexOf(wId)+1||null):null;
              return (
                <div key={cat.id} style={{marginBottom:6,borderRadius:6,overflow:"hidden",
                  border:isOpen?`2px solid ${GOLD}88`:`1px solid rgba(180,140,60,0.2)`,
                  background:isOpen?"#fff":BG2,boxShadow:isOpen?"0 2px 12px rgba(0,0,0,0.1)":"none"}}>
                  <button onClick={()=>setOpen(isOpen?null:cat.id)} style={{
                    width:"100%",background:"none",border:"none",cursor:"pointer",
                    padding:"12px 16px",textAlign:"left",display:"flex",alignItems:"center",gap:12,color:TEXT}}>
                    <span style={{fontSize:20,flexShrink:0}}>{cat.emoji}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontSize:14,fontWeight:700,color:"#3a2a10"}}>{cat.label}</span>
                        {wNom&&<span style={{fontSize:10,color:GOLD,border:`1px solid ${GOLD}66`,padding:"1px 6px",borderRadius:3,letterSpacing:1}}>🏆 REVELADO</span>}
                      </div>
                      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                        {[["G",gTop,gPos,gO],["D",dTop,dPos,dO]].map(([p,top,wpos,ord])=>(
                          <span key={p} style={{fontSize:12,color:PC[p],display:"flex",alignItems:"baseline",gap:5}}>
                            <b style={{fontSize:11}}>{PN[p]}:</b>
                            {top?<span style={{color:"#4a3820"}}>{top.name}</span>:<span style={{color:"rgba(100,80,40,0.3)"}}>sin rankear</span>}
                            <span style={{color:"rgba(100,80,40,0.4)",fontSize:11}}>({ord.length}/5)</span>
                            {wNom&&wpos&&<span style={{color:pts(wpos)>=4?"#8a7020":pts(wpos)>=2?"#a06020":"#b05040",fontWeight:700}}>#{wpos}={pts(wpos)}pts</span>}
                            {wNom&&!wpos&&<span style={{color:"#b05040",fontWeight:700}}>0pts</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{color:`${GOLD}88`,fontSize:12}}>{isOpen?"▲":"▼"}</span>
                  </button>
                  {isOpen&&(
                    <div style={{borderTop:`1px solid rgba(180,140,60,0.2)`,padding:"12px 12px",background:"#fff"}}>
                      <div style={{display:"flex",gap:10}}>
                        <RankColumn cat={cat} player="G" order={gO} onInsert={handleInsert} onRemove={handleRemove} winner={wId}/>
                        <div style={{width:1,background:`linear-gradient(180deg,transparent,${GOLD}44,transparent)`,flexShrink:0}}/>
                        <RankColumn cat={cat} player="D" order={dO} onInsert={handleInsert} onRemove={handleRemove} winner={wId}/>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* DIFERENCIAS */}
        {tab==="difs"&&CATS.map(cat=>{
          const gO=ranks.G[cat.id]||[], dO=ranks.D[cat.id]||[];
          const same=JSON.stringify(gO)===JSON.stringify(dO);
          const wId=winners[cat.id], wNom=wId?cat.nominees.find(n=>n.id===wId):null;
          return (
            <div key={cat.id} style={{marginBottom:6,borderRadius:6,background:BG2,
              border:same?"1px solid rgba(80,160,80,0.2)":"1px solid rgba(180,120,40,0.2)",padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span>{cat.emoji}</span>
                <span style={{fontWeight:700,fontSize:14,flex:1,color:"#3a2a10"}}>{cat.label}</span>
                {same&&gO.length>0&&<span style={{fontSize:10,color:"#507840",border:"1px solid rgba(80,160,80,0.3)",padding:"1px 7px",borderRadius:3,letterSpacing:1}}>ACUERDO</span>}
                {!same&&<span style={{fontSize:10,color:"#886030",border:"1px solid rgba(180,120,40,0.3)",padding:"1px 7px",borderRadius:3,letterSpacing:1}}>DIFIEREN</span>}
                {wNom&&<span style={{fontSize:11,color:"#8a7020",fontWeight:700}}>🏆 {wNom.name}</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {["G","D"].map(p=>{
                  const o=p==="G"?gO:dO;
                  return (
                    <div key={p}>
                      <div style={{fontSize:12,fontWeight:700,color:PC[p],marginBottom:5,letterSpacing:1}}>{PN[p]}</div>
                      {o.length===0&&<div style={{fontSize:12,color:"rgba(100,80,40,0.3)",fontStyle:"italic"}}>Sin rankear</div>}
                      {o.map((id,i)=>{
                        const n=cat.nominees.find(nm=>nm.id===id);
                        if(!n) return null;
                        const isW=wId===id;
                        return (
                          <div key={id} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:4}}>
                            <span style={{fontSize:12,fontWeight:700,color:i===0?PC[p]:"rgba(100,80,40,0.3)",minWidth:20}}>{i+1}.</span>
                            <div>
                              <div style={{fontSize:13,color:isW?"#8a7020":i===0?"#3a2a10":"rgba(80,60,30,0.6)",fontWeight:i===0?600:400}}>
                                {n.name}{n.nv?" 📺":""}{isW?" 🏆":""}
                              </div>
                              {n.film&&<div style={{fontSize:10,color:"rgba(100,80,40,0.45)"}}>{n.film}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* GALA */}
        {tab==="resultados"&&CATS.map(cat=>{
          const w=winners[cat.id], wNom=w?cat.nominees.find(n=>n.id===w):null;
          return (
            <div key={cat.id} style={{marginBottom:8,borderRadius:6,background:BG2,
              border:w?`2px solid ${GOLD}66`:"1px solid rgba(180,140,60,0.15)",overflow:"hidden"}}>
              <div style={{padding:"10px 16px",display:"flex",gap:8,alignItems:"center",borderBottom:w?`1px solid ${GOLD}33`:"none"}}>
                <span style={{fontSize:18}}>{cat.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#3a2a10"}}>{cat.label}</div>
                  {wNom&&<div style={{fontSize:13,color:"#8a7020",fontStyle:"italic",marginTop:2}}>🏆 {wNom.name}{wNom.film?` · ${wNom.film}`:""}</div>}
                </div>
              </div>
              {w&&(
                <div style={{padding:"8px 16px 10px",display:"flex",gap:20,flexWrap:"wrap",background:"rgba(200,165,80,0.06)"}}>
                  {["G","D"].map(p=>{
                    const pos=(ranks[p][cat.id]||[]).indexOf(w), r=pos>=0?pos+1:null;
                    return (
                      <div key={p} style={{fontSize:13}}>
                        <span style={{color:PC[p],fontWeight:700}}>{PN[p]}: </span>
                        {r?<span style={{color:"#4a3820"}}>posición #{r} → <b style={{color:pts(r)>=4?"#8a7020":pts(r)>=2?"#a06020":"#b05040"}}>{pts(r)} pts</b></span>
                          :<span style={{color:"rgba(100,80,40,0.4)"}}>sin rankear → 0 pts</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{padding:"10px 16px 12px",display:"flex",flexWrap:"wrap",gap:6}}>
                {cat.nominees.map(nom=>(
                  <button key={nom.id} onClick={()=>setWinner(cat.id,nom.id)} style={{
                    padding:"7px 12px",borderRadius:4,border:"none",cursor:"pointer",
                    background:w===nom.id?`${GOLD}33`:"rgba(0,0,0,0.06)",
                    color:w===nom.id?"#7a6010":"rgba(80,60,30,0.7)",
                    outline:w===nom.id?`2px solid ${GOLD}88`:"none",
                    fontFamily:"Georgia,serif",fontSize:12,fontWeight:w===nom.id?700:400,
                    transition:"all .15s",textAlign:"left"
                  }}>
                    <div>{nom.name}{w===nom.id?" ✓":""}</div>
                    {nom.film&&<div style={{fontSize:10,opacity:.6}}>{nom.film}</div>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* PODIO */}
        {tab==="podio"&&(revCats.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px",color:"rgba(100,80,40,0.4)"}}>
            <div style={{fontSize:48,marginBottom:16}}>🎬</div>
            <div style={{fontSize:14,letterSpacing:2,fontStyle:"italic"}}>El podio se revelará durante la gala</div>
            <div style={{fontSize:12,marginTop:8,opacity:.6}}>28 de febrero · Barcelona</div>
          </div>
        ):(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {["G","D"].map(p=>{
                const max=revCats.length*5, pct=max>0?Math.round(score[p]/max*100):0;
                const lead=score[p]>score[p==="G"?"D":"G"];
                return (
                  <div key={p} style={{borderRadius:6,padding:"20px 16px",textAlign:"center",
                    background:lead?`${PC[p]}18`:"rgba(0,0,0,0.04)",
                    border:lead?`2px solid ${PC[p]}66`:"1px solid rgba(180,140,60,0.2)"}}>
                    {lead&&<div style={{fontSize:11,color:GOLD,letterSpacing:2,marginBottom:6}}>👑 LÍDER</div>}
                    <div style={{fontSize:42,fontWeight:700,color:lead?PC[p]:GOLD,lineHeight:1}}>{score[p]}</div>
                    <div style={{fontSize:11,color:"rgba(100,80,40,0.5)",letterSpacing:2,margin:"4px 0"}}>PUNTOS</div>
                    <div style={{fontSize:15,letterSpacing:1,color:"#3a2a10",fontWeight:700,marginTop:4}}>{PN[p]}</div>
                    <div style={{fontSize:12,color:PC[p],marginTop:6}}>{pct}% eficiencia</div>
                  </div>
                );
              })}
            </div>
            <div style={{background:BG2,border:`1px solid rgba(180,140,60,0.2)`,borderRadius:6,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
              {[1,2,3,4,5].map(r=>(
                <span key={r} style={{fontSize:12,color:"rgba(100,80,40,0.6)"}}>
                  #{r} → <b style={{color:pts(r)>=4?"#8a7020":pts(r)>=3?"#a06020":"rgba(100,80,40,0.4)"}}>{pts(r)}pts</b>
                </span>
              ))}
              <span style={{fontSize:12,color:"rgba(100,80,40,0.3)"}}>sin rankear → 0pts</span>
            </div>
            {revCats.map(cat=>{
              const wId=winners[cat.id], wNom=cat.nominees.find(n=>n.id===wId);
              return (
                <div key={cat.id} style={{display:"grid",gridTemplateColumns:"1fr 85px 85px",alignItems:"center",gap:10,
                  padding:"10px 14px",marginBottom:5,background:BG2,borderRadius:6,border:"1px solid rgba(180,140,60,0.15)"}}>
                  <div>
                    <div style={{fontSize:10,color:"rgba(100,80,40,0.45)",letterSpacing:1,textTransform:"uppercase"}}>{cat.label}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#8a7020",marginTop:2}}>🏆 {wNom?.name}</div>
                    {wNom?.film&&<div style={{fontSize:10,color:"rgba(100,80,40,0.5)"}}>{wNom.film}</div>}
                  </div>
                  {["G","D"].map(p=>{
                    const pos=(ranks[p][cat.id]||[]).indexOf(wId), r=pos>=0?pos+1:null, pt=pts(r);
                    return (
                      <div key={p} style={{textAlign:"center"}}>
                        <div style={{fontSize:11,color:PC[p],fontWeight:700,marginBottom:2}}>{PN[p]}</div>
                        <div style={{fontSize:14,fontWeight:700,color:pt>=4?"#8a7020":pt>=3?"#a06020":pt>=2?"rgba(80,60,30,0.6)":"#b05040"}}>
                          {r?`#${r}`:"—"}
                        </div>
                        <div style={{fontSize:11,color:pt>=4?"#8a7020":pt>=3?"#a06020":"rgba(100,80,40,0.4)"}}>{pt}pts</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

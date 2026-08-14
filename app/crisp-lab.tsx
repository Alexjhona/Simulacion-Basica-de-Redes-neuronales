"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

type ModelId = "rn" | "rf" | "cnn";

const models = {
  rn: { short: "RN", title: "Red neuronal", subtitle: "Reconoce un dígito dibujado", accent: "#ef6b4a" },
  rf: { short: "RF", title: "Random Forest", subtitle: "Estima riesgo de fuga de clientes", accent: "#297a70" },
  cnn: { short: "CNN", title: "Red convolucional", subtitle: "Clasifica una imagen de animal", accent: "#6f5bb8" },
} as const;

const stages = [
  ["01", "Negocio", "Definir el problema y el KPI"],
  ["02", "Datos", "Recolectar, perfilar y validar"],
  ["03", "Preparación", "Limpiar sin contaminar"],
  ["04", "Modelado", "Entrenar y ajustar"],
  ["05", "Evaluación", "Medir con datos no vistos"],
  ["06", "Despliegue", "API, monitoreo y BI"],
];

const phaseLabels = ["Entrada", "Preparación", "Modelo", "Predicción"];

const digitPatterns: Record<number, string[]> = {
  0: ["00111100","01100110","11000011","11000011","11000011","11000011","11000011","11000011","01100110","00111100"],
  1: ["00011000","00111000","01111000","00011000","00011000","00011000","00011000","00011000","00011000","01111110"],
  2: ["00111100","01100110","11000011","00000011","00000110","00001100","00011000","00110000","01100000","11111111"],
  3: ["01111110","11000011","00000011","00000110","00011100","00000110","00000011","00000011","11000011","01111110"],
  4: ["00000110","00001110","00011110","00110110","01100110","11000110","11111111","00000110","00000110","00000110"],
  5: ["11111111","11000000","11000000","11111110","11000011","00000011","00000011","00000011","11000110","01111100"],
  6: ["00111110","01100000","11000000","11000000","11111110","11000011","11000011","11000011","01100110","00111100"],
  7: ["11111111","00000011","00000110","00001100","00011000","00110000","00110000","00110000","00110000","00110000"],
  8: ["00111100","01100110","11000011","11000011","01100110","00111100","01100110","11000011","01100110","00111100"],
  9: ["00111100","01100110","11000011","11000011","01100111","00111111","00000011","00000110","00001100","01111000"],
};

function blankGrid() { return Array(120).fill(0); }

function patternGrid(n: number) {
  const result = blankGrid();
  digitPatterns[n].forEach((row, y) => row.split("").forEach((v, x) => {
    result[(y + 1) * 12 + x + 2] = Number(v);
  }));
  return result;
}

function recognizeDigit(grid: number[]) {
  const scores = Object.entries(digitPatterns).map(([n]) => {
    const template = patternGrid(Number(n));
    let diff = 0;
    for (let i = 0; i < grid.length; i++) diff += Math.abs(grid[i] - template[i]);
    return { n: Number(n), score: Math.max(0.02, 1 - diff / 54) };
  }).sort((a, b) => b.score - a.score);
  const total = scores.reduce((sum, item) => sum + Math.exp(item.score * 5), 0);
  return scores.slice(0, 3).map(item => ({ ...item, probability: Math.exp(item.score * 5) / total }));
}

export function CrispLab() {
  const [model, setModel] = useState<ModelId>("rn");
  const [phase, setPhase] = useState(0);
  const [grid, setGrid] = useState<number[]>(() => patternGrid(7));
  const [drawing, setDrawing] = useState(false);
  const [tenure, setTenure] = useState(9);
  const [usage, setUsage] = useState(38);
  const [tickets, setTickets] = useState(4);
  const [spend, setSpend] = useState(119);
  const [animal, setAnimal] = useState("gato");
  const [preview, setPreview] = useState<string | null>(null);
  const [leak, setLeak] = useState(false);
  const [apiResult, setApiResult] = useState("Listo para probar");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const digitResult = useMemo(() => recognizeDigit(grid), [grid]);
  const churn = Math.min(96, Math.max(4, Math.round(20 + tickets * 8 + (40 - usage) * .75 + (18 - tenure) * .9 - spend * .08)));
  const treeVotes = [
    tenure < 12 || tickets > 3,
    usage < 45,
    tickets > 2 && spend > 80,
    tenure < 6,
    usage < 55 && tickets > 4,
  ];
  const animalScores = animal === "gato" ? [82, 12, 6] : animal === "perro" ? [9, 86, 5] : [7, 8, 85];

  function switchModel(next: ModelId) {
    setModel(next); setPhase(0);
    document.getElementById("laboratorio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function runPipeline() {
    if (timer.current) clearInterval(timer.current);
    setPhase(0);
    let value = 0;
    timer.current = setInterval(() => {
      value += 1;
      setPhase(value);
      if (value === 3 && timer.current) clearInterval(timer.current);
    }, 680);
  }

  function paint(index: number) {
    if (!drawing) return;
    setGrid(current => current.map((v, i) => i === index ? 1 : v));
  }

  function loadFile(file?: File) {
    if (!file) return;
    const name = file.name.toLowerCase();
    setAnimal(name.includes("dog") || name.includes("perro") ? "perro" : name.includes("bird") || name.includes("ave") ? "ave" : "gato");
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
    setPhase(0);
  }

  async function testApi() {
    setApiResult("Consultando…");
    try {
      const response = await fetch("/api/predict", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model: "rf", features: { tenure, usage, tickets, spend } }) });
      const data = await response.json();
      setApiResult(`${data.prediction}: ${Math.round(data.confidence * 100)}%`);
    } catch { setApiResult("No se pudo conectar"); }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="NexoLab inicio"><span className="brand-mark">N</span><span>Nexo<strong>Lab</strong></span></a>
        <nav aria-label="Navegación principal">
          <a href="#metodologia">Metodología</a><a href="#laboratorio">Laboratorio</a><a href="#gobierno">Gobierno</a><a href="#api">API / Swagger</a>
        </nav>
        <a className="outline-button compact" href="#laboratorio">Abrir laboratorio <span>↗</span></a>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span></span> MINERÍA DE DATOS × BUSINESS INTELLIGENCE</div>
          <h1>Del dato a la<br/><em>decisión.</em></h1>
          <p>Un laboratorio visual para comprender cómo aprende un modelo, cómo se evalúa sin fuga de datos y cómo llega a una decisión de negocio.</p>
          <div className="hero-actions"><a className="primary-button" href="#laboratorio">Explorar modelos <span>→</span></a><a className="text-link" href="#metodologia">Ver metodología <span>↓</span></a></div>
          <div className="hero-proof"><span className="proof-icon">✓</span><p><strong>Aprende haciendo</strong><br/>Modifica una entrada y observa cada fase.</p></div>
        </div>
        <div className="hero-visual" aria-label="Vista previa del pipeline">
          <div className="hero-stamp">CRISP<br/>DM</div>
          <div className="pipeline-window">
            <div className="window-bar"><span></span><span></span><span></span><small>pipeline_ventas_v3</small><b>EN LÍNEA</b></div>
            <div className="mini-pipeline">
              <div className="mini-step done"><i>✓</i><div><small>01 · INGESTA</small><strong>24,680 registros</strong><span>Fuentes reales + sintéticas</span></div></div>
              <div className="connector"></div>
              <div className="mini-step active"><i>⌁</i><div><small>02 · PREPARACIÓN</small><strong>Validando calidad</strong><span className="mini-progress"><b></b></span></div></div>
              <div className="connector"></div>
              <div className="mini-step"><i>◇</i><div><small>03 · MODELO</small><strong>Random Forest</strong><span>5-fold cross-validation</span></div></div>
            </div>
            <div className="metric-strip"><div><small>ACCURACY</small><strong>91.4%</strong><span>+3.2%</span></div><div><small>F1-SCORE</small><strong>0.89</strong><span>estable</span></div><div><small>DATA LEAK</small><strong className="safe">0</strong><span>controlado</span></div></div>
          </div>
          <span className="float-tag tag-one">TRAIN ≠ TEST</span><span className="float-tag tag-two">API READY</span>
        </div>
      </section>

      <section className="trust-row"><span>FLUJO COMPLETO</span><b>CRISP-DM</b><i></i><b>DATOS REALES + SINTÉTICOS</b><i></i><b>SIN FUGA DE DATOS</b><i></i><b>API DOCUMENTADA</b></section>

      <section id="metodologia" className="method section-wrap">
        <div className="section-heading"><div><div className="eyebrow"><span></span> METODOLOGÍA</div><h2>CRISP-DM, sin saltos.</h2></div><p>Cada experimento sigue el mismo ciclo reproducible. El tablero de BI es la última vista; la trazabilidad comienza mucho antes.</p></div>
        <div className="stage-grid">
          {stages.map((s, index) => <article key={s[0]}><div className="stage-top"><span>{s[0]}</span><i>{index === 5 ? "↗" : "→"}</i></div><h3>{s[1]}</h3><p>{s[2]}</p></article>)}
        </div>
      </section>

      <section id="laboratorio" className="lab-section">
        <div className="section-wrap">
          <div className="section-heading light"><div><div className="eyebrow"><span></span> LABORATORIO INTERACTIVO</div><h2>Tres modelos. Un mismo rigor.</h2></div><p>Selecciona un modelo, modifica la entrada y recorre el proceso. Las métricas de demostración están separadas de un entrenamiento productivo.</p></div>
          <div className="model-tabs" role="tablist">
            {(Object.keys(models) as ModelId[]).map(id => <button key={id} role="tab" aria-selected={model === id} className={model === id ? "selected" : ""} onClick={() => switchModel(id)}><span style={{background: models[id].accent}}>{models[id].short}</span><div><strong>{models[id].title}</strong><small>{models[id].subtitle}</small></div><i>→</i></button>)}
          </div>

          <div className="workbench" style={{"--model-accent": models[model].accent} as React.CSSProperties}>
            <div className="workbench-head"><div><span>{models[model].short}</span><p><small>MODELO ACTIVO</small><strong>{models[model].title}</strong></p></div><div className="phase-nav">{phaseLabels.map((label, i) => <button className={phase === i ? "active" : phase > i ? "done" : ""} onClick={() => setPhase(i)} key={label}><span>{phase > i ? "✓" : i + 1}</span>{label}</button>)}</div></div>

            <div className="workbench-body">
              <div className="input-panel">
                {model === "rn" && <>
                  <div className="panel-title"><div><small>ENTRADA</small><h3>Dibuja un número</h3></div><button onClick={() => setGrid(blankGrid())}>Limpiar</button></div>
                  <p className="hint">Arrastra sobre la cuadrícula. Prueba con una forma imperfecta.</p>
                  <div className="digit-grid" onPointerDown={() => setDrawing(true)} onPointerUp={() => setDrawing(false)} onPointerLeave={() => setDrawing(false)}>{grid.map((on, i) => <button aria-label={`Píxel ${i + 1}`} key={i} className={on ? "on" : ""} onPointerEnter={() => paint(i)} onPointerDown={() => { setDrawing(true); setGrid(g => g.map((v, j) => j === i ? 1 : v)); }} />)}</div>
                  <div className="presets"><span>Ejemplos:</span>{[2,4,7,8].map(n => <button key={n} onClick={() => setGrid(patternGrid(n))}>{n}</button>)}</div>
                </>}
                {model === "rf" && <>
                  <div className="panel-title"><div><small>ENTRADA</small><h3>Perfil del cliente</h3></div><span className="record-id">ID #C-1842</span></div>
                  <Slider label="Antigüedad" value={tenure} setValue={setTenure} min={1} max={48} unit="meses" />
                  <Slider label="Uso mensual" value={usage} setValue={setUsage} min={5} max={100} unit="%" />
                  <Slider label="Tickets soporte" value={tickets} setValue={setTickets} min={0} max={10} unit="" />
                  <Slider label="Gasto mensual" value={spend} setValue={setSpend} min={20} max={250} unit="S/" prefix />
                </>}
                {model === "cnn" && <>
                  <div className="panel-title"><div><small>ENTRADA</small><h3>Imagen de animal</h3></div></div>
                  <label className="upload-zone" onDragOver={(e: DragEvent) => e.preventDefault()} onDrop={(e: DragEvent) => {e.preventDefault(); loadFile(e.dataTransfer.files[0]);}}>
                    <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0])}/>
                    {preview ? <img src={preview} alt="Imagen cargada"/> : <><span>↥</span><strong>Suelta una imagen aquí</strong><small>JPG o PNG · máx. 5 MB</small></>}
                  </label>
                  <div className="animal-samples">{[["gato","🐈"],["perro","🐕"],["ave","🦜"]].map(([name, icon]) => <button className={animal === name && !preview ? "chosen" : ""} key={name} onClick={() => {setAnimal(name);setPreview(null)}}><span>{icon}</span>{name}</button>)}</div>
                </>}
                <button className="run-button" onClick={runPipeline}>Ejecutar pipeline <span>▶</span></button>
              </div>

              <div className="process-panel">
                <div className="process-label"><span>FASE {String(phase + 1).padStart(2,"0")}</span><b>{phaseLabels[phase]}</b><small>{phase === 0 ? "Dato crudo" : phase === 1 ? "Transformación sin fuga" : phase === 2 ? "Inferencia interna" : "Resultado + confianza"}</small></div>
                {model === "rn" && <NeuralView phase={phase} active={grid.filter(Boolean).length} result={digitResult[0].n} />}
                {model === "rf" && <ForestView phase={phase} votes={treeVotes} />}
                {model === "cnn" && <ConvView phase={phase} animal={animal} />}
              </div>

              <div className="result-panel">
                <small>RESULTADO</small>
                {model === "rn" && <><div className="big-result">{digitResult[0].n}</div><h3>{Math.round(digitResult[0].probability * 100)}% confianza</h3><div className="score-list">{digitResult.map(r => <div key={r.n}><span>{r.n}</span><i><b style={{width: `${Math.round(r.probability * 100)}%`}}></b></i><em>{Math.round(r.probability * 100)}%</em></div>)}</div></>}
                {model === "rf" && <><div className={`risk-ring ${churn > 60 ? "high" : ""}`} style={{"--risk": `${churn * 3.6}deg`} as React.CSSProperties}><strong>{churn}%</strong><span>RIESGO</span></div><h3>{churn > 60 ? "Intervención prioritaria" : churn > 35 ? "Seguimiento recomendado" : "Cliente estable"}</h3><p className="result-note">{treeVotes.filter(Boolean).length} de 5 árboles votan “abandona”.</p></>}
                {model === "cnn" && <><div className="animal-result">{animal === "gato" ? "🐈" : animal === "perro" ? "🐕" : "🦜"}</div><h3>{animal[0].toUpperCase() + animal.slice(1)}</h3><div className="score-list">{["gato","perro","ave"].map((a,i) => <div key={a}><span>{a}</span><i><b style={{width: `${animalScores[i]}%`}}></b></i><em>{animalScores[i]}%</em></div>)}</div></>}
                <div className="model-note"><span>ⓘ</span><p><strong>Demo educativa</strong>Resultado ilustrativo con pesos de muestra; no sustituye la validación productiva.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gobierno" className="governance section-wrap">
        <div className="section-heading"><div><div className="eyebrow"><span></span> EVALUACIÓN Y GOBIERNO</div><h2>Una métrica alta no basta.</h2></div><p>El modelo recomendado es el que equilibra desempeño, explicabilidad, costo y riesgo para el caso de negocio.</p></div>
        <div className="governance-grid">
          <article className="split-card"><div className="card-head"><span>01</span><h3>Partición correcta</h3></div><div className="split-visual"><div className="train">70%<small>ENTRENAMIENTO</small></div><div className="valid">15%<small>VALIDACIÓN</small></div><div className="test">15%<small>PRUEBA</small></div></div><p>El conjunto de prueba queda aislado hasta la evaluación final. En series temporales, se separa por fecha.</p></article>
          <article className={`leak-card ${leak ? "warning" : ""}`}><div className="card-head"><span>02</span><h3>Detector de fuga</h3><button className="toggle" onClick={() => setLeak(!leak)} aria-pressed={leak}><i></i></button></div><div className="leak-status"><b>{leak ? "⚠" : "✓"}</b><div><strong>{leak ? "Riesgo detectado" : "Sin señales de fuga"}</strong><span>{leak ? "Se normalizó antes de dividir los datos." : "Pipeline ajustado solo con train."}</span></div></div><button className="leak-demo" onClick={() => setLeak(!leak)}>Simular {leak ? "corrección" : "fuga"} <span>→</span></button></article>
          <article className="criteria-card"><div className="card-head"><span>03</span><h3>Selección del modelo</h3></div><div className="criteria"><div><span>F1 / Recall</span><b>35%</b></div><div><span>Explicabilidad</span><b>30%</b></div><div><span>Latencia / costo</span><b>20%</b></div><div><span>Estabilidad</span><b>15%</b></div></div><p>La ponderación se define con negocio antes de comparar modelos.</p></article>
        </div>
      </section>

      <section id="api" className="api-section">
        <div className="section-wrap api-grid"><div><div className="eyebrow"><span></span> API / SWAGGER</div><h2>Del notebook a una API controlada.</h2><p>El contrato OpenAPI documenta entradas, salidas y versión. Prueba aquí mismo la inferencia sin salir de esta página.</p><div className="api-actions"><button className="primary-button pale" onClick={testApi}>Probar endpoint <span>▶</span></button><a href="/openapi.json">Ver OpenAPI JSON ↗</a><output>{apiResult}</output></div></div><div className="code-card"><div className="code-head"><span>POST</span><b>/api/predict</b><small>v1.0</small></div><pre><code>{`{\n  "model": "rf",\n  "features": {\n    "tenure": ${tenure},\n    "usage": ${usage},\n    "tickets": ${tickets},\n    "spend": ${spend}\n  }\n}`}</code></pre><div className="code-foot"><span>200 OK</span><b>application/json</b></div></div></div>
      </section>

      <footer><div className="brand"><span className="brand-mark">N</span><span>Nexo<strong>Lab</strong></span></div><p>Proyecto académico · Minería de Datos &amp; Business Intelligence</p><div><a href="#metodologia">Metodología</a><a href="#api">API / Swagger</a><a href="/openapi.json">OpenAPI JSON</a></div></footer>
    </main>
  );
}

function Slider({label,value,setValue,min,max,unit,prefix=false}:{label:string,value:number,setValue:(n:number)=>void,min:number,max:number,unit:string,prefix?:boolean}) {
  return <label className="slider-row"><span>{label}<b>{prefix ? `${unit} ${value}` : `${value} ${unit}`}</b></span><input type="range" min={min} max={max} value={value} onChange={e => setValue(Number(e.target.value))}/></label>;
}

function NeuralView({phase,active,result}:{phase:number,active:number,result:number}) {
  const layers = [[1,1,1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1],[1,1,1]];
  return <div className={`neural-view phase-${phase}`}><div className="network">{layers.map((layer,li) => <div className="node-layer" key={li}>{layer.map((_,i) => <i key={i} style={{opacity: .25 + ((active+i*7+li*11)%10)/14}}></i>)}</div>)}</div><div className="network-caption"><span>{active} píxeles</span><span>64 activaciones</span><span>32 patrones</span><span>clase {result}</span></div></div>;
}

function ForestView({phase,votes}:{phase:number,votes:boolean[]}) {
  return <div className={`forest-view phase-${phase}`}><div className="tree-row">{votes.map((vote,i) => <div className="tree" key={i}><i></i><span>Árbol {i+1}</span><b className={vote ? "leave" : "stay"}>{vote ? "SALE" : "SIGUE"}</b></div>)}</div><div className="vote-line"><span style={{width:`${votes.filter(Boolean).length*20}%`}}></span></div><small>Votación mayoritaria del bosque</small></div>;
}

function ConvView({phase,animal}:{phase:number,animal:string}) {
  return <div className={`conv-view phase-${phase}`}><div className="conv-source">{animal === "gato" ? "🐈" : animal === "perro" ? "🐕" : "🦜"}</div><span className="conv-arrow">→</span><div className="feature-stack">{Array.from({length:5}).map((_,i) => <i key={i} style={{transform:`translate(${i*5}px, ${-i*4}px)`,filter:`contrast(${1+i*.18})`}}></i>)}</div><span className="conv-arrow">→</span><div className="dense-stack"><i></i><i></i><i></i><i></i><i></i></div><div className="conv-labels"><span>Imagen</span><span>Mapas de rasgos</span><span>Clasificador</span></div></div>;
}

import * as Tone from "tone";

// Store references to Tone.js objects
let piano: Tone.Synth | null = null;
let bass: Tone.MonoSynth | null = null;
let drums: Tone.MembraneSynth | null = null;
let playing = false;
let interval: any | null = null;

const audioContext = Tone.getContext().rawContext as AudioContext;
const gainNode = audioContext.createGain();
const analyser = audioContext.createAnalyser();
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Connect the GainNode to the analyzer
gainNode.connect(analyser);
Tone.getDestination().connect(gainNode);

// Configure the analyzer
analyser.fftSize = 2048; // Set desired resolution

function visualizeAudio() {
  function draw() {
    analyser.getByteTimeDomainData(dataArray);

    // Optional: Reduce data size for messages
    const normalizedData = Array.from(dataArray).map((value) => value / 128 - 1);

    // Send data periodically
    chrome.runtime.sendMessage({
      action: "updateProgress",
      waveform: normalizedData,
      bufferLength
    });
  }

  draw();
}

interface SoundType {
  pitch: string[];
  bassNote: string;
  drumPattern: string;
  duration: string;
  volume: number;
};

let domData: any[] = [];
let sounds: SoundType[] = [];

function notifyExtensionWhenReady() {
  // Check if the DOM is fully loaded
  if (document.readyState === "complete") {
      // DOM is already loaded; send the loaded message
      sendLoadedMessage();
  } else {
      // Wait for the DOM to finish loading
      window.addEventListener("load", () => {
          sendLoadedMessage();
      });
  }
}

notifyExtensionWhenReady();

function sendLoadedMessage() {
  domData = traverseDOM(document.body);
  sounds = mapToSound(domData);

  chrome.runtime.sendMessage({
      action: 'loaded'
  });
}

// Traverse the DOM and collect element data
function traverseDOM(node: HTMLElement, depth: number = 0): any[] {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return [];

  const tag = node.tagName.toLowerCase();
  const children = Array.from(node.children) as HTMLElement[];
  const data = [{ tag, depth, childrenCount: children.length }];

  for (let child of children) {
    data.push(...traverseDOM(child, depth + 1));
  }

  return data;
}

function mapToSound(domData: any[]) {
  return domData.map(({ tag, depth, childrenCount }) => {
    const pitch = getPitch(tag, depth);
    const bassNote = getBass(tag);
    const drumPattern = getDrum(tag);
    const duration = getDuration(childrenCount);
    const volume = getVolume(depth);
    return { pitch, bassNote, drumPattern, duration, volume };
  });
}

function getPitch(tag: string, depth: number): string[] {
  const scale = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
  const basePitch = scale[depth % scale.length];
  const harmonies: Record<string, string[]> = {
    div: [basePitch],
    span: [basePitch, `${basePitch.slice(0, -1)}3`],
    button: [`${basePitch.slice(0, -1)}5`, basePitch],
    img: [`${basePitch.slice(0, -1)}4`],
    p: [`${basePitch.slice(0, -1)}3`],
    h1: [basePitch, `${basePitch.slice(0, -1)}4`],
    h2: [basePitch],
    h3: [`${basePitch.slice(0, -1)}2`],
    ul: [basePitch, `${basePitch.slice(0, -1)}3`],
    ol: [`${basePitch.slice(0, -1)}3`, `${basePitch.slice(0, -1)}2`],
    li: [basePitch],
    a: [`${basePitch.slice(0, -1)}4`],
    input: [`${basePitch.slice(0, -1)}5`],
    textarea: ["E5"],
    form: ["G3"],
    header: ["A3", "C4"],
    footer: ["F3"],
    main: ["D4"],
    nav: ["C4"],
    section: ["G4", "A4"],
    article: ["B4", "D4"],
    aside: ["E3", "G3"],
    iframe: ["C3", "F3"],
    video: ["E2", "A2"],
    audio: ["G2", "B2"],
    canvas: ["C3", "D3"],
    svg: ["F4", "G4"],
  };
  return harmonies[tag] || [basePitch];
}

function getDuration(tag: string): string {
  const durationMap: Record<string, string> = {
    div: "4n",
    span: "8n",
    button: "16n",
    img: "2n",
    p: "4n",
    h1: "8n",
    h2: "16n",
    h3: "2n",
    ul: "8n",
    ol: "16n",
    li: "4n",
    a: "8n",
    input: "16n",
    textarea: "2n",
    form: "4n",
    header: "8n",
    footer: "16n",
    main: "4n",
    nav: "8n",
    section: "16n",
    article: "2n",
    aside: "8n",
    iframe: "4n",
    video: "8n",
    audio: "16n",
    canvas: "2n",
    svg: "4n",
  };
  return durationMap[tag] || "8n";
}

function getBass(tag: string): string {
  const bassMap: Record<string, string> = {
    div: "C2",
    span: "D2",
    button: "E2",
    img: "F2",
    p: "G2",
    h1: "A2",
    h2: "B2",
    h3: "C3",
    ul: "D2",
    ol: "E2",
    li: "F2",
    a: "G2",
    input: "A2",
    textarea: "D2",
    form: "C3",
    header: "F2",
    footer: "E2",
    main: "G2",
    nav: "A2",
    section: "B2",
    article: "C2",
    aside: "D3",
    iframe: "E3",
    video: "F3",
    audio: "G3",
    canvas: "A3",
    svg: "B3",
  };
  return bassMap[tag] || "C2";
}

function getDrum(tag: string): string {
  const drumMap: Record<string, string> = {
    div: "kick",
    span: "snare",
    button: "hihat",
    img: "kick",
    p: "snare",
    h1: "hihat",
    h2: "kick",
    h3: "snare",
    ul: "hihat",
    ol: "kick",
    li: "snare",
    a: "hihat",
    input: "kick",
    textarea: "snare",
    form: "kick",
    header: "hihat",
    footer: "kick",
    main: "snare",
    nav: "hihat",
    section: "kick",
    article: "snare",
    aside: "hihat",
    iframe: "kick",
    video: "snare",
    audio: "hihat",
    canvas: "kick",
    svg: "snare",
  };
  return drumMap[tag];
}

function getVolume(depth: number): number {
  return -depth * 2; // Make the volume change less dramatic
}

async function playSymphony() {
  if (playing) return; // Prevent multiple play calls
  await Tone.start();
  playing = true;

  // Initialize instruments
  if (!piano || !bass || !drums) {
    piano = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.1 },
    }).toDestination();

    bass = new Tone.MonoSynth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.8 },
    }).toDestination();

    drums = new Tone.MembraneSynth().toDestination();
  }

  const now = Tone.now();

  sounds.forEach(({ pitch, bassNote, drumPattern, duration, volume }, i) => {

    piano!.volume.value = volume - 10;
    bass!.volume.value = volume - 20;
    drums!.volume.value = volume - 15;

    // Play piano melody
    pitch.forEach((note) => {
      piano!.triggerAttackRelease(note, getDuration(note), now + i * 0.2); // Faster sequence
    });

    // Play bass notes
    bass!.triggerAttackRelease(bassNote, "8n", now + i * 0.2);

    // Play drum pattern
    if (drumPattern === "kick") {
      drums!.triggerAttackRelease("C2", "16n", now + i * 0.2);
    } else if (drumPattern === "snare") {
      drums!.triggerAttackRelease("D2", "16n", now + i * 0.2);
    } else if (drumPattern === "hihat") {
      drums!.triggerAttackRelease("F#2", "16n", now + i * 0.2);
    }
  });

  interval = setInterval(visualizeAudio, 500);

  setTimeout(() => {
    stopSymphony();
  }, sounds.length * 300);
}

function stopSymphony() {
  clearInterval(interval);
  if (piano) {
    piano.dispose();
    piano = null;
  }
  if (bass) {
    bass.dispose();
    bass = null;
  }
  if (drums) {
    drums.dispose();
    drums = null;
  }
  playing = false;
  console.log("Symphony stopped");
}

// Listen for play/pause messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "play") {
    playSymphony();
  } else if (message.action === "pause") {
    stopSymphony();
  } else if (message.action === "isLoaded") {
    notifyExtensionWhenReady();
  }
  sendResponse({ status: "done" });
});

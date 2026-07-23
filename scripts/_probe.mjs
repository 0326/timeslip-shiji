import { Compiler } from "inkjs/full";
import { readFileSync } from "node:fs";
const f = process.argv[2];
const src = readFileSync("src/react-app/data/stories/ink/"+f, "utf8");
let story;
try { story = new Compiler(src).Compile(); } catch(e){ console.log("COMPILE FAIL", f); process.exit(0); }
const survivals=new Set(), deaths=new Set(), unnamed=[];
function play(depth){
  if(depth>60) throw new Error("deep");
  let ending=null, death=null, lastText="";
  while(story.canContinue){
    const t=story.Continue(); if(t&&t.trim())lastText=t.trim();
    for(const tag of story.currentTags||[]){const i=tag.indexOf(":");const k=i<0?tag:tag.slice(0,i);const v=i<0?"":tag.slice(i+1);if(k==="death")death=v||"default";else if(k==="ending")ending=v;}
  }
  const ch=story.currentChoices;
  if(!ch||ch.length===0){ if(death)deaths.add(death); else if(ending)survivals.add(ending); else {survivals.add("(unnamed)"+lastText.slice(0,16));unnamed.push(lastText.slice(0,30));} return; }
  const save=story.state.ToJson();
  for(let i=0;i<ch.length;i++){ story.state.LoadJson(save); story.ChooseChoiceIndex(i); play(depth+1); }
}
try{ play(0); }catch(e){ console.log("WALK ERR",f,e.message); process.exit(0); }
console.log(f,"| survivals:",[...survivals].join(", ")||"(none)","| deaths:",deaths.size,"| unnamed:",unnamed.length);

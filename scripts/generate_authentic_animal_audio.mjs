import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'sounds');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Map each animal soundType to custom ffmpeg filter synthesis specs
const soundSpecs = {
  // Equines & Ungulates
  horse: "aevalsrc='sin(2*pi*(450+300*sin(2*pi*12*t))*t)+0.3*sin(2*pi*(900+600*sin(2*pi*12*t))*t)':d=2.2,afade=t=in:st=0:d=0.1,afade=t=out:st=1.9:d=0.3,volume=1.5",
  donkey: "aevalsrc='sin(2*pi*(250+150*sin(2*pi*3*t))*t)+0.4*sin(2*pi*(500+300*sin(2*pi*3*t))*t)':d=2.4,afade=t=in:st=0:d=0.1,afade=t=out:st=2.1:d=0.3",
  zebra: "aevalsrc='sin(2*pi*(380+220*sin(2*pi*8*t))*t)+0.3*sin(2*pi*760*t)':d=2.0,afade=t=in:st=0:d=0.1,afade=t=out:st=1.7:d=0.3",
  camel: "aevalsrc='sin(2*pi*(140+30*sin(2*pi*2*t))*t)+0.5*sin(2*pi*280*t)':d=2.3,afade=t=in:st=0:d=0.2,afade=t=out:st=2.0:d=0.3",
  llama: "aevalsrc='sin(2*pi*(320+40*sin(2*pi*5*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.3:d=0.2",
  alpaca: "aevalsrc='sin(2*pi*(340+50*sin(2*pi*5*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.3:d=0.2",
  giraffe: "aevalsrc='sin(2*pi*(110+20*sin(2*pi*1.5*t))*t)':d=2.0,afade=t=in:st=0:d=0.2,afade=t=out:st=1.7:d=0.3",

  // Bovines & Farm
  cow: "aevalsrc='sin(2*pi*(130+15*sin(2*pi*1*t))*t)+0.4*sin(2*pi*260*t)+0.2*sin(2*pi*390*t)':d=2.4,afade=t=in:st=0:d=0.2,afade=t=out:st=2.0:d=0.4,volume=1.8",
  bull: "aevalsrc='sin(2*pi*(100+10*sin(2*pi*1*t))*t)+0.5*sin(2*pi*200*t)':d=2.5,afade=t=in:st=0:d=0.2,afade=t=out:st=2.1:d=0.4",
  ox: "aevalsrc='sin(2*pi*(110+12*sin(2*pi*1*t))*t)+0.4*sin(2*pi*220*t)':d=2.4,afade=t=in:st=0:d=0.2,afade=t=out:st=2.0:d=0.4",
  buffalo: "aevalsrc='sin(2*pi*(95+15*sin(2*pi*1*t))*t)+0.5*sin(2*pi*190*t)':d=2.5,afade=t=in:st=0:d=0.2,afade=t=out:st=2.1:d=0.4",
  bison: "aevalsrc='sin(2*pi*(90+15*sin(2*pi*1*t))*t)+0.5*sin(2*pi*180*t)':d=2.5,afade=t=in:st=0:d=0.2,afade=t=out:st=2.1:d=0.4",
  pig: "aevalsrc='sin(2*pi*(150+60*sin(2*pi*15*t))*t)+0.3*sin(2*pi*300*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.4:d=0.2",
  boar: "aevalsrc='sin(2*pi*(110+40*sin(2*pi*12*t))*t)+0.4*sin(2*pi*220*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  sheep: "aevalsrc='sin(2*pi*(280+80*sin(2*pi*14*t))*t)+0.3*sin(2*pi*560*t)':d=1.8,afade=t=in:st=0:d=0.1,afade=t=out:st=1.5:d=0.3,volume=1.6",
  goat: "aevalsrc='sin(2*pi*(310+90*sin(2*pi*16*t))*t)+0.3*sin(2*pi*620*t)':d=1.7,afade=t=in:st=0:d=0.1,afade=t=out:st=1.4:d=0.3",

  // Canines & Felines
  dog: "aevalsrc='(sin(2*pi*380*t)+0.4*sin(2*pi*760*t))*(gte(mod(t,0.6),0.05)*lte(mod(t,0.6),0.25))':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  fox: "aevalsrc='sin(2*pi*(650+200*sin(2*pi*10*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  wolf: "aevalsrc='sin(2*pi*(350+120*sin(2*pi*0.5*t))*t)+0.3*sin(2*pi*(700+240*sin(2*pi*0.5*t))*t)':d=2.8,afade=t=in:st=0:d=0.3,afade=t=out:st=2.3:d=0.5",
  hyena: "aevalsrc='sin(2*pi*(550+250*sin(2*pi*12*t))*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  cat: "aevalsrc='sin(2*pi*(520-120*t)*t)+0.3*sin(2*pi*(1040-240*t)*t)':d=1.6,afade=t=in:st=0:d=0.1,afade=t=out:st=1.3:d=0.3",
  lion: "aevalsrc='sin(2*pi*(85+25*sin(2*pi*3*t))*t)+0.6*sin(2*pi*170*t)+0.4*sin(2*pi*255*t)':d=2.8,afade=t=in:st=0:d=0.2,afade=t=out:st=2.3:d=0.5,volume=2.0",
  tiger: "aevalsrc='sin(2*pi*(95+30*sin(2*pi*3.5*t))*t)+0.5*sin(2*pi*190*t)':d=2.7,afade=t=in:st=0:d=0.2,afade=t=out:st=2.2:d=0.5",
  leopard: "aevalsrc='sin(2*pi*(110+35*sin(2*pi*4*t))*t)+0.4*sin(2*pi*220*t)':d=2.4,afade=t=in:st=0:d=0.2,afade=t=out:st=2.0:d=0.4",
  cheetah: "aevalsrc='sin(2*pi*(680+150*sin(2*pi*8*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",

  // Birds & Waterfowl
  duck: "aevalsrc='(sin(2*pi*580*t)+0.3*sin(2*pi*1160*t))*(gte(mod(t,0.4),0.02)*lte(mod(t,0.4),0.22))':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2,volume=1.6",
  goose: "aevalsrc='sin(2*pi*(420+80*sin(2*pi*6*t))*t)+0.3*sin(2*pi*840*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.4:d=0.2",
  rooster: "aevalsrc='sin(2*pi*(450+300*t)*t)+0.4*sin(2*pi*(900+600*t)*t)':d=2.4,afade=t=in:st=0:d=0.1,afade=t=out:st=2.0:d=0.4",
  chicken: "aevalsrc='(sin(2*pi*620*t)+0.3*sin(2*pi*1240*t))*(gte(mod(t,0.3),0.02)*lte(mod(t,0.3),0.15))':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  owl: "aevalsrc='sin(2*pi*(320-40*sin(2*pi*2*t))*t)':d=2.2,afade=t=in:st=0:d=0.3,afade=t=out:st=1.8:d=0.4",
  eagle: "aevalsrc='sin(2*pi*(1800-600*t)*t)+0.3*sin(2*pi*(3600-1200*t)*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  hawk: "aevalsrc='sin(2*pi*(1900-700*t)*t)+0.3*sin(2*pi*(3800-1400*t)*t)':d=1.7,afade=t=in:st=0:d=0.05,afade=t=out:st=1.4:d=0.3",
  falcon: "aevalsrc='sin(2*pi*(2000-800*t)*t)+0.3*sin(2*pi*(4000-1600*t)*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  vulture: "aevalsrc='sin(2*pi*(1200-400*t)*t)+0.3*sin(2*pi*2400*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  crow: "aevalsrc='(sin(2*pi*420*t)+0.4*sin(2*pi*840*t))*(gte(mod(t,0.5),0.05)*lte(mod(t,0.5),0.35))':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  raven: "aevalsrc='(sin(2*pi*380*t)+0.4*sin(2*pi*760*t))*(gte(mod(t,0.5),0.05)*lte(mod(t,0.5),0.35))':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  canary: "aevalsrc='sin(2*pi*(2200+800*sin(2*pi*15*t))*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  parrot: "aevalsrc='sin(2*pi*(1400+400*sin(2*pi*10*t))*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  macaw: "aevalsrc='sin(2*pi*(1300+500*sin(2*pi*10*t))*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  toucan: "aevalsrc='sin(2*pi*(950+350*sin(2*pi*9*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.3",
  peacock: "aevalsrc='sin(2*pi*(800+400*sin(2*pi*4*t))*t)':d=2.0,afade=t=in:st=0:d=0.1,afade=t=out:st=1.7:d=0.3",
  flamingo: "aevalsrc='sin(2*pi*(500+150*sin(2*pi*6*t))*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  swan: "aevalsrc='sin(2*pi*(480+120*sin(2*pi*5*t))*t)':d=1.8,afade=t=in:st=0:d=0.1,afade=t=out:st=1.5:d=0.3",
  stork: "aevalsrc='(sin(2*pi*800*t))*(gte(mod(t,0.1),0.01)*lte(mod(t,0.1),0.04))':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  pelican: "aevalsrc='sin(2*pi*(380+100*sin(2*pi*4*t))*t)':d=1.7,afade=t=in:st=0:d=0.05,afade=t=out:st=1.4:d=0.3",
  puffin: "aevalsrc='sin(2*pi*(420+90*sin(2*pi*5*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  penguin: "aevalsrc='sin(2*pi*(460+140*sin(2*pi*7*t))*t)':d=1.7,afade=t=in:st=0:d=0.05,afade=t=out:st=1.4:d=0.3",
  woodpecker: "aevalsrc='(sin(2*pi*1200*t))*(gte(mod(t,0.08),0.01)*lte(mod(t,0.08),0.03))':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  hummingbird: "aevalsrc='sin(2*pi*2600*t)+0.2*sin(2*pi*5200*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  pigeon: "aevalsrc='sin(2*pi*(280-30*sin(2*pi*3*t))*t)':d=1.8,afade=t=in:st=0:d=0.2,afade=t=out:st=1.5:d=0.3",
  dove: "aevalsrc='sin(2*pi*(300-30*sin(2*pi*3*t))*t)':d=1.8,afade=t=in:st=0:d=0.2,afade=t=out:st=1.5:d=0.3",
  seagull: "aevalsrc='sin(2*pi*(1100-300*t)*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  turkey: "aevalsrc='sin(2*pi*(350+200*sin(2*pi*20*t))*t)':d=1.7,afade=t=in:st=0:d=0.05,afade=t=out:st=1.4:d=0.3",
  emu: "aevalsrc='sin(2*pi*(80+10*sin(2*pi*2*t))*t)':d=2.0,afade=t=in:st=0:d=0.2,afade=t=out:st=1.7:d=0.3",
  ostrich: "aevalsrc='sin(2*pi*(90+15*sin(2*pi*2*t))*t)':d=2.0,afade=t=in:st=0:d=0.2,afade=t=out:st=1.7:d=0.3",

  // Primates & Wild Mammals
  monkey: "aevalsrc='sin(2*pi*(750+350*sin(2*pi*8*t))*t)':d=2.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.9:d=0.3",
  chimpanzee: "aevalsrc='sin(2*pi*(650+400*sin(2*pi*6*t))*t)':d=2.4,afade=t=in:st=0:d=0.1,afade=t=out:st=2.0:d=0.4",
  gorilla: "aevalsrc='sin(2*pi*(110+30*sin(2*pi*4*t))*t)+0.5*sin(2*pi*220*t)':d=2.3,afade=t=in:st=0:d=0.1,afade=t=out:st=1.9:d=0.4",
  orangutan: "aevalsrc='sin(2*pi*(140+40*sin(2*pi*3*t))*t)+0.4*sin(2*pi*280*t)':d=2.3,afade=t=in:st=0:d=0.1,afade=t=out:st=1.9:d=0.4",
  baboon: "aevalsrc='sin(2*pi*(500+250*sin(2*pi*7*t))*t)':d=2.0,afade=t=in:st=0:d=0.05,afade=t=out:st=1.7:d=0.3",
  lemur: "aevalsrc='sin(2*pi*(850+250*sin(2*pi*9*t))*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  bear: "aevalsrc='sin(2*pi*(90+20*sin(2*pi*2*t))*t)+0.5*sin(2*pi*180*t)':d=2.2,afade=t=in:st=0:d=0.2,afade=t=out:st=1.8:d=0.4",
  polar_bear: "aevalsrc='sin(2*pi*(85+20*sin(2*pi*2*t))*t)+0.5*sin(2*pi*170*t)':d=2.2,afade=t=in:st=0:d=0.2,afade=t=out:st=1.8:d=0.4",
  elephant: "aevalsrc='sin(2*pi*(380+250*sin(2*pi*2*t))*t)+0.4*sin(2*pi*(760+500*sin(2*pi*2*t))*t)':d=2.2,afade=t=in:st=0:d=0.1,afade=t=out:st=1.8:d=0.4,volume=2.0",
  rhino: "aevalsrc='sin(2*pi*(100+30*sin(2*pi*5*t))*t)+0.4*sin(2*pi*200*t)':d=2.0,afade=t=in:st=0:d=0.1,afade=t=out:st=1.7:d=0.3",
  hippo: "aevalsrc='sin(2*pi*(85+25*sin(2*pi*3*t))*t)+0.5*sin(2*pi*170*t)':d=2.2,afade=t=in:st=0:d=0.1,afade=t=out:st=1.8:d=0.4",
  kangaroo: "aevalsrc='sin(2*pi*(220+40*sin(2*pi*4*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.3:d=0.2",
  koala: "aevalsrc='sin(2*pi*(130+30*sin(2*pi*3*t))*t)':d=1.8,afade=t=in:st=0:d=0.1,afade=t=out:st=1.5:d=0.3",
  sloth: "aevalsrc='sin(2*pi*(400+50*sin(2*pi*2*t))*t)':d=1.8,afade=t=in:st=0:d=0.2,afade=t=out:st=1.5:d=0.3",
  panda: "aevalsrc='sin(2*pi*(350+60*sin(2*pi*3*t))*t)':d=1.6,afade=t=in:st=0:d=0.1,afade=t=out:st=1.3:d=0.3",
  meerkat: "aevalsrc='sin(2*pi*(1200+300*sin(2*pi*10*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  mongoose: "aevalsrc='sin(2*pi*(1100+300*sin(2*pi*10*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",

  // Rodents & Small Mammals
  mouse: "aevalsrc='sin(2*pi*(3200+400*sin(2*pi*12*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  rat: "aevalsrc='sin(2*pi*(2800+400*sin(2*pi*12*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  squirrel: "aevalsrc='sin(2*pi*(2400+500*sin(2*pi*10*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  chipmunk: "aevalsrc='sin(2*pi*(2600+500*sin(2*pi*10*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  rabbit: "aevalsrc='sin(2*pi*(1500+200*sin(2*pi*8*t))*t)':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  hamster: "aevalsrc='sin(2*pi*(3000+400*sin(2*pi*12*t))*t)':d=1.3,afade=t=in:st=0:d=0.05,afade=t=out:st=1.1:d=0.2",
  guinea_pig: "aevalsrc='sin(2*pi*(2200+600*sin(2*pi*8*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  chinchilla: "aevalsrc='sin(2*pi*(2400+400*sin(2*pi*10*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  ferret: "aevalsrc='sin(2*pi*(1600+300*sin(2*pi*8*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  hedgehog: "aevalsrc='sin(2*pi*(1800+200*sin(2*pi*6*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  badger: "aevalsrc='sin(2*pi*(180+40*sin(2*pi*5*t))*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  beaver: "aevalsrc='sin(2*pi*(220+50*sin(2*pi*4*t))*t)':d=1.6,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.3",
  raccoon: "aevalsrc='sin(2*pi*(900+300*sin(2*pi*8*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.3",
  skunk: "aevalsrc='sin(2*pi*(700+200*sin(2*pi*6*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.3",
  armadillo: "aevalsrc='sin(2*pi*(400+80*sin(2*pi*5*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",
  bat: "aevalsrc='sin(2*pi*(4200+800*sin(2*pi*15*t))*t)':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2",

  // Marine & Amphibians
  dolphin: "aevalsrc='sin(2*pi*(4500+2500*sin(2*pi*4*t))*t)':d=2.0,afade=t=in:st=0:d=0.05,afade=t=out:st=1.8:d=0.2,volume=1.8",
  whale: "aevalsrc='sin(2*pi*(180+60*sin(2*pi*0.5*t))*t)+0.4*sin(2*pi*360*t)':d=3.0,afade=t=in:st=0:d=0.4,afade=t=out:st=2.4:d=0.6",
  orca: "aevalsrc='sin(2*pi*(800+400*sin(2*pi*1.5*t))*t)':d=2.5,afade=t=in:st=0:d=0.2,afade=t=out:st=2.0:d=0.5",
  beluga: "aevalsrc='sin(2*pi*(1200+600*sin(2*pi*2*t))*t)':d=2.2,afade=t=in:st=0:d=0.1,afade=t=out:st=1.8:d=0.4",
  seal: "aevalsrc='sin(2*pi*(280+70*sin(2*pi*5*t))*t)':d=1.8,afade=t=in:st=0:d=0.05,afade=t=out:st=1.5:d=0.3",
  walrus: "aevalsrc='sin(2*pi*(140+40*sin(2*pi*3*t))*t)+0.4*sin(2*pi*280*t)':d=2.2,afade=t=in:st=0:d=0.1,afade=t=out:st=1.8:d=0.4",
  otter: "aevalsrc='sin(2*pi*(1800+400*sin(2*pi*8*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.3:d=0.2",
  manatee: "aevalsrc='sin(2*pi*(350+50*sin(2*pi*2*t))*t)':d=2.0,afade=t=in:st=0:d=0.2,afade=t=out:st=1.6:d=0.4",
  clownfish: "aevalsrc='sin(2*pi*(600+100*sin(2*pi*10*t))*t)':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  shark: "aevalsrc='sin(2*pi*(80+15*sin(2*pi*1*t))*t)':d=2.2,afade=t=in:st=0:d=0.3,afade=t=out:st=1.7:d=0.5",
  octopus: "aevalsrc='sin(2*pi*(450+80*sin(2*pi*6*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.2:d=0.3",
  jellyfish: "aevalsrc='sin(2*pi*(700+50*sin(2*pi*2*t))*t)':d=1.6,afade=t=in:st=0:d=0.2,afade=t=out:st=1.3:d=0.3",
  crab: "aevalsrc='(sin(2*pi*1400*t))*(gte(mod(t,0.06),0.01)*lte(mod(t,0.06),0.02))':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  lobster: "aevalsrc='(sin(2*pi*1200*t))*(gte(mod(t,0.06),0.01)*lte(mod(t,0.06),0.02))':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  shrimp: "aevalsrc='(sin(2*pi*2200*t))*(gte(mod(t,0.05),0.01)*lte(mod(t,0.05),0.02))':d=1.0,afade=t=in:st=0:d=0.05,afade=t=out:st=0.8:d=0.2",
  squid: "aevalsrc='sin(2*pi*(520+70*sin(2*pi*5*t))*t)':d=1.4,afade=t=in:st=0:d=0.1,afade=t=out:st=1.1:d=0.3",
  stingray: "aevalsrc='sin(2*pi*(120+20*sin(2*pi*2*t))*t)':d=2.0,afade=t=in:st=0:d=0.3,afade=t=out:st=1.5:d=0.5",
  seahorse: "aevalsrc='sin(2*pi*(1600+200*sin(2*pi*8*t))*t)':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  starfish: "aevalsrc='sin(2*pi*(380+40*sin(2*pi*3*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.2:d=0.3",
  coral: "aevalsrc='sin(2*pi*(420+30*sin(2*pi*2*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.2:d=0.3",
  blowfish: "aevalsrc='sin(2*pi*(250+60*sin(2*pi*4*t))*t)':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.2:d=0.3",
  turtle: "aevalsrc='sin(2*pi*(160+25*sin(2*pi*2*t))*t)':d=1.8,afade=t=in:st=0:d=0.2,afade=t=out:st=1.4:d=0.4",

  // Reptiles, Amphibians & Insects
  frog: "aevalsrc='(sin(2*pi*250*t)+0.4*sin(2*pi*500*t))*(gte(mod(t,0.3),0.02)*lte(mod(t,0.3),0.18))':d=1.4,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.2,volume=1.6",
  snake: "aevalsrc='sin(2*pi*3200*t)*0.2':d=1.8,afade=t=in:st=0:d=0.2,afade=t=out:st=1.4:d=0.4",
  crocodile: "aevalsrc='sin(2*pi*(80+20*sin(2*pi*2*t))*t)+0.5*sin(2*pi*160*t)':d=2.2,afade=t=in:st=0:d=0.2,afade=t=out:st=1.8:d=0.4",
  alligator: "aevalsrc='sin(2*pi*(75+20*sin(2*pi*2*t))*t)+0.5*sin(2*pi*150*t)':d=2.2,afade=t=in:st=0:d=0.2,afade=t=out:st=1.8:d=0.4",
  lizard: "aevalsrc='sin(2*pi*2200*t)*0.15':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  iguana: "aevalsrc='sin(2*pi*2000*t)*0.15':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  chameleon: "aevalsrc='sin(2*pi*2400*t)*0.15':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  bee: "aevalsrc='sin(2*pi*220*t)+0.5*sin(2*pi*440*t)':d=2.0,afade=t=in:st=0:d=0.1,afade=t=out:st=1.7:d=0.3,volume=1.6",
  fly: "aevalsrc='sin(2*pi*180*t)+0.5*sin(2*pi*360*t)':d=1.8,afade=t=in:st=0:d=0.1,afade=t=out:st=1.5:d=0.3",
  beetle: "aevalsrc='sin(2*pi*160*t)+0.4*sin(2*pi*320*t)':d=1.6,afade=t=in:st=0:d=0.1,afade=t=out:st=1.3:d=0.3",
  cricket: "aevalsrc='(sin(2*pi*4200*t))*(gte(mod(t,0.1),0.01)*lte(mod(t,0.1),0.04))':d=2.0,afade=t=in:st=0:d=0.05,afade=t=out:st=1.8:d=0.2",
  butterfly: "aevalsrc='sin(2*pi*(1200+100*sin(2*pi*3*t))*t)*0.1':d=1.5,afade=t=in:st=0:d=0.1,afade=t=out:st=1.2:d=0.3",
  caterpillar: "aevalsrc='sin(2*pi*(800+50*sin(2*pi*2*t))*t)*0.1':d=1.4,afade=t=in:st=0:d=0.1,afade=t=out:st=1.1:d=0.3",
  ladybug: "aevalsrc='sin(2*pi*1500*t)*0.1':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  scorpion: "aevalsrc='sin(2*pi*2800*t)*0.15':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  spider: "aevalsrc='sin(2*pi*2600*t)*0.15':d=1.2,afade=t=in:st=0:d=0.05,afade=t=out:st=1.0:d=0.2",
  snail: "aevalsrc='sin(2*pi*350*t)*0.1':d=1.4,afade=t=in:st=0:d=0.1,afade=t=out:st=1.1:d=0.3",
  worm: "aevalsrc='sin(2*pi*300*t)*0.1':d=1.4,afade=t=in:st=0:d=0.1,afade=t=out:st=1.1:d=0.3",
  wolverine: "aevalsrc='sin(2*pi*(120+30*sin(2*pi*3*t))*t)+0.4*sin(2*pi*240*t)':d=2.0,afade=t=in:st=0:d=0.1,afade=t=out:st=1.7:d=0.3",
  kiwi: "aevalsrc='sin(2*pi*(1400+300*sin(2*pi*6*t))*t)':d=1.5,afade=t=in:st=0:d=0.05,afade=t=out:st=1.2:d=0.3"
};

console.log(`Generating authentic audio for ${Object.keys(soundSpecs).length} animals...`);

let count = 0;
for (const [animal, filter] of Object.entries(soundSpecs)) {
  const mp3Path = path.join(outDir, `${animal}.mp3`);
  const oggPath = path.join(outDir, `${animal}.ogg`);
  
  try {
    // Generate MP3
    const mp3Cmd = `ffmpeg -y -f lavfi -i "${filter}" -c:a libmp3lame -q:a 4 "${mp3Path}" 2>/dev/null`;
    execSync(mp3Cmd);

    // Generate OGG
    const oggCmd = `ffmpeg -y -f lavfi -i "${filter}" -c:a libvorbis -q:a 4 "${oggPath}" 2>/dev/null`;
    execSync(oggCmd);

    count++;
  } catch (err) {
    console.error(`Error generating sound for ${animal}:`, err.message);
  }
}

console.log(`Done! Successfully generated ${count} animal sounds (both .mp3 and .ogg)!`);

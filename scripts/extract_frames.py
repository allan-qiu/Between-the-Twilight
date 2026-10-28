import subprocess,json
from pathlib import Path
from PIL import Image
import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
p=Path('public/media')
r=subprocess.run([ff,'-i',str(p/'sunset.mp4')],capture_output=True,text=True,encoding="utf-8",errors="replace")
print(r.stderr)
data=[]
for i,t in enumerate([3,7,12,18]):
 out=p/f'frame-{i}.jpg'
 subprocess.run([ff,'-y','-ss',str(t),'-i',str(p/'sunset.mp4'),'-frames:v','1','-q:v','2',str(out)],capture_output=True,check=True)
 im=Image.open(out).convert('RGB'); w,h=im.size
 # Quantize the upper sky, sun band, reflection and coast for a reproducible palette.
 boxes=[(0,0,w,int(h*.55)),(int(w*.25),int(h*.15),int(w*.75),int(h*.65)),(0,int(h*.4),w,h),(0,int(h*.55),w,h)]
 crop=im.crop((int(w*.465),int(h*.37),int(w*.52),int(h*.44)) if i==1 else boxes[i]).resize((250,140)); q=crop.quantize(colors=5,method=Image.Quantize.MEDIANCUT)
 pal=q.getpalette(); colors=sorted(q.getcolors(),reverse=True)
 hx=['#'+''.join(f'{v:02X}' for v in pal[k*3:k*3+3]) for _,k in colors]
 data.append({'time':t,'image':f'/media/frame-{i}.jpg','colors':hx})
 im.thumbnail((1280,720)); im.save(out,quality=89)
Path('src/frames.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(data))

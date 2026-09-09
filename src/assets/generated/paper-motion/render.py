import bpy, math, os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
s=bpy.context.scene
s.render.engine='CYCLES'; s.cycles.samples=8; s.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type='METAL'; prefs.get_devices()
for d in prefs.devices: d.use=d.type=='METAL'
s.cycles.device='GPU'
s.render.resolution_x=800;s.render.resolution_y=800;s.render.resolution_percentage=100
s.render.image_settings.file_format='PNG';s.render.fps=24
s.world.color=(0.35,0.35,0.35)
s.view_settings.view_transform='AgX'
colors=[(0.56,.16,.047,1),(.78,.30,.10,1),(.92,.57,.28,1),(.92,.82,.63,1),(.73,.34,.13,1),(.94,.71,.42,1),(.93,.85,.71,1)]
meshes=[]
for j in range(7):
 mat=bpy.data.materials.new('Cotton paper '+str(j));mat.diffuse_color=colors[j];mat.use_nodes=True
 bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=colors[j];bs.inputs['Roughness'].default_value=.68
 verts=[];faces=[]
 for a in range(121):
  x=-9+18*a/120
  for b in range(13):
   v=b/12
   y=(j-3)*1.65+v*1.75
   z=.85*math.sin(x*.47+j*.65)+.5*math.cos(v*math.pi)+j*.12
   verts.append((x,y,z))
 for a in range(120):
  for b in range(12):
   q=a*13+b;faces.append((q,q+13,q+14,q+1))
 mesh=bpy.data.meshes.new('Wave');mesh.from_pydata(verts,[],faces);mesh.update()
 obj=bpy.data.objects.new('Sculpted sheet '+str(j),mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(mat)
 for p in mesh.polygons:p.use_smooth=True
 sol=obj.modifiers.new('Paper edge','SOLIDIFY');sol.thickness=.028
 meshes.append((obj,j))
mat=bpy.data.materials.new('Backdrop');mat.diffuse_color=(.36,.14,.056,1)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-2));bpy.context.object.data.materials.append(mat)
def area(name,loc,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.name=name;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.data.color=color;l.rotation_euler=(Vector((0,0,0))-l.location).to_track_quat('-Z','Y').to_euler()
area('Large warm window',(-3,-4,9),1800,7,(1,.89,.73))
area('Soft fill',(5,5,8),1100,8,(1,.96,.88))
bpy.ops.object.camera_add(location=(5.5,-7.5,10));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.3))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=10;s.camera=cam
s.render.film_transparent=False
out=os.path.abspath('output/paper-motion/keyframes');os.makedirs(out,exist_ok=True)
frames=24
start=int(os.environ.get('PAPER_START','0'));end=int(os.environ.get('PAPER_END','1'))
for f in range(start,end):
 t=2*math.pi*f/frames
 for obj,j in meshes:
  for a in range(121):
   x=-9+18*a/120
   for b in range(13):
    v=b/12
    obj.data.vertices[a*13+b].co.z=.85*math.sin(x*.47+j*.65+.18*math.sin(t))+.5*math.cos(v*math.pi)+j*.12+.13*math.sin(t+j*.5+x*.2)
 cam.location.x=5.5+.25*math.sin(t);cam.rotation_euler=(Vector((0,0,.3))-cam.location).to_track_quat('-Z','Y').to_euler()
 s.render.filepath=os.path.join(out,f'{f:04d}.png');bpy.ops.render.render(write_still=True)

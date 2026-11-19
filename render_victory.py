import bpy
import math
import random
import os

# 0. Setup output directory
output_dir = 'C:/Users/Bopvi/Projects/Word++/public/assets/frames/'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Clear existing objects
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

# Clear existing materials & meshes
for mat in list(bpy.data.materials):
    bpy.data.materials.remove(mat)
for mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(mesh)

# ==============================================================================
# 1. CAMERA & DYNAMIC IMPACT SHAKE
# ==============================================================================
bpy.ops.object.camera_add(location=(0, -8, 0), rotation=(1.5708, 0, 0))
cam = bpy.context.object
scene = bpy.context.scene
scene.camera = cam

# Keyframe Camera Zoom & Shake
for f in range(1, 61):
    scene.frame_set(f)
    if f < 8:
        # Fast zoom in
        z_offset = (8 - f) * 0.4
        cam.location = (0, -8 - z_offset, 0)
    elif f <= 18:
        # Impact camera shake
        decay = (18 - f) / 10.0
        shake_x = (random.random() - 0.5) * 0.3 * decay
        shake_z = (random.random() - 0.5) * 0.3 * decay
        cam.location = (shake_x, -8, shake_z)
    else:
        # Steady resting position
        cam.location = (0, -8, 0)
    cam.keyframe_insert(data_path="location", frame=f)

# ==============================================================================
# 2. MATERIALS SETUP (DBZ / MVC2 Anime Cel Shaders)
# ==============================================================================
# Gold Emission Material for Text
mat_gold = bpy.data.materials.new(name="AnimeGold")
mat_gold.use_nodes = True
nodes = mat_gold.node_tree.nodes
nodes.clear()
out_node = nodes.new(type='ShaderNodeOutputMaterial')
principled = nodes.new(type='ShaderNodeBsdfPrincipled')
principled.inputs['Base Color'].default_value = (1.0, 0.75, 0.0, 1.0) # Radiant Gold
principled.inputs['Emission Color'].default_value = (1.0, 0.45, 0.0, 1.0) # Fiery Orange Emission
principled.inputs['Emission Strength'].default_value = 8.0 # High-impact glow
mat_gold.node_tree.links.new(principled.outputs['BSDF'], out_node.inputs['Surface'])

# Cyan Energy Material for Subtitle & Shockwaves
mat_cyan = bpy.data.materials.new(name="CyanEnergy")
mat_cyan.use_nodes = True
nodes_c = mat_cyan.node_tree.nodes
nodes_c.clear()
out_c = nodes_c.new(type='ShaderNodeOutputMaterial')
princ_c = nodes_c.new(type='ShaderNodeBsdfPrincipled')
princ_c.inputs['Base Color'].default_value = (0.0, 0.9, 1.0, 1.0)
princ_c.inputs['Emission Color'].default_value = (0.0, 0.8, 1.0, 1.0)
princ_c.inputs['Emission Strength'].default_value = 12.0
mat_cyan.node_tree.links.new(princ_c.outputs['BSDF'], out_c.inputs['Surface'])

# Dark Blue Speedline Background Material
mat_bg = bpy.data.materials.new(name="SpeedlineBG")
mat_bg.use_nodes = True
nodes_bg = mat_bg.node_tree.nodes
nodes_bg.clear()
out_bg = nodes_bg.new(type='ShaderNodeOutputMaterial')
princ_bg = nodes_bg.new(type='ShaderNodeBsdfPrincipled')
princ_bg.inputs['Base Color'].default_value = (0.01, 0.01, 0.04, 1.0)
mat_bg.node_tree.links.new(princ_bg.outputs['BSDF'], out_bg.inputs['Surface'])

# ==============================================================================
# 3. 3D TYPOGRAPHY (VICTORY + FLAWLESS)
# ==============================================================================
# Main Text: VICTORY!
bpy.ops.object.text_add(location=(0, 0, -0.2))
text_victory = bpy.context.object
text_victory.data.body = "VICTORY!"
text_victory.data.align_x = 'CENTER'
text_victory.data.align_y = 'CENTER'
text_victory.data.extrude = 0.25
text_victory.data.bevel_depth = 0.06
text_victory.data.materials.append(mat_gold)

# Subtitle Text: FLAWLESS STAGE CLEAR
bpy.ops.object.text_add(location=(0, 0, 1.1))
text_sub = bpy.context.object
text_sub.data.body = "⚡ FLAWLESS CLEAR ⚡"
text_sub.data.align_x = 'CENTER'
text_sub.data.align_y = 'CENTER'
text_sub.data.extrude = 0.08
text_sub.data.bevel_depth = 0.02
text_sub.data.materials.append(mat_cyan)

# Keyframe Text Animations (Adjusted for 48 frames)
for f in range(1, 49):
    scene.frame_set(f)
    if f < 8:
        s = (f / 8.0) * 1.5
        text_victory.scale = (s, s, s)
        text_sub.scale = (0, 0, 0)
    elif f == 8 or f == 9:
        text_victory.scale = (1.6, 1.6, 1.6) # Extreme Impact burst
        text_sub.scale = (1.3, 1.3, 1.3)
    elif f <= 20:
        decay = (20 - f) / 11.0
        s_vic = 1.0 + decay * 0.2
        text_victory.scale = (s_vic, s_vic, s_vic)
        text_sub.scale = (1.0, 1.0, 1.0)
    else:
        # Gentle floating motion
        offset = math.sin((f - 20) * 0.1) * 0.03
        text_victory.scale = (1.0 + offset, 1.0 + offset, 1.0 + offset)
        text_sub.scale = (1.0, 1.0, 1.0)
    
    text_victory.keyframe_insert(data_path="scale", frame=f)
    text_sub.keyframe_insert(data_path="scale", frame=f)

# ==============================================================================
# 4. DBZ SHOCKWAVE RINGS (Expanding Energy Rings)
# ==============================================================================
num_rings = 3
rings = []
for i in range(num_rings):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.1,
        minor_radius=0.03,
        location=(0, 0.2, 0),
        rotation=(1.5708, 0, 0)
    )
    ring = bpy.context.object
    ring.data.materials.append(mat_cyan)
    rings.append((ring, i * 4)) # Delay start frame for staggered wave

for f in range(1, 61):
    scene.frame_set(f)
    for ring, delay in rings:
        start_f = 8 + delay
        if f < start_f:
            ring.scale = (0, 0, 0)
        elif f < start_f + 20:
            progress = (f - start_f) / 20.0
            scale_val = progress * 12.0
            ring.scale = (scale_val, scale_val, scale_val)
        else:
            ring.scale = (0, 0, 0)
        ring.keyframe_insert(data_path="scale", frame=f)

# ==============================================================================
# 5. RADIAL SPEEDLINE BACKDROP (MvC2 Sunburst Geometry)
# ==============================================================================
bpy.ops.mesh.primitive_circle_add(vertices=24, radius=8, fill_type='TRIFAN', location=(0, 2, 0), rotation=(1.5708, 0, 0))
bg_sunburst = bpy.context.object
bg_sunburst.data.materials.append(mat_bg)

for f in range(1, 61):
    scene.frame_set(f)
    rot_z = (f * 0.08)
    bg_sunburst.rotation_euler = (1.5708, 0, rot_z)
    bg_sunburst.keyframe_insert(data_path="rotation_euler", frame=f)

# ==============================================================================
# 6. LIGHTING, IMPACT FLASH & IMPACT FRAMES
# ==============================================================================
bpy.ops.object.light_add(type='POINT', location=(0, -3, 0))
light = bpy.context.object
light.data.color = (1.0, 0.7, 0.2)

for f in range(1, 49):
    scene.frame_set(f)
    if f < 8:
        light.data.energy = 500
    elif f == 8 or f == 9:
        # DBZ True Impact Frame: Extreme Light Burst
        light.data.energy = 10000
    elif f <= 16:
        light.data.energy = 3000 # Settle glow
    else:
        light.data.energy = 1000
    light.data.keyframe_insert(data_path="energy", frame=f)

# ==============================================================================
# 7. RENDER CONFIGURATION (PNG Sequence, 24 FPS for Fluid Anime Motion)
# ==============================================================================
scene.world.use_nodes = True
world_nodes = scene.world.node_tree.nodes
bg_node = world_nodes.get("Background")
if bg_node:
    bg_node.inputs['Color'].default_value = (0.01, 0.01, 0.03, 1.0)

scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.fps = 24
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = output_dir + 'frame_'
scene.frame_start = 1
scene.frame_end = 48

print("Rendering 10/10 DBZ/MVC2 anime victory sequence...")
bpy.ops.render.render(animation=True)
print("3D Render complete! Frame sequence saved.")

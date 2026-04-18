"""Génère toutes les icônes PWA à partir du SVG"""
import subprocess
import os
from PIL import Image, ImageDraw, ImageFont

# Créer les icônes directement avec PIL (pas besoin de dépendances externes)
def create_icon(size, output_path, maskable=False):
    # Fond dégradé rouge
    img = Image.new('RGB', (size, size), '#dc2626')
    draw = ImageDraw.Draw(img)
    
    # Coins arrondis si pas maskable (pour maskable on garde carré, iOS ajoute les coins)
    if not maskable:
        # Pas de coins arrondis ici, iOS les ajoute automatiquement
        pass
    
    # Dégradé manuel (simulation simple)
    for i in range(size):
        ratio = i / size
        r = int(220 - 65 * ratio)  # de 220 à 155
        g = int(38 - 11 * ratio)   # de 38 à 27
        b = int(38 - 11 * ratio)
        draw.line([(0, i), (size, i)], fill=(r, g, b))
    
    # Zone d'inset pour maskable (20% de marge)
    inset = int(size * 0.1) if maskable else int(size * 0.05)
    
    # Texte "SEMI" en haut
    try:
        font_size_top = int(size * 0.22)
        font_size_bottom = int(size * 0.28)
        # Utiliser les fonts système
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
        ]
        font_top = None
        font_bottom = None
        for fp in font_paths:
            if os.path.exists(fp):
                font_top = ImageFont.truetype(fp, font_size_top)
                font_bottom = ImageFont.truetype(fp, font_size_bottom)
                break
        
        if font_top is None:
            font_top = ImageFont.load_default()
            font_bottom = font_top
        
        # "SEMI" centré en haut
        text = "SEMI"
        bbox = draw.textbbox((0, 0), text, font=font_top)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (size - text_width) // 2
        y = int(size * 0.28)
        draw.text((x, y), text, fill="white", font=font_top)
        
        # "1h55" centré en bas (plus gros)
        text2 = "1h55"
        bbox2 = draw.textbbox((0, 0), text2, font=font_bottom)
        text_width2 = bbox2[2] - bbox2[0]
        x2 = (size - text_width2) // 2
        y2 = int(size * 0.52)
        draw.text((x2, y2), text2, fill="#fef3c7", font=font_bottom)
        
        # Ligne de séparation
        line_y = int(size * 0.50)
        line_padding = int(size * 0.25)
        draw.rectangle([line_padding, line_y, size - line_padding, line_y + 3], fill="#fef3c7")
        
    except Exception as e:
        print(f"Erreur font: {e}")
    
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ {output_path} ({size}x{size})")

# Générer toutes les tailles nécessaires
output_dir = "/home/claude/pwa_semi/public"
os.makedirs(output_dir, exist_ok=True)

# Icônes PWA standard
create_icon(192, f"{output_dir}/pwa-192x192.png")
create_icon(512, f"{output_dir}/pwa-512x512.png")
create_icon(512, f"{output_dir}/pwa-maskable-512x512.png", maskable=True)

# Icônes Apple spécifiques
create_icon(180, f"{output_dir}/apple-touch-icon.png")
create_icon(180, f"{output_dir}/apple-touch-icon-180x180.png")
create_icon(167, f"{output_dir}/apple-touch-icon-167x167.png")
create_icon(152, f"{output_dir}/apple-touch-icon-152x152.png")

print("\n✅ Toutes les icônes générées avec succès !")

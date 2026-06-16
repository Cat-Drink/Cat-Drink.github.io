import requests
import os
import re
import urllib.parse

def download_images_and_save(md_file, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    images_dir = os.path.join(output_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取所有图片URL
    img_pattern = r'!\[.*?\]\((https?://[^\s\)]+)\)'
    images = re.findall(img_pattern, content)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for idx, img_url in enumerate(images):
        try:
            parsed = urllib.parse.urlparse(img_url)
            path = parsed.path
            ext = os.path.splitext(path)[1]
            if not ext or ext.lower() not in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
                ext = '.png'
            
            filename = f"image_51cto_{idx:03d}{ext}"
            local_path = os.path.join(images_dir, filename)
            
            img_response = requests.get(img_url, headers=headers, timeout=30)
            if img_response.status_code == 200:
                with open(local_path, 'wb') as f:
                    f.write(img_response.content)
                rel_path = os.path.join('images', filename).replace('\\', '/')
                content = content.replace(img_url, rel_path)
                print(f"Downloaded: {img_url} -> {local_path}")
            else:
                print(f"Failed to download {img_url}: {img_response.status_code}")
        except Exception as e:
            print(f"Error downloading {img_url}: {e}")
    
    # 保存文件
    output_file = os.path.join(output_dir, '算法专题_之_分治算法.md')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\nSaved to: {output_file}")
    print(f"Total images: {len(images)}")

if __name__ == '__main__':
    md_file = r'C:\Users\cwt15\AppData\Local\Temp\trae\toolcall-output\f80d4273-18e1-4fcc-a312-969b6d17cb4c.txt'
    output_dir = r'd:\Program\magic-resume'
    download_images_and_save(md_file, output_dir)

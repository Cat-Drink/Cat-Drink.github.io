import requests
import os
import re
import urllib.parse
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def fetch_and_save(url, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    images_dir = os.path.join(output_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    response.encoding = response.apparent_encoding or 'utf-8'
    html = response.text
    
    soup = BeautifulSoup(html, 'html.parser')
    
    for script in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        script.decompose()
    
    title = soup.find('title')
    title_text = title.get_text().strip() if title else 'article'
    
    # 51cto 文章主体通常在 .article-content 或 #content 中
    article = soup.find(class_='article-content') or soup.find(id='content') or soup.find('article') or soup.find('main') or soup.find('body')
    
    if not article:
        article = soup
    
    images = article.find_all('img')
    image_map = {}
    
    for idx, img in enumerate(images):
        src = img.get('src') or img.get('data-src') or img.get('data-original')
        if not src:
            continue
        
        if src.startswith('//'):
            src = 'https:' + src
        elif src.startswith('/'):
            parsed = urllib.parse.urlparse(url)
            src = f"{parsed.scheme}://{parsed.netloc}{src}"
        elif not src.startswith(('http://', 'https://')):
            src = urllib.parse.urljoin(url, src)
        
        parsed = urllib.parse.urlparse(src)
        path = parsed.path
        ext = os.path.splitext(path)[1]
        if not ext or ext.lower() not in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
            ext = '.png'
        
        filename = f"image_{idx:03d}{ext}"
        local_path = os.path.join(images_dir, filename)
        
        try:
            img_response = requests.get(src, headers=headers, timeout=30)
            if img_response.status_code == 200:
                with open(local_path, 'wb') as f:
                    f.write(img_response.content)
                rel_path = os.path.join('images', filename).replace('\\', '/')
                image_map[src] = rel_path
                print(f"Downloaded: {src} -> {local_path}")
            else:
                print(f"Failed to download {src}: {img_response.status_code}")
        except Exception as e:
            print(f"Error downloading {src}: {e}")
    
    for img in images:
        src = img.get('src') or img.get('data-src') or img.get('data-original')
        if not src:
            continue
        
        if src.startswith('//'):
            src_full = 'https:' + src
        elif src.startswith('/'):
            parsed = urllib.parse.urlparse(url)
            src_full = f"{parsed.scheme}://{parsed.netloc}{src}"
        elif not src.startswith(('http://', 'https://')):
            src_full = urllib.parse.urljoin(url, src)
        else:
            src_full = src
        
        if src_full in image_map:
            img['src'] = image_map[src_full]
            for attr in ['data-src', 'data-original']:
                if attr in img.attrs:
                    del img[attr]
    
    markdown_content = md(str(article), heading_style='ATX')
    markdown_content = re.sub(r'\n{3,}', '\n\n', markdown_content)
    
    if title_text:
        markdown_content = f"# {title_text}\n\n> 原文链接：{url}\n\n{markdown_content}"
    
    safe_title = re.sub(r'[\\/:*?"<>|]', '_', title_text)
    output_file = os.path.join(output_dir, f"{safe_title}.md")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print(f"\nSaved to: {output_file}")
    print(f"Total images: {len(image_map)}")

if __name__ == '__main__':
    url = 'https://blog.51cto.com/u_15366449/4774430'
    output_dir = 'd:\\Program\\magic-resume'
    fetch_and_save(url, output_dir)

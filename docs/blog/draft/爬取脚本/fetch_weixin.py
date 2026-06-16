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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    }
    response = requests.get(url, headers=headers)
    # 强制使用utf-8
    response.encoding = 'utf-8'
    html = response.text
    
    soup = BeautifulSoup(html, 'html.parser')
    
    for script in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        script.decompose()
    
    # 提取标题
    title = soup.find(id='activity_name') or soup.find('h2', class_='rich_media_title') or soup.find(class_='rich_media_title') or soup.find('title')
    title_text = title.get_text().strip() if title else 'article'
    
    # 微信文章主体通常在 #js_content 中
    article = soup.find(id='js_content') or soup.find('article') or soup.find('main') or soup.find('body')
    
    if not article:
        article = soup
    
    # 提取所有图片（包括 data-src）
    images = article.find_all('img')
    image_map = {}
    
    for idx, img in enumerate(images):
        src = img.get('data-src') or img.get('src')
        if not src:
            continue
        
        if src.startswith('//'):
            src = 'https:' + src
        elif src.startswith('/'):
            parsed = urllib.parse.urlparse(url)
            src = f"{parsed.scheme}://{parsed.netloc}{src}"
        elif not src.startswith(('http://', 'https://')):
            src = urllib.parse.urljoin(url, src)
        
        ext = '.png'
        if 'jpg' in src or 'jpeg' in src:
            ext = '.jpg'
        elif 'gif' in src:
            ext = '.gif'
        elif 'png' in src:
            ext = '.png'
        elif 'webp' in src:
            ext = '.webp'
        
        filename = f"image_weixin_{idx:03d}{ext}"
        local_path = os.path.join(images_dir, filename)
        
        try:
            img_response = requests.get(src, headers=headers, timeout=30)
            if img_response.status_code == 200:
                ct = img_response.headers.get('Content-Type', '')
                if 'jpeg' in ct or 'jpg' in ct:
                    ext = '.jpg'
                elif 'png' in ct:
                    ext = '.png'
                elif 'gif' in ct:
                    ext = '.gif'
                elif 'webp' in ct:
                    ext = '.webp'
                if not filename.endswith(ext):
                    filename = f"image_weixin_{idx:03d}{ext}"
                    local_path = os.path.join(images_dir, filename)
                
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
        src = img.get('data-src') or img.get('src')
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
            if 'data-src' in img.attrs:
                del img['data-src']
    
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
    url = 'https://mp.weixin.qq.com/s?__biz=MzU1NjEwMTY0Mw==&mid=2247584917&idx=1&sn=1195bfb306c44ddf22d3f32f67847896&chksm=fbc9f5f1ccbe7ce76a791908d51b373ebffc40724b2235fc18a28d8233a7f51bbd90d6030f7f&scene=27'
    output_dir = 'd:\\Program\\magic-resume'
    fetch_and_save(url, output_dir)

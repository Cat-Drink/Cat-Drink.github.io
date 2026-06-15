import requests
from bs4 import BeautifulSoup

url = 'https://blog.51cto.com/u_15366449/4774430'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
response = requests.get(url, headers=headers)
response.encoding = response.apparent_encoding or 'utf-8'
html = response.text

soup = BeautifulSoup(html, 'html.parser')

print("Title:", soup.find('title').get_text().strip() if soup.find('title') else 'None')

# 尝试多种可能的文章主体选择器
selectors = [
    '.article-content',
    '#content',
    'article',
    'main',
    '.content',
    '.post-content',
    '.blog-content',
    '.article',
    '.entry-content',
    '#article',
    '.main-content'
]

for sel in selectors:
    if sel.startswith('#'):
        elem = soup.find(id=sel[1:])
    elif sel.startswith('.'):
        elem = soup.find(class_=sel[1:])
    else:
        elem = soup.find(sel)
    
    if elem:
        print(f"Found {sel}: length={len(str(elem))}")
    else:
        print(f"Not found: {sel}")

# 打印body中的主要div结构
print("\n--- Body div classes ---")
for div in soup.find_all('div'):
    cls = div.get('class')
    if cls:
        print(' '.join(cls) if isinstance(cls, list) else cls)

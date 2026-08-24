import json
import base64
import os
from weasyprint import HTML

with open('profile.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Читаем photo.jpg если есть
photo_b64 = ""
if os.path.exists("photo.jpg"):
    with open("photo.jpg", "rb") as img_file:
        photo_b64 = "data:image/jpeg;base64," + base64.b64encode(img_file.read()).decode('utf-8')

photo_html = f"<div class='photo-cell'><img src='{photo_b64}'></div>" if photo_b64 else ""

html_content = f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <style>
        @page {{ size: A4; margin: 15mm 12mm; background-color: #1b1e24; }}
        *, *::before, *::after {{ box-sizing: border-box; }}
        body {{ margin: 0; padding: 0; font-family: sans-serif; background-color: #1b1e24; color: #d1d5db; font-size: 10pt; line-height: 1.5; }}
        .header {{ display: table; width: 100%; margin-bottom: 15px; background: rgba(21, 23, 28, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 15px; }}
        .photo-cell {{ display: table-cell; width: 90px; vertical-align: middle; }}
        .photo-cell img {{ width: 80px; height: 80px; border-radius: 12px; object-fit: cover; display: block; }}
        .title-cell {{ display: table-cell; vertical-align: middle; padding-left: 15px; }}
        h1 {{ margin: 0; font-size: 20pt; color: #ffffff; }}
        .role {{ font-size: 12pt; color: #148f93; font-weight: bold; }}
        .section {{ background: rgba(21, 23, 28, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid; }}
        .section-title {{ font-size: 11pt; color: #148f93; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid rgba(20, 143, 147, 0.3); padding-bottom: 4px; margin-bottom: 10px; }}
        .item {{ margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed rgba(255, 255, 255, 0.08); page-break-inside: avoid; }}
        .item:last-child {{ border-bottom: none; margin-bottom: 0; padding-bottom: 0; }}
        
        /* Двухколоночный макет для элементов с комментарием */
        .item-table {{ display: table; width: 100%; table-layout: fixed; }}
        .item-main {{ display: table-cell; vertical-align: top; width: 55%; padding-right: 12px; }}
        .item-comment {{ display: table-cell; vertical-align: top; width: 45%; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px; font-size: 8.5pt; color: #9ca3af; white-space: pre-line; line-height: 1.4; }}
        
        .item-header {{ display: table; width: 100%; margin-bottom: 4px; }}
        .item-title {{ display: table-cell; font-weight: bold; color: #ffffff; font-size: 10pt; }}
        .item-date {{ display: table-cell; text-align: right; color: #9ca3af; font-size: 8.5pt; }}
        .item-subtitle {{ color: #148f93; font-size: 9.5pt; margin-bottom: 6px; }}
        .item-desc {{ white-space: pre-line; color: #d1d5db; font-size: 8.5pt; }}
        .tag {{ display: inline-block; font-size: 7.5pt; background: rgba(255, 255, 255, 0.06); color: #e5e7eb; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 4px 4px 0 0; }}
    </style>
</head>
<body>
    <div class="header">
        {photo_html}
        <div class="title-cell">
            <h1>{data['name']}</h1>
            <div class="role">{data['role']}</div>
        </div>
    </div>
    <div class="section">
        <div class="section-title">{data['aboutTitle']}</div>
        <div style="white-space: pre-line; color: #9ca3af; font-size: 9pt;">{data['aboutText']}</div>
    </div>
    <div class="section">
        <div class="section-title">{data['careerTitle']}</div>
"""

for item in data['careerItems']:
    tags_html = "".join([f'<span class="tag">{t}</span>' for t in item.get('tags', [])])
    comment = item.get('comment')
    date_html = f'<div class="item-date">{item["date"]}</div>' if item.get('date') else ''
    
    if comment:
        html_content += f"""
        <div class="item">
            <div class="item-table">
                <div class="item-main">
                    <div class="item-header">
                        <div class="item-title">{item['title']}</div>
                    </div>
                    <div class="item-subtitle">{item['subtitle']}</div>
                    <div class="item-desc">{item['description']}</div>
                    <div>{tags_html}</div>
                </div>
                <div class="item-comment">
                    <div style="text-align: right; margin-bottom: 6px;">{date_html}</div>
                    {comment}
                </div>
            </div>
        </div>
        """
    else:
        html_content += f"""
        <div class="item">
            <div class="item-header">
                <div class="item-title">{item['title']}</div>
                {date_html}
            </div>
            <div class="item-subtitle">{item['subtitle']}</div>
            <div class="item-desc">{item['description']}</div>
            <div>{tags_html}</div>
        </div>
        """

html_content += f"""
    </div>
    <div class="section">
        <div class="section-title">{data['contactsTitle']}</div>
        <div style="font-size: 9pt;">
            Тел.: +7 951 156 75 63<br>
            E-mail: alexander.masyuk@gmail.com<br>
            Telegram: @jaddy_LD
        </div>
    </div>
</body>
</html>
"""

with open("temp.html", "w", encoding="utf-8") as f:
    f.write(html_content)

HTML("temp.html").write_pdf("Resume_Alexander_Masyuk.pdf")
os.remove("temp.html")

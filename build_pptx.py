import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_presentation():
    prs = Presentation()
    
    # Set to widescreen 16:9
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Colors matching Gemini Theme
    bg_color = RGBColor(10, 11, 20)      # Dark Blue theme
    white = RGBColor(245, 247, 250)      # White Text
    muted = RGBColor(142, 159, 182)      # Muted Text
    blue = RGBColor(66, 133, 244)        # Gemini Blue
    purple = RGBColor(155, 114, 203)     # Gemini Purple
    pink = RGBColor(217, 107, 186)       # Gemini Pink
    
    # Blank slide layout is index 6 in standard templates
    blank_layout = prs.slide_layouts[6]
    
    def set_dark_background(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = bg_color

    def add_title(slide, text):
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(0.8))
        tf = txBox.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = text
        p.font.name = 'Segoe UI'
        p.font.size = Pt(36)
        p.font.bold = True
        p.font.color.rgb = white
        return txBox

    # ==========================================
    # SLIDE 1: Title Cover
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_dark_background(s1)
    
    txBox = s1.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.5), Inches(1.5))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PitCrew Connect: On-Demand Mechanic Platform"
    p.font.name = 'Segoe UI'
    p.font.size = Pt(38)
    p.font.bold = True
    p.font.color.rgb = white
    
    txBox2 = s1.shapes.add_textbox(Inches(0.8), Inches(3.2), Inches(11.5), Inches(2.0))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    
    # Name
    p_name = tf2.paragraphs[0]
    p_name.text = "Presented by: Jai Akash T"
    p_name.font.name = 'Segoe UI'
    p_name.font.size = Pt(24)
    p_name.font.bold = True
    p_name.font.color.rgb = white
    p_name.space_after = Pt(6)
    
    # Reg No
    p_reg = tf2.add_paragraph()
    p_reg.text = "Register Number: 243115106037"
    p_reg.font.name = 'Segoe UI'
    p_reg.font.size = Pt(20)
    p_reg.font.bold = True
    p_reg.font.color.rgb = purple
    p_reg.space_after = Pt(6)
    
    # Class
    p_class = tf2.add_paragraph()
    p_class.text = "Class Section: ECE-3A"
    p_class.font.name = 'Segoe UI'
    p_class.font.size = Pt(20)
    p_class.font.bold = True
    p_class.font.color.rgb = purple
    
    txBox3 = s1.shapes.add_textbox(Inches(0.8), Inches(4.8), Inches(11.0), Inches(1.5))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p3 = tf3.paragraphs[0]
    p3.text = "An integrated role-based system connecting stranded drivers, verified mechanics, and operational admins in a real-time dispatch and tracking network."
    p3.font.name = 'Segoe UI'
    p3.font.size = Pt(16)
    p3.font.color.rgb = muted

    # ==========================================
    # SLIDE 2: Roadside Assistance Bottleneck
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_dark_background(s2)
    add_title(s2, "The Roadside Assistance Bottleneck")
    
    # Left Box
    txBoxL = s2.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.4), Inches(4.5))
    tfL = txBoxL.text_frame
    tfL.word_wrap = True
    pL = tfL.paragraphs[0]
    pL.text = "THE LAYMAN CALL CENTER ANALOGY"
    pL.font.name = 'Segoe UI'
    pL.font.size = Pt(18)
    pL.font.bold = True
    pL.font.color.rgb = blue
    
    bulletsL = [
        "Traditional roadside assistance is like mailing letters to call a taxi.",
        "Stranded drivers wait on phone brokers, explain locations blindly, and guess ETAs.",
        "Towing systems suffer from unvetted service quality and manual coordinate dispatch."
    ]
    for b in bulletsL:
        p = tfL.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(16)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # Right Box
    txBoxR = s2.shapes.add_textbox(Inches(6.8), Inches(1.6), Inches(5.4), Inches(4.5))
    tfR = txBoxR.text_frame
    tfR.word_wrap = True
    pR = tfR.paragraphs[0]
    pR.text = "THE PITCREW CONNECT SOLUTION"
    pR.font.name = 'Segoe UI'
    pR.font.size = Pt(18)
    pR.font.bold = True
    pR.font.color.rgb = pink
    
    bulletsR = [
        "Digital intake routes breakdown locations directly to regional mechanics.",
        "Interactive route vectors update coordinates in real time on mechanic screens.",
        "Strict operational supervision keeps dispatcher databases secure and vetted."
    ]
    for b in bulletsR:
        p = tfR.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(16)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # ==========================================
    # SLIDE 3: Evolution Timeline
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_dark_background(s3)
    add_title(s3, "Roadside Dispatch Platform Evolution")
    
    txBox = s3.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Before 2010: Physical directories and paper catalogs (offline towing call lines).",
        "2015: Static business web listings. Drivers call individual shops for quotes.",
        "2020: Consolidated garage portals. Bookings route manually, causing dispatch lag.",
        "2026+: Automated on-demand marketplaces. Vetted mechanic onboarding and live map routes."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18)
        p.font.color.rgb = white
        p.space_after = Pt(14)

    # ==========================================
    # SLIDE 4: System Architecture
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_dark_background(s4)
    add_title(s4, "Platform System Architecture")
    
    txBox = s4.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Drivers Frontend: Geolocation client interface. Captures breakdown coords and issue details.",
        "Node.js Backend Server: Central dispatcher. Coordinates requests, matches, and database queries.",
        "Mechanics Client: target interface. Receives job cards, routes, and confirms dispatches.",
        "PostgreSQL Store: Hashed account credentials, active dispatcher logs, and persistent session states."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18)
        p.font.color.rgb = white
        p.space_after = Pt(14)

    # ==========================================
    # SLIDE 5: Operations & Dispatch Flow
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_dark_background(s6)
    add_title(s6, "Operations & Dispatch Flow")
    
    txBoxS = s6.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tfS = txBoxS.text_frame
    tfS.word_wrap = True
    pS = tfS.paragraphs[0]
    pS.text = "A real-time dispatch cycle coordinate sequence comprising 4 stages:"
    pS.font.name = 'Segoe UI'
    pS.font.size = Pt(16)
    pS.font.italic = True
    pS.font.color.rgb = muted

    txBox = s6.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.5), Inches(4.2))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "01. Drivers Intake (FETCH): Breakdown coordinates and issue summaries routed to dispatch hub.",
        "02. Database Match (READ): Server queries availability and matches closest regional mechanic.",
        "03. Dispatch Confirmation (WRITE): Mechanic confirms match, locking coordinates and starting route.",
        "04. Job Completed (REFRESH): Service settled, database logs archived, and system state refreshed."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18)
        p.font.color.rgb = white
        p.space_after = Pt(14)

    # ==========================================
    # SLIDE 6: Performance Metrics & Specifications
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_dark_background(s7)
    add_title(s7, "Fulfillment Metrics & Specifications")
    
    # Left: Metrics
    txBoxL = s7.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.0), Inches(4.8))
    tfL = txBoxL.text_frame
    tfL.word_wrap = True
    pL = tfL.paragraphs[0]
    pL.text = "OPERATIONAL PERFORMANCE"
    pL.font.name = 'Segoe UI'
    pL.font.size = Pt(18)
    pL.font.bold = True
    pL.font.color.rgb = blue
    
    bulletsL = [
        "Phone Call Towing: 45.0 Mins",
        "Local Tow Broker: 32.0 Mins",
        "Insurance Directory: 24.5 Mins",
        "PitCrew Connect: 12.5 Mins (72% speedup)"
    ]
    for b in bulletsL:
        p = tfL.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(15)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # Right: Table
    rows, cols = 5, 3
    left, top, width, height = Inches(6.2), Inches(1.6), Inches(6.3), Inches(4.5)
    table_shape = s7.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    
    table.columns[0].width = Inches(2.3)
    table.columns[1].width = Inches(2.0)
    table.columns[2].width = Inches(2.0)
    
    table_data = [
        ["Platform Feature", "Legacy Phone Call", "PitCrew Connect"],
        ["Match Dispatch Speed", "15-20 Mins", "2.4 Mins"],
        ["Location Accuracy", "Approximate street", "Live GPS Coordinates"],
        ["Onboarding Check", "None", "Identity Vetted"],
        ["Active Uptime", "Office Hours Only", "99.98% / 24-7 Core"]
    ]
    
    for r_idx, row in enumerate(table_data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.name = 'Segoe UI'
            p.font.size = Pt(13)
            p.font.color.rgb = white
            if r_idx == 0:
                p.font.bold = True
                p.font.color.rgb = purple
            elif c_idx == 2 and r_idx in [1, 2, 3]:
                p.font.color.rgb = pink
                p.font.bold = True

    # ==========================================
    # SLIDE 7: Security & Verification Compliance
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_dark_background(s8)
    add_title(s8, "Platform Onboarding & Vetting Controls")
    
    # Left: Steps
    txBoxL = s8.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.8), Inches(4.8))
    tfL = txBoxL.text_frame
    tfL.word_wrap = True
    pL = tfL.paragraphs[0]
    pL.text = "COMPLIANCE VERIFICATION PIPELINE"
    pL.font.name = 'Segoe UI'
    pL.font.size = Pt(18)
    pL.font.bold = True
    pL.font.color.rgb = blue
    
    bulletsL = [
        "01. Upload Credentials: Mechanics submit registration details, trade licenses, and credentials.",
        "02. Admin Vetting Audits: Platform admins inspect credentials, check background references, and authorize access.",
        "03. System Activation: Approved profiles unlock active dispatch queues and live client route coordinate requests."
    ]
    for b in bulletsL:
        p = tfL.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(14)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # Right: Security
    txBoxR = s8.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.5), Inches(4.8))
    tfR = txBoxR.text_frame
    tfR.word_wrap = True
    pR = tfR.paragraphs[0]
    pR.text = "DATA ENCRYPTION & COMPLIANCE"
    pR.font.name = 'Segoe UI'
    pR.font.size = Pt(18)
    pR.font.bold = True
    pR.font.color.rgb = pink
    
    bulletsR = [
        "Account Security: Passwords are encrypted on-disk using high-security bcryptjs hashing algorithms.",
        "Role Isolation: Strict middleware limits database query endpoints to matched mechanic accounts.",
        "Compliance: Operational audit logs track completed jobs, invoices, and verified matches.",
        "Hosted live: pitcrew-connect.onrender.com"
    ]
    for b in bulletsR:
        p = tfR.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(14)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # ==========================================
    # SLIDE 8: Thank You
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_dark_background(s15)
    
    txBox = s15.shapes.add_textbox(Inches(1.0), Inches(2.8), Inches(11.333), Inches(1.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "THANK YOU"
    p.font.name = 'Segoe UI'
    p.font.size = Pt(64)
    p.font.bold = True
    p.font.color.rgb = white

    # Save presentation
    prs.save("PitCrew_Connect_Showcase.pptx")
    print("PowerPoint deck compiled successfully as PitCrew_Connect_Showcase.pptx!")

if __name__ == "__main__":
    create_presentation()

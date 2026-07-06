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
    
    # Colors
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
    p.text = "High Bandwidth Memory (HBM4/HBM4E)"
    p.font.name = 'Segoe UI'
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = white
    
    txBox2 = s1.shapes.add_textbox(Inches(0.8), Inches(3.4), Inches(11.5), Inches(1.2))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "Presented by: Jai Akash T\nElectronics & Communication Engineering (ECE)"
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = purple
    
    txBox3 = s1.shapes.add_textbox(Inches(0.8), Inches(4.8), Inches(11.0), Inches(1.5))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p3 = tf3.paragraphs[0]
    p3.text = "A simple guide to the 3D-stacked vertical silicon chip structures, microscopic vertical copper wire connects, and high-speed lanes powering next-gen AI supercomputers."
    p3.font.name = 'Segoe UI'
    p3.font.size = Pt(16)
    p3.font.color.rgb = muted

    # ==========================================
    # SLIDE 2: Memory Bottleneck
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_dark_background(s2)
    add_title(s2, "Memory Bottleneck in Modern AI Computing")
    
    # Left Box (Analogy)
    txBoxL = s2.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.4), Inches(4.5))
    tfL = txBoxL.text_frame
    tfL.word_wrap = True
    pL = tfL.paragraphs[0]
    pL.text = "THE LAYMAN WAREHOUSE ANALOGY"
    pL.font.name = 'Segoe UI'
    pL.font.size = Pt(18)
    pL.font.bold = True
    pL.font.color.rgb = blue
    
    bulletsL = [
        "DDR Memory is like a warehouse built far away from the factory (GPU).",
        "Trucks (signals) take a long time to travel back and forth on narrow highways.",
        "HBM4 stacks 16 warehouses directly on top of the factory and links them using fast elevators."
    ]
    for b in bulletsL:
        p = tfL.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(16)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # Right Box (Challenge)
    txBoxR = s2.shapes.add_textbox(Inches(6.8), Inches(1.6), Inches(5.4), Inches(4.5))
    tfR = txBoxR.text_frame
    tfR.word_wrap = True
    pR = tfR.paragraphs[0]
    pR.text = "TECHNICAL CHALLENGES WITH DDR"
    pR.font.name = 'Segoe UI'
    pR.font.size = Pt(18)
    pR.font.bold = True
    pR.font.color.rgb = pink
    
    bulletsR = [
        "Processor Speeds have scaled up by 1000x over recent years.",
        "Memory Bandwidth has only grown by 10x, leaving high-performance engines starving for data.",
        "Flat Motherboard designs have hit a physical routing limit, preventing wider data highways."
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
    add_title(s3, "Evolution of High Bandwidth Memory")
    
    txBox = s3.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "HBM1 (2013): 1st gen stack with 1024-bit width. 1 GB capacity, 128 GB/s bandwidth.",
        "HBM2 (2016): Capacity expanded to 8 GB. Pins rate scaled to 2.0 Gbps (256 GB/s bandwidth).",
        "HBM3 (2022): 24 GB capacity. Pin rate scaled up to 6.4 Gbps, yielding 819 GB/s bandwidth.",
        "HBM3E (2024): 36 GB capacity, transferring data speeds up to 9.6 Gbps (1.2 TB/s bandwidth).",
        "HBM4 (2025/2026): Doubled bus width (2048-bit). Custom logic base dies on advanced foundry nodes."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # ==========================================
    # SLIDE 4: Architectural Breakdown
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_dark_background(s4)
    add_title(s4, "HBM4 Architectural Breakdown")
    
    txBox = s4.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Silicon Interposer: The horizontal silicon highway that connects the GPU side-by-side with the HBM Memory stack.",
        "Custom Logic Base Die: The buffer control die at the bottom. Built on advanced foundry nodes (TSMC N5) to schedule data.",
        "DRAM Stack (12/16-High): Paper-thin memory layers stacked vertically on top of the logic base to packing storage capacity.",
        "Microbumps & TSVs: Microscopic vertical copper wires drilled straight through silicon layers to connect stacked DRAM."
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
    # SLIDE 5: 3D Packaging & Operations
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_dark_background(s6)
    add_title(s6, "3D Stacking & Processor Access Simulation")
    
    txBoxS = s6.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tfS = txBoxS.text_frame
    tfS.word_wrap = True
    pS = tfS.paragraphs[0]
    pS.text = "HBM4 stacks memory layers vertically to bypass physical spacing limits, integrating 4 core operations:"
    pS.font.name = 'Segoe UI'
    pS.font.size = Pt(16)
    pS.font.italic = True
    pS.font.color.rgb = muted

    txBox = s6.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.5), Inches(4.2))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Instruction Fetch (IF): High-speed green data flows routing instruction codes from HBM stack to CPU cores.",
        "Data Read (RD): Standard blue signals transferring operands and parameters from HBM columns to GPU cores.",
        "Data Write (WR): Pink data signals routing processed calculations back from GPU cores into DRAM cell rows.",
        "Memory Refresh (RF): Amber sequencing sweeps that periodically recharge capacitive cells inside DRAM dies."
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
    # SLIDE 6: Performance & Specs comparison
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_dark_background(s7)
    add_title(s7, "Performance Metrics & Specifications")
    
    # Left: Bandwidth Metrics
    txBoxL = s7.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.0), Inches(4.8))
    tfL = txBoxL.text_frame
    tfL.word_wrap = True
    pL = tfL.paragraphs[0]
    pL.text = "BANDWIDTH PERFORMANCE"
    pL.font.name = 'Segoe UI'
    pL.font.size = Pt(18)
    pL.font.bold = True
    pL.font.color.rgb = blue
    
    bulletsL = [
        "DDR5: 38.4 GB/s (Baseline flat bus)",
        "GDDR7: 192 GB/s (Dedicated graphics standard)",
        "HBM3E: 1228 GB/s (Legacy stacked standard)",
        "HBM4: 2048 GB/s (Widescreen 2048-bit bus standard)",
        "HBM4E: 2457+ GB/s (Enhanced performance peak)"
    ]
    for b in bulletsL:
        p = tfL.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(15)
        p.font.color.rgb = white
        p.space_after = Pt(8)

    # Right: Add native PowerPoint Table
    rows, cols = 7, 3
    left, top, width, height = Inches(6.2), Inches(1.6), Inches(6.3), Inches(4.5)
    table_shape = s7.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    
    # Column widths
    table.columns[0].width = Inches(2.3)
    table.columns[1].width = Inches(2.0)
    table.columns[2].width = Inches(2.0)
    
    table_data = [
        ["Feature Metric", "HBM4 Standard", "HBM4E (Enhanced)"],
        ["Max Capacity", "Up to 48 GB", "Up to 64 GB"],
        ["Bus Width", "2048-bit / 32 Ch", "2048-bit / 32 Ch"],
        ["Data Pin Speed", "8.0 Gbps", "9.6+ Gbps"],
        ["Peak Bandwidth", "2.0 TB/s", "2.45+ TB/s"],
        ["Logic Node", "TSMC Custom N5", "TSMC Custom N5"],
        ["Stacking Height", "12 / 16 Layers", "12 / 16 Layers"]
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
            elif c_idx == 2 and r_idx in [1, 3, 4]:
                p.font.color.rgb = pink
                p.font.bold = True

    # ==========================================
    # SLIDE 7: Manufacturing Flow & Thermals
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_dark_background(s8)
    add_title(s8, "Manufacturing & Thermal Management")
    
    # Left: Mfg steps
    txBoxL = s8.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(5.8), Inches(4.8))
    tfL = txBoxL.text_frame
    tfL.word_wrap = True
    pL = tfL.paragraphs[0]
    pL.text = "3D MANUFACTURING WORKFLOW"
    pL.font.name = 'Segoe UI'
    pL.font.size = Pt(18)
    pL.font.bold = True
    pL.font.color.rgb = blue
    
    bulletsL = [
        "01. TSV Drilling: Deep RIE lasers drill microscopic channels straight through wafers, filling them with copper to construct vertical conduits.",
        "02. Wafer Thinning: Silicon substrates are ground down to paper-thin ~30μm dimensions to enable multi-layered stacking heights.",
        "03. Hybrid Bonding: Direct atomic Copper-to-Copper fusion merges DRAM layers together, dropping pad pitches below 10μm."
    ]
    for b in bulletsL:
        p = tfL.add_paragraph()
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(14)
        p.font.color.rgb = white
        p.space_after = Pt(12)

    # Right: Thermal Management
    txBoxR = s8.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.5), Inches(4.8))
    tfR = txBoxR.text_frame
    tfR.word_wrap = True
    pR = tfR.paragraphs[0]
    pR.text = "THERMAL HEAT DISSIPATION MAP"
    pR.font.name = 'Segoe UI'
    pR.font.size = Pt(18)
    pR.font.bold = True
    pR.font.color.rgb = pink
    
    bulletsR = [
        "Thermal Penalty: Stacking 16 hot memory layers traps high-power heat in the core logic.",
        "TIM Materials: Advanced interface materials with high thermal conductivity conduct heat up to top lids.",
        "Dummy Vias: Unconnected dummy TSVs are placed inside memory layers to act as passive heat pipeline guides.",
        "Top cap: 45°C | Stack core: 78°C | Logic die: 60°C"
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
    prs.save("HBM4_HBM4E_Showcase.pptx")
    print("PowerPoint deck compiled successfully as HBM4_HBM4E_Showcase.pptx!")

if __name__ == "__main__":
    create_presentation()

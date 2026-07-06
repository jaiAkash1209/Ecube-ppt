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
        p.font.size = Pt(36) # Increased from 28
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
    p.font.size = Pt(44) # Increased from 40
    p.font.bold = True
    p.font.color.rgb = white
    
    txBox2 = s1.shapes.add_textbox(Inches(0.8), Inches(3.4), Inches(11.5), Inches(1.2))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "Presented by: Jai Akash T\nElectronics & Communication Engineering (ECE)"
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(20) # Increased from 18
    p2.font.bold = True
    p2.font.color.rgb = purple
    
    txBox3 = s1.shapes.add_textbox(Inches(0.8), Inches(4.8), Inches(11.0), Inches(1.5))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p3 = tf3.paragraphs[0]
    p3.text = "A simple guide to the 3D-stacked vertical silicon chip structures, microscopic vertical copper wire connects, and high-speed lanes powering next-gen AI supercomputers."
    p3.font.name = 'Segoe UI'
    p3.font.size = Pt(16) # Increased from 13
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
    pL.font.size = Pt(18) # Increased from 14
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
        p.font.size = Pt(16) # Increased from 13
        p.font.color.rgb = white
        p.space_after = Pt(12)
        p.level = 0

    # Right Box (Challenge)
    txBoxR = s2.shapes.add_textbox(Inches(6.8), Inches(1.6), Inches(5.4), Inches(4.5))
    tfR = txBoxR.text_frame
    tfR.word_wrap = True
    pR = tfR.paragraphs[0]
    pR.text = "TECHNICAL CHALLENGES WITH DDR"
    pR.font.name = 'Segoe UI'
    pR.font.size = Pt(18) # Increased from 14
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
        p.font.size = Pt(16) # Increased from 13
        p.font.color.rgb = white
        p.space_after = Pt(12)
        p.level = 0

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
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(12)
        p.level = 0

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
        "Silicon Interposer: The horizontal highway that connects the GPU side-by-side with the HBM Memory stack.",
        "Custom Logic Base Die: The brain of the HBM stack. Built on advanced foundry nodes (TSMC/Samsung/Intel) to route signals.",
        "DRAM Stack (12/16-High): Thin memory layers stacked vertically on top of the logic die to maximize capacity.",
        "Microbumps & TSVs: Vertical connections that link the stacked layers to the base logic die."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 5: TSVs
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_dark_background(s5)
    add_title(s5, "Through-Silicon Vias (TSV): Vertical Wires")
    
    txBoxS = s5.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tfS = txBoxS.text_frame
    tfS.word_wrap = True
    pS = tfS.paragraphs[0]
    pS.text = "Simply put: Instead of running long wires around the edges, TSVs are microscopic copper 'elevator shafts' drilled straight through the silicon, letting signals travel vertically and instantly."
    pS.font.name = 'Segoe UI'
    pS.font.size = Pt(16) # Increased from 13
    pS.font.italic = True
    pS.font.color.rgb = muted

    txBox = s5.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.5), Inches(4.2))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "How They Are Made: Deep Reactive-Ion Etching carves vias through silicon, insulated with oxides, and filled with copper electroplating.",
        "Why We Use Them: Shorter paths drop trace impedance, prevent heat generation, and open thousands of parallel vertical data lanes.",
        "Production Hurdles: Thinning DRAM wafers down to 30μm makes them fragile. Expansion differences can cause micro-cracking."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 6: 3D Stack
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_dark_background(s6)
    add_title(s6, "3D Stack Visualization: Stacking Chips")
    
    txBoxS = s6.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tfS = txBoxS.text_frame
    tfS.word_wrap = True
    pS = tfS.paragraphs[0]
    pS.text = "Simply put: Like building a skyscraper to fit more office space inside a small city block, HBM4 stacks memory layers vertically to save space and keep data lanes as close as possible."
    pS.font.name = 'Segoe UI'
    pS.font.size = Pt(16) # Increased from 13
    pS.font.italic = True
    pS.font.color.rgb = muted

    txBox = s6.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.5), Inches(4.2))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "3D Integration: Stacking DRAM layers vertically minimizes physical foot-space, packing more storage density.",
        "Hybrid Bonding: Future HBM4 stacks will use copper-to-copper direct bonding, dropping pad spacing to under 10μm.",
        "Thermal Caps: Heat spreader metal plates are mounted on top of the stack to pull core heat away quickly."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 7: Pin Configurations & Speed
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_dark_background(s7)
    add_title(s7, "Pin Configurations & Interface Speeds")
    
    txBox = s7.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "2048-Bit Bus Width: HBM4 doubles the bus width of HBM3E (from 1024 to 2048 lines), widening the highway.",
        "Sub-10μm Stacking Pitch: Compact direct hybrid copper-to-copper links bypass old microbump solder thickness parameters.",
        "Data Bandwidth: HBM4 reaches up to 2.0 TB/s per stack, while HBM4E scales beyond 2.4 TB/s.",
        "Pins Count: Scales to over 5,000 interconnect channels per stack, supporting massive parallel computing lanes."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(12)
        p.level = 0

    # ==========================================
    # SLIDE 8: Manufacturing Flow
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_dark_background(s8)
    add_title(s8, "Manufacturing Workflow")
    
    txBox = s8.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Stage 1: Wafer Thinning. DRAM wafers are ground down to ~30-40μm thickness (thin as paper).",
        "Stage 2: Laser Via Drilling. Drills microscopic TSV holes straight through memory chip surfaces.",
        "Stage 3: Hybrid Bonding. Copper pads are aligned and bonded directly at room temperature without solder.",
        "Stage 4: Underfill Encapsulation. Liquid epoxy is injected between dies to lock the stack against moisture."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 9: Physical Attributes
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_dark_background(s9)
    add_title(s9, "Physical Attributes Comparison")
    
    txBox = s9.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Bus Width: HBM2/3 (1024-bit) vs. HBM4/4E (2048-bit).",
        "Pin Speed: HBM3E (9.6 Gbps) vs. HBM4 (14.0 Gbps) and HBM4E (16.0+ Gbps).",
        "Capacity per Stack: HBM3 (24 GB) vs. HBM4 (48 GB) and HBM4E (64 GB).",
        "Bandwidth per Stack: HBM3E (1.2 TB/s) vs. HBM4 (2.0 TB/s) and HBM4E (2.4+ TB/s).",
        "Interconnect Pitch: microbumps (~25μm) vs. hybrid direct copper-to-copper bonding (<10μm)."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(12)
        p.level = 0

    # ==========================================
    # SLIDE 10: Thermal Management
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_dark_background(s10)
    add_title(s10, "Thermal Management & Heat Dispersion")
    
    txBox = s10.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Thermal Stacking Penalty: Stacking 16 hot memory layers traps heat in the center cells.",
        "Underfill Material: Epoxy underfills are loaded with alumina particles to help conduct heat away vertically.",
        "High-Thermal Metal Lid: A conductive metal alloy cap covers the top of the stack to extract heat to system fans.",
        "Micro-cooling Vias: Unconnected dummy TSVs are placed inside memory layers to act as passive heat pipelines."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 11: Eco-Footprint
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_dark_background(s11)
    add_title(s11, "Eco-Footprint & Energy Efficiency")
    
    txBox = s11.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Energy Drop: 3D stacking drops operational energy by ~30% compared to GDDR7 pipelines.",
        "Short Channels: Keeping copper wires ultra-short prevents electrical losses (impedance core dissipation).",
        "Green AI Datacenters: Lower memory energy prevents high cooling overheads, reducing global CO2 footprints.",
        "Low VDDQ Core Voltages: Drops logic supply voltages to 1.1V/0.4V to keep power consumption low."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 12: Business Ecosystem
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_dark_background(s12)
    add_title(s12, "Global Market & Business Ecosystem")
    
    txBox = s12.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "Core Memory Producers: SK Hynix, Samsung Electronics, and Micron Technologies lead wafer stacks.",
        "Advanced Foundries: TSMC, Samsung, and Intel build the custom high-performance logic base dies.",
        "Datacenter Offtakers: NVIDIA (Hopper/Blackwell), AMD (Instinct MI300/400), Google (TPUs), and AWS.",
        "Joint Engineering: Foundry-Memory alliances are crucial to align pad pitches under 10μm."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 13: Future Roadmap
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_dark_background(s13)
    add_title(s13, "Future Roadmap Timeline")
    
    txBox = s13.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "2024: HBM3E volume production. 36 GB capacity, VDDQ at 1.1V, supporting high-speed training.",
        "2025/2026: HBM4 launch. 48 GB stack size, 2048-bit bus width. Transition to custom logic base dies.",
        "2027/2028: HBM4E debut. Over 2.4 TB/s stack speeds, VDDQ core voltage dropped further to cut heat.",
        "2030+: Optical Waveguides. Replaces copper TSVs with silicon laser channels to bypass speed limits."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 14: Technical References
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_dark_background(s14)
    add_title(s14, "Technical Citations & References")
    
    txBox = s14.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.5), Inches(4.8))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    bullets = [
        "JEDEC Solid State Association: Defines the mechanical standard specifications and bus dimensions.",
        "IEEE Xplore Journals: Explains thermal expansion stresses, micro-cracking, and silicon thinning methods.",
        "TSMC CoWoS Technical Briefings: Guides layout routines for interposers, microbumps, and hybrid bonding."
    ]
    first = True
    for b in bullets:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = b
        p.font.name = 'Segoe UI'
        p.font.size = Pt(18) # Increased from 14
        p.font.color.rgb = white
        p.space_after = Pt(14)
        p.level = 0

    # ==========================================
    # SLIDE 15: Thank You
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
    p.font.size = Pt(64) # Increased from 56
    p.font.bold = True
    p.font.color.rgb = white

    # Save presentation
    prs.save("HBM4_HBM4E_Showcase.pptx")
    print("PowerPoint deck compiled successfully as HBM4_HBM4E_Showcase.pptx!")

if __name__ == "__main__":
    create_presentation()

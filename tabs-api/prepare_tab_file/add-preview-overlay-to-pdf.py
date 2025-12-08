import fitz

def add_overlay_to_pdf(input_pdf, output_pdf, overlay_png):
    pdf = fitz.open(input_pdf)

    overlay_img = fitz.Pixmap(overlay_png)

    for page in pdf:
        page_width = page.rect.width
        page_height = page.rect.height

        scale = page_width / overlay_img.width
        overlay_width = page_width
        overlay_height = overlay_img.height * scale

        x_pos = 0
        y_pos = 0

        rect = fitz.Rect(
            x_pos,
            y_pos,
            x_pos + overlay_width,
            y_pos + overlay_height
        )

        page.insert_image(
            rect,
            filename=overlay_png,
            keep_proportion=True,
            overlay=True
        )

    pdf.save(output_pdf)
    pdf.close()
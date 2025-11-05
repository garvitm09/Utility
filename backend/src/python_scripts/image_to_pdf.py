from PIL import Image
import sys
import os

def images_to_pdf(image_paths, output_pdf):
    """
    Convert multiple images into a single PDF file.
    Args:
        image_paths (list of str): Paths to image files.
        output_pdf (str): Output PDF file path.
    """
    image_list = []
    for img_path in image_paths:
        if not os.path.isfile(img_path):
            print(f"File not found: {img_path}")
            continue
        img = Image.open(img_path)
        if img.mode == "RGBA":  # Convert PNG with alpha
            img = img.convert("RGB")
        image_list.append(img)
    if not image_list:
        print("No valid images found.")
        return
    first_image = image_list.pop(0)
    first_image.save(output_pdf, "PDF", resolution=100.0, save_all=True, append_images=image_list)
    print(f"PDF created: {output_pdf}")

if __name__ == "__main__":
    # Usage: python images_to_pdf.py img1.jpg img2.png img3.jpeg output.pdf
    if len(sys.argv) < 3:
        print("Usage: python images_to_pdf.py <img1> <img2> ... <output.pdf>")
        sys.exit(1)
    image_paths = sys.argv[1:-1]
    output_pdf = sys.argv[-1]
    images_to_pdf(image_paths, output_pdf)

import os
from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.base import ContentFile

def compress_and_convert_to_webp(image_field, max_dimension=1920, quality=85):
    """
    Optimizes an uploaded image file:
    1. Fixes EXIF orientation.
    2. Resizes proportionally if larger than max_dimension.
    3. Converts to WEBP format with high efficiency compression (85% quality).
    4. Returns a Django ContentFile ready for saving into an ImageField.
    """
    if not image_field:
        return None

    try:
        if not hasattr(image_field, 'file'):
            return None
        
        # Open image with PIL safely
        img = Image.open(image_field.file)
        img = ImageOps.exif_transpose(img)

        # Handle RGBA / Palette mode for WebP conversion
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')

        # Proportional resize if needed
        width, height = img.size
        if width > max_dimension or height > max_dimension:
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

        # Output to BytesIO as WebP
        buffer = BytesIO()
        img.save(buffer, format='WEBP', quality=quality, optimize=True)
        buffer.seek(0)

        # Generate filename with .webp extension
        original_name = os.path.basename(image_field.name)
        name_without_ext = os.path.splitext(original_name)[0]
        new_filename = f"{name_without_ext}.webp"

        return ContentFile(buffer.read(), name=new_filename)

    except Exception as e:
        # Fallback if file doesn't exist on disk yet or is string path
        return None

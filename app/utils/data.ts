export const PDFTOOLS = [
    { title: "PDF Compressor", description: "Compress your PDF files online for free. Reduce file size without losing quality.", url: "/pdf/compress" },
    { title: "PDF Converter", description: "Convert your PDF files to and from various formats like Word, Excel, PowerPoint, and more.", url: "/pdf/convert" },
    { title: "PDF Editor", description: "Edit your PDF files online. Add text, images, annotations, and more with our free PDF editor.", url: "/pdf/edit" },
    { title: "PDF Merger", description: "Merge multiple PDF files into one. Combine your documents easily with our free online tool.", url: "/pdf/merge" },
    { title: "PDF Splitter", description: "Split your PDF files into smaller parts. Extract pages or split by page ranges for free online.", url: "/pdf/split" },
    { title: "PDF OCR", description: "Extract text from scanned PDF files using our free online OCR tool. Convert images to editable text.", url: "/pdf/ocr" },
    { title: "PDF to Image Converter", description: "Convert your PDF files to high-quality images online for free. Choose from various image formats.", url: "/pdf/to-image" },

]


type TOOL = {
    title: string;
    desc: string;
}

export const pdf_tools: TOOL[] = [
    {
        title: "pdf_compressor",
        desc: "pdf_compressor_desc"
    },
    {
        title: "pdf_converter",
        desc: "pdf_compressor_desc"
    },
    {
        title: "pdf_editor",
        desc: "pdf_compressor_desc"
    },
    {
        title: "pdf_merger",
        desc: "pdf_merger_desc"
    },
    {
        title: "pdf_splitter",
        desc: "pdf_splitter_desc"
    },
    {
        title: "pdf_ocr",
        desc: "pdf_ocr_desc"
    },
    {
        title: "pdf_image",
        desc: "pdf_image_desc"
    }
]



export const VIDEO_TOOLS = [

    { title: "Video Compressor", description: "Compress your video files online for free. Reduce file size without losing quality.", url: "/video/compress" },
    { title: "Video Converter", description: "Convert your video files to and from various formats like MP4, AVI, MOV, and more.", url: "/video/convert" },
    { title: "Video Trimmer", description: "Trim your video files online for free. Cut unwanted parts and keep only what you need.", url: "/video/trim" },
    { title: "Video Merger", description: "Merge multiple video files into one. Combine your clips easily with our free online tool.", url: "/video/merge" },
    { title: "Video Resizer", description: "Resize your video files online for free. Adjust dimensions and aspect ratio easily.", url: "/video/resize" },
    { title: "Video to GIF Converter", description: "Convert your video files to animated GIFs online for free. Create fun and shareable GIFs easily.", url: "/video/to-gif" },
]

export const video_tools: TOOL[] = [
    {
        title: "video_compressor",
        desc: "video_compressor_desc"
    },
    {
        title: "video_converter",
        desc: "video_converter_desc"
    },
    {
        title: "video_trimmer",
        desc: "video_trimmer_desc"
    },
    {
        title: "video_merger",
        desc: "video_merger_desc"
    },
    {
        title: "video_resizer",
        desc: "video_resizer_desc"
    },
    {
        title: "video_gif",
        desc: "video_gif_desc"
    }
]

export const IMAGE_TOOLS = [
    { title: "Image Compressor", description: "Compress your image files online for free. Reduce file size without losing quality.", url: "/image/compress" },
    { title: "Image Converter", description: "Convert your image files to and from various formats like JPEG, PNG, GIF, and more.", url: "/image/convert" },
    { title: "Image Resizer", description: "Resize your image files online for free. Adjust dimensions and aspect ratio easily.", url: "/image/resize" },
    { title: "Image Cropper", description: "Crop your image files online for free. Remove unwanted areas and focus on what matters.", url: "/image/crop" },
    { title: "Image Rotator", description: "Rotate your image files online for free. Adjust orientation easily with our free tool.", url: "/image/rotate" },
    { title: "Image to PDF Converter", description: "Convert your image files to PDF format online for free. Create PDFs from your images easily.", url: "/image/to-pdf" },
]


export const image_tools: TOOL[] = [
    {
        title: "image_compressor",
        desc: "image_compressor_desc"
    },
    {
        title: "image_converter",
        desc: "image_converter_desc"
    },
    {
        title: "image_resizer",
        desc: "image_resizer_desc"
    },
    {
        title: "image_resizer",
        desc: "image_resizer_desc"
    },
    {
        title: "image_cropper",
        desc: "image_cropper_desc"
    },
    {
        title: "image_rotator",
        desc: "image_rotator_desc"
    },
    {
        title: "image_pdf",
        desc: "image_pdf_desc"
    },
    //img to webp, jpeg, jpg, png
]



export const developer_tools: TOOL[] = [
    {
        title: "json_formatter",
        desc: "json_formmatter_desc"
    },
]

export const OTHER_TOOLS = [
    { title: "QR Code Generator", description: "Generate QR codes online for free. Create custom QR codes easily with our free tool.", url: "/other/qr-code-generator" },
    { title: "Color Picker", description: "Pick colors online for free. Get color codes and palettes easily with our free tool.", url: "/other/color-picker" },
    { title: "Unit Converter", description: "Convert units online for free. Convert between different measurement units easily with our free tool.", url: "/other/unit-converter" },
    { title: "Password Generator", description: "Generate strong passwords online for free. Create secure passwords easily with our free tool.", url: "/other/password-generator" },
    { title: "Time Zone Converter", description: "Convert time zones online for free. Get accurate time conversions easily with our free tool.", url: "/other/time-zone-converter" },
]

export const other_tools: TOOL[] = [
    {
        title: "qr_code_generator",
        desc: "qr_code_generator_desc"
    },
    {
        title: "color_picker",
        desc: "color_picker_desc"
    },
    {
        title: "unit_converter",
        desc: "unit_converter_desc"
    },
    {
        title: "password_generator",
        desc: "password_generator_desc"
    },
    {
        title: "time_zone_converter",
        desc: "time_zome_converter_desc"
    },
    {
        title: "bg_remover",
        desc: "bg_remover_desc"
    },
    {
        title: "file_converter",
        desc: "file_converter_desc"
    },

]


export const SEO_TOOLS = [
    { title: "Meta Tag Generator", description: "Generate meta tags online for free. Create SEO-friendly meta tags easily with our free tool.", url: "/seo/meta-tag-generator" },
    { title: "Sitemap Generator", description: "Generate sitemaps online for free. Create XML sitemaps easily with our free tool.", url: "/seo/sitemap-generator" },
    { title: "Robots.txt Generator", description: "Generate robots.txt files online for free. Create custom robots.txt files easily with our free tool.", url: "/seo/robots-txt-generator" },
]

export const seo_tools: TOOL[] = [

]


export const routes = [
    "/",
    "search",
    "all-tools",
    "about",
    "about",
    "amazon",
    "robots.txt",
    "sitemap.xml",
    "llms.txt",
    "docx-tools",
    "latex-tools",
    "text-tools",
    "text-tools/chatgpt-editor",
    "text-tools/gemini-editor",
    "text-tools/editor",
    "spreadsheet",
    "seo-tools",
    "code-formatter",
    "json-tools",
    "api-tools",
    "favicon-maker",
    "icon-resizer",
    "privacy-policy",
    "terms-and-conditions",
    "blog",
    "blog/:slug",
    "subtitle-tools",
    "subtitle-tools/edit",
    "subtitle-tools/convert",
    "subtitle-tools/merge",
    "pdf-tools",
    "pdf-tools/merge-pdf",
    "pdf-tools/split-pdf",
    "pdf-tools/word-to-pdf",
    "pdf-tools/pdf-to-images",
    "pdf-tools/pdf-to-text",
    "pdf-tools/compress-pdf",
    "tools",
    "tools/image-converter",
    "tools/file-converter",
    "tools/qr-generator",
    "tools/bg-remover",
    "tools/video-compressor",
    "image-tools",
    "image-tools/images-to-pdf"

]
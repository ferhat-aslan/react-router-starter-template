export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    image?: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "welcome-to-kleinbyte",
        title: "Welcome to Kleinbyte Digital Tools",
        excerpt: "Discover our comprehensive suite of free online tools for PDF, DOCX, Images, and more.",
        content: `
      <p>Welcome to Kleinbyte, your one-stop destination for all your digital document needs. We understand the frustration of switching between multiple websites to perform simple tasks like merging PDFs, converting images, or formatting code. That's why we've built a comprehensive platform that brings all these tools together in one place.</p>
      
      <h2>Why Choose Kleinbyte?</h2>
      <p>Our mission is to provide high-quality, free tools that are accessible to everyone. Whether you're a student, a professional, or a developer, you'll find tools that streamline your workflow.</p>
      
      <ul>
        <li><strong>100% Free:</strong> No hidden costs, no subscriptions.</li>
        <li><strong>Privacy Focused:</strong> We prioritize your privacy. Files are processed securely.</li>
        <li><strong>Fast & Efficient:</strong> Our tools are optimized for speed and performance.</li>
      </ul>

      <h2>Explore Our Tools</h2>
      <p>We offer a wide range of tools across various categories:</p>
      <ul>
        <li><strong>PDF Tools:</strong> Merge, split, convert, and edit PDFs.</li>
        <li><strong>Image Tools:</strong> Convert, resize, and compress images.</li>
        <li><strong>Developer Tools:</strong> JSON formatters, SEO tools, and more.</li>
      </ul>
      
      <p>Stay tuned for more updates and new tools!</p>
    `,
        date: "2023-10-27",
        author: "Kleinbyte Team",
    },
    {
        slug: "top-5-pdf-tools",
        title: "Top 5 PDF Tools You Need",
        excerpt: "Boost your productivity with these essential PDF tools for everyday tasks.",
        content: `
      <p>PDFs are the standard for sharing documents, but working with them can sometimes be tricky. Here are the top 5 PDF tools available on Kleinbyte that will make your life easier.</p>
      
      <h3>1. Merge PDF</h3>
      <p>Combine multiple PDF files into a single document. Perfect for organizing reports or project files.</p>
      
      <h3>2. Split PDF</h3>
      <p>Extract specific pages from a large PDF. Useful when you only need to share a portion of a document.</p>
      
      <h3>3. Word to PDF</h3>
      <p>Convert your Word documents to professional-looking PDFs while preserving formatting.</p>
      
      <h3>4. PDF to Images</h3>
      <p>Turn PDF pages into high-quality images (JPG or PNG) for easy sharing on social media or presentations.</p>
      
      <h3>5. PDF to Text</h3>
      <p>Extract text from PDFs to edit or reuse content without retyping.</p>
      
      <p>Try these tools today and see how much time you can save!</p>
    `,
        date: "2023-11-05",
        author: "Kleinbyte Team",
    },
    {
        slug: "optimizing-images-for-web",
        title: "Optimizing Images for the Web",
        excerpt: "Learn how to improve your website's performance by optimizing your images.",
        content: `
      <p>Images are a crucial part of any website, but they can also slow down your page load times if not optimized correctly. In this guide, we'll explore why image optimization matters and how you can use Kleinbyte's tools to achieve it.</p>
      
      <h2>Why Optimize?</h2>
      <p>Large image files take longer to download, which increases page load time. This can lead to higher bounce rates and lower SEO rankings. Optimizing images ensures they look good while being as small as possible.</p>
      
      <h2>How to Optimize with Kleinbyte</h2>
      <p>Our <strong>Image Compressor</strong> and <strong>Image Converter</strong> tools are designed to help you:</p>
      <ul>
        <li><strong>Compress:</strong> Reduce file size without noticeable quality loss.</li>
        <li><strong>Convert:</strong> Switch to modern formats like WebP for better compression.</li>
        <li><strong>Resize:</strong> Scale images to the exact dimensions needed for your layout.</li>
      </ul>
      
      <p>Start optimizing your images today and speed up your web experience!</p>
    `,
        date: "2023-11-12",
        author: "Kleinbyte Team",
    },
];

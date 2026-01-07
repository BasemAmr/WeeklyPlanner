import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Decorations configuration
export const DECORATIONS = {
    leafBackground: [
        '/assets/svg/llleaves.svg',
        '/assets/svg/llleaves(1).svg',
        '/assets/svg/llleaves(2).svg'
    ],
    cornerFlower: '/assets/svg/Leaves-For-paper-flower-1.svg',
    cornerBlobs: [
        '/assets/svg/svg-shape-blob-8.svg',
        '/assets/svg/svg-shape-blob-11.svg'
    ]
};

// Convert SVG string to Data URI
export function svgToDataUri(svgString: string): string {
    const encoded = encodeURIComponent(svgString)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
    return `data:image/svg+xml,${encoded}`;
}

// Fetch SVG and convert to data URI
export async function fetchSvgAsDataUri(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const svgText = await response.text();
        return svgToDataUri(svgText);
    } catch {
        return null;
    }
}

// Add decorations to PDF page
export async function addPageDecorations(doc: jsPDF) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Light background
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(0, 0, width, height, 'F');

    // Corner blobs (simple circles as fallback)
    doc.setFillColor(226, 232, 240); // slate-200
    doc.circle(width + 20, -20, 60, 'F'); // Top right
    doc.circle(-20, height + 20, 60, 'F'); // Bottom left

    // Try to add SVG decorations
    try {
        // Random leaf background
        const leafIndex = Math.floor(Math.random() * DECORATIONS.leafBackground.length);
        const leafUri = await fetchSvgAsDataUri(DECORATIONS.leafBackground[leafIndex]);
        if (leafUri) {
            // Add leaf decoration to top-right corner (small, faded)
            doc.addImage(leafUri, 'SVG', width - 60, 5, 50, 50);
        }

        // Corner flower
        const flowerUri = await fetchSvgAsDataUri(DECORATIONS.cornerFlower);
        if (flowerUri) {
            // Add flower to bottom-left corner (small, faded)
            doc.addImage(flowerUri, 'SVG', 5, height - 35, 25, 30);
        }
    } catch (e) {
        // Silently fail - decorations are optional
        console.warn('Could not load SVG decorations', e);
    }
}

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

export interface Heading {
    depth: number;
    slug: string;
    text: string;
    children?: Heading[];
}

/**
 * Extract headings from markdown content
 */
export async function extractHeadings(markdown: string): Promise<Heading[]> {
    const headings: Heading[] = [];

    const processor = remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(() => (tree) => {
            visit(tree, 'heading', (node: any) => {
                // Skip h1 (title) as it's typically the post title
                if (node.depth === 1) return;

                // Extract the text content from the heading
                let text = '';
                visit(node, 'text', (textNode: any) => {
                    text += textNode.value;
                });

                // Generate a slug for the heading
                const slug = text
                    .toLowerCase()
                    .replace(/[^a-z0-9 ]/g, '')
                    .replace(/\s+/g, '-');

                headings.push({
                    depth: node.depth,
                    slug,
                    text
                });
            });
        });

    await processor.process(markdown);

    // Convert flat list to hierarchical structure
    return buildHeadingTree(headings);
}

/**
 * Build a hierarchical tree of headings based on their depth
 */
function buildHeadingTree(headings: Heading[]): Heading[] {
    if (headings.length === 0) return [];

    const result: Heading[] = [];
    let currentLevel: Heading[] = result;
    const parentStack: Heading[][] = [];
    let prevDepth = 0;

    headings.forEach((heading) => {
        const { depth } = heading;

        if (depth > prevDepth) {
            // Going deeper in the hierarchy
            if (currentLevel.length > 0) {
                const lastItem = currentLevel[currentLevel.length - 1];
                if (!lastItem.children) lastItem.children = [];
                parentStack.push(currentLevel);
                currentLevel = lastItem.children;
            }
        } else if (depth < prevDepth) {
            // Moving back up the hierarchy
            while (parentStack.length > 0 && depth <= prevDepth) {
                currentLevel = parentStack.pop()!;
                prevDepth--;
            }
        }

        currentLevel.push(heading);
        prevDepth = depth;
    });

    return result;
}

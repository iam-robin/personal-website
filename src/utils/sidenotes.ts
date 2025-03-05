import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

interface FootnoteReference {
    identifier: string;
    label: string;
    position: number;
}

interface FootnoteDefinition {
    identifier: string;
    content: string;
}

/**
 * Extract text from a node and its children
 */
function extractTextFromNode(node: any): string {
    if (!node) return '';

    // If it's a text node, return its value
    if (node.type === 'text') {
        return node.value;
    }

    // If it has children, extract text from each child and join
    if (node.children && Array.isArray(node.children)) {
        return node.children.map((child: any) => extractTextFromNode(child)).join('');
    }

    // For other types of nodes, return empty string
    return '';
}

/**
 * Process markdown content to extract footnotes and generate sidenote HTML
 */
export async function processSidenotes(markdown: string): Promise<{
    footnoteReferences: FootnoteReference[];
    footnoteDefinitions: FootnoteDefinition[];
}> {
    const footnoteReferences: FootnoteReference[] = [];
    const footnoteDefinitions: FootnoteDefinition[] = [];
    let position = 0;

    const processor = remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(() => (tree) => {
            // Find all footnote references
            visit(tree, 'footnoteReference', (node: any) => {
                position++;
                footnoteReferences.push({
                    identifier: node.identifier,
                    label: node.label || node.identifier,
                    position
                });
            });

            // Find all footnote definitions
            visit(tree, 'footnoteDefinition', (node: any) => {
                // Handle each child of the footnote definition
                const content = node.children
                    .map((child: any) => {
                        if (child.type === 'paragraph') {
                            // Use our custom function instead of toString
                            return extractTextFromNode(child);
                        }
                        return '';
                    })
                    .join('\n');

                footnoteDefinitions.push({
                    identifier: node.identifier,
                    content
                });
            });
        });

    await processor.process(markdown);

    return {
        footnoteReferences,
        footnoteDefinitions
    };
}

/**
 * Generate HTML for sidenotes based on extracted footnote data
 */
export function generateSidenotesHtml(
    footnoteReferences: FootnoteReference[],
    footnoteDefinitions: FootnoteDefinition[]
): { markers: Record<string, string>; definitions: string } {
    const markers: Record<string, string> = {};
    let definitionsHtml = '';

    // Create markers to replace footnote references
    footnoteReferences.forEach((ref) => {
        const definition = footnoteDefinitions.find((def) => def.identifier === ref.identifier);
        if (!definition) return;

        const checkboxId = `sn-${ref.position}`;

        // HTML for the sidenote marker
        markers[ref.identifier] = `
      <label class="margin-toggle sidenote-number" for="${checkboxId}"></label>
      <input type="checkbox" id="${checkboxId}" class="margin-toggle" />
      <span class="sidenote">${definition.content}</span>
    `;
    });

    // Create hidden definitions section (as a fallback)
    definitionsHtml = `
    <div class="footnotes" style="display: none;">
      <ol>
        ${footnoteDefinitions
            .map(
                (def) => `
          <li id="fn-${def.identifier}">
            <p>${def.content}</p>
          </li>
        `
            )
            .join('')}
      </ol>
    </div>
  `;

    return { markers, definitions: definitionsHtml };
}

import fs from 'fs';
import path from 'path';
import ExifReader from 'exifreader';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renamePhotos(directoryPath) {
    // Convert to absolute path if relative
    const absolutePath = path.resolve(process.cwd(), directoryPath);

    // Check if directory exists
    if (!fs.existsSync(absolutePath)) {
        console.error(`Directory does not exist: ${absolutePath}`);
        console.log('Creating directory...');
        fs.mkdirSync(absolutePath, { recursive: true });
    }

    const files = fs.readdirSync(absolutePath);
    console.log(`Processing ${files.length} files in ${absolutePath}`);

    for (const file of files) {
        const filePath = path.join(absolutePath, file);

        if (!fs.statSync(filePath).isFile()) continue;

        try {
            const imageBuffer = fs.readFileSync(filePath);
            const tags = await ExifReader.load(imageBuffer);

            if (tags.DateTimeOriginal) {
                const date = tags.DateTimeOriginal.description.replace(/:/g, '-').replace(' ', '_');

                const extension = path.extname(file);
                const newName = `${date}${extension}`;
                const newPath = path.join(absolutePath, newName);

                if (filePath !== newPath) {
                    fs.renameSync(filePath, newPath);
                    console.log(`Renamed: ${file} → ${newName}`);
                }
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
}

const directory = process.argv[2];
if (!directory) {
    console.error('Please provide a directory path');
    process.exit(1);
}

renamePhotos(directory);

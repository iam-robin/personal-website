import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ExifReader from 'exifreader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const photosDir = path.join(__dirname, '../src/assets/365/photos');
const contentDir = path.join(__dirname, '../src/content/365');
const configPath = path.join(__dirname, '../src/assets/365/content.json');

let config = {};
if (fs.existsSync(configPath)) {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configFile);
}

fs.readdir(photosDir, (err, files) => {
    if (err) {
        console.error('Error reading photos directory:', err);
        return;
    }

    files.forEach((file) => {
        if (path.extname(file) === '.jpg') {
            const filePath = path.join(photosDir, file);
            const fileNameWithoutExt = path.basename(file, '.jpg');
            const [datePart, timePart] = fileNameWithoutExt.split('_');
            const isoDate = `${datePart}T${timePart.replace(/-/g, ':')}`; // Convert to ISO 8601 format

            let additionalContent = '';
            if (config[datePart]) {
                additionalContent = Object.entries(config[datePart])
                    .map(([key, value]) => {
                        if (Array.isArray(value)) {
                            return `${key}: [${value.map((v) => `'${v}'`).join(', ')}]`;
                        }
                        return `${key}: ${value}`;
                    })
                    .join('\n');
            }

            // Read the photo file and extract EXIF data
            const photoBuffer = fs.readFileSync(filePath);
            const tags = ExifReader.load(photoBuffer);

            const cameraBrand = tags['Make'] ? tags['Make'].description : 'Unknown';
            const cameraModel = tags['Model'] ? tags['Model'].description : 'Unknown';
            const lensBrand = tags['LensMake'] ? tags['LensMake'].description : 'Unknown';
            const lensModel = tags['LensModel'] ? tags['LensModel'].description : 'Unknown';
            const focalLength = tags['FocalLength'] ? tags['FocalLength'].description : 'Unknown';

            const mdContent = `---
image: 'src/assets/365/photos/${file}'
date: ${isoDate}
day: '${datePart}'
time: '${timePart.replace(/-/g, ':')}'
cameraBrand: '${cameraBrand}'
cameraModel: '${cameraModel}'
lensBrand: '${lensBrand}'
lensModel: '${lensModel}'
focalLength: '${focalLength}'
${additionalContent}
---`;

            const mdFilePath = path.join(contentDir, `${fileNameWithoutExt}.md`);

            // Always write the file, overwriting if it exists
            fs.writeFile(mdFilePath, mdContent, (err) => {
                if (err) {
                    console.error('Error writing markdown file:', err);
                } else {
                    console.log(`Created or updated ${mdFilePath}`);
                }
            });
        }
    });
});

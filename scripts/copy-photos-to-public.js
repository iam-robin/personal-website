import fs from 'fs';
import path from 'path';

const sourceDir = process.argv[2];
const targetDir = process.argv[3];

if (!sourceDir || !targetDir) {
    console.error('Please provide both source and target directories as arguments.');
    process.exit(1);
}

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error(`Error reading source directory: ${err.message}`);
        process.exit(1);
    }

    files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
            const sourceFile = path.join(sourceDir, file);
            const targetFile = path.join(targetDir, file);

            fs.copyFile(sourceFile, targetFile, (err) => {
                if (err) {
                    console.error(`Error copying file ${file}: ${err.message}`);
                } else {
                    console.log(`Copied ${file} to ${targetDir}`);
                }
            });
        }
    });
});

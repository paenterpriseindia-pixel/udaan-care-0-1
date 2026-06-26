const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/app').concat(walk('src/components'));
let modified = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace 4 columns
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "repeat\(4,\s*1fr\)", gap: (\d+) }}/g, 'className="grid-responsive-4" style={{ gap: $1 }}');
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "repeat\(4,\s*1fr\)", gap: (\d+), marginBottom: (\d+) }}/g, 'className="grid-responsive-4" style={{ gap: $1, marginBottom: $2 }}');

    // Replace 3 columns
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "repeat\(3,\s*1fr\)", gap: (\d+) }}/g, 'className="grid-responsive-3" style={{ gap: $1 }}');
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "repeat\(3,\s*1fr\)", gap: (\d+), marginBottom: (\d+) }}/g, 'className="grid-responsive-3" style={{ gap: $1, marginBottom: $2 }}');

    // Replace 2 columns
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: (\d+) }}/g, 'className="grid-responsive-2" style={{ gap: $1 }}');
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: (\d+), marginBottom: (\d+) }}/g, 'className="grid-responsive-2" style={{ gap: $1, marginBottom: $2 }}');
    
    // Replace 2 columns with tailwind classes (ContactPage)
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: (\d+), alignItems: "start" }} className="grid grid-cols-1 lg:grid-cols-2"/g, 'className="grid-responsive-2" style={{ gap: $1, alignItems: "start" }}');
    
    // Additional case: repeat(4, 1fr) with gap: 0
    content = content.replace(/style={{ display: "grid", gridTemplateColumns: "repeat\(4,1fr\)", gap: 0 }}/g, 'className="grid-responsive-4"');

    // Remove empty styles
    content = content.replace(/ style={{ }}/g, '');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        modified++;
        console.log('Modified:', file);
    }
});

console.log('Total modified:', modified);

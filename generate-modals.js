const fs = require('fs');
const path = require('path');

const files = {
  'src/features/posts/modals/AddModal.tsx': `export default function AddModal() { return <div>Add Modal Placeholder</div>; }`,
  'src/features/posts/modals/ChangeModal.tsx': `export default function ChangeModal() { return <div>Change Modal Placeholder</div>; }`,
  'src/features/posts/modals/ChangeCoverModal.tsx': `export default function ChangeCoverModal() { return <div>Change Cover Modal Placeholder</div>; }`,
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created ' + filepath);
});

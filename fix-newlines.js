const fs = require('fs');

const files = [
  'src/lib/config.ts',
  'src/helpers/apiHelper.ts',
  'src/helpers/toolsHelper.ts',
  'src/hooks/useInput.ts',
  'src/hooks/redux.ts',
  'src/types/index.ts',
  'src/types/action.ts',
  'src/features/auth/api/authApi.ts',
  'src/features/users/api/userApi.ts',
  'src/features/posts/api/postApi.ts',
  'src/store.ts',
  'src/components/Providers.tsx',
  'src/app/layout.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  fs.writeFileSync(f, content);
  console.log('Fixed ' + f);
});

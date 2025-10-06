# Letters builder
- HTML syntax
- Ability to use inline js native language
- CSS injection for easier style creation
- Builtin HTML sanitizer, ability to throw error if tags stripped
- Simple contract: 
folder/
    ├── index.html
    ├── styles.css
- index.html 
1. should use props.field syntax to access properties
2. use ${} js template string to place a value
3. can use JS native inline syntax \<p>${props.value1 > 10 ? props.value2 : ""}\</p>

## Example
```js
const EMAIL = 'naughtysora@proton.me';

const templates = new Template({ throwSanitize: true })
  .load([path.resolve(__dirname, "./reset-password"),]);

const html = templates.html("reset-password", { name: "Sora" });

const info = await mailer.sendMail({ 
  from: EMAIL, 
  to: EMAIL, 
  html,
});
```
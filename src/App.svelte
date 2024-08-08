<script>
  import { onMount } from 'svelte';
  let debugLogs = [];

  let text1 = `I stepped on the cat,
It didn't like that,
And now it's gone away.
猫ネコ猫ねこ🐈`;
  let text2 = `I stepped on the dog,
It didn't hate that,
And now it's gone away.
猫ネコ犬🐕ねこ🐕`;

  let diff = [];
  let uid = "default_user";  // ユーザーID（適宜設定してください）
  let id; // 新規作成時はID不要
  let user = null;  // ログインユーザー
  let loginResult = ""; // ログイン結果表示用

  function log(message) {
    debugLogs.push(message);
  }

  function compareTexts() {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    diff = [];

    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 !== line2) {
        diff.push({
          parts: generateDiffParts(line1, line2)
        });
      } else {
        diff.push({
          parts: [{ text: line1, class: '' }]
        });
      }
    }
    log('Texts compared');
  }

  function generateDiffParts(line1, line2) {
    const parts1 = line1.split(/(\s+)/);
    const parts2 = line2.split(/(\s+)/);
    const maxParts = Math.max(parts1.length, parts2.length);
    const result = [];

    for (let i = 0; i < maxParts; i++) {
      const part1 = parts1[i] || '';
      const part2 = parts2[i] || '';

      if (part1 !== part2) {
        if (part1) result.push({ text: part1, class: 'deleted' });
        if (part2) result.push({ text: part2, class: 'added' });
      } else {
        result.push({ text: part1 || part2, class: '' });
      }
    }
    return result;
  }

  async function createText() {
    try {
      const response = await fetch('https://cotton-concrete-catsup.glitch.me/api/checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text1, text2, uid })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      log(`Created: ${JSON.stringify(result)}`);
      id = result.id;  // 新規作成されたIDを保持
    } catch (error) {
      log(`Create error: ${error}`);
    }
  }

  async function readTexts() {
    try {
      const response = await fetch(`https://cotton-concrete-catsup.glitch.me/api/checker?uid=${uid}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      log(`Fetched: ${JSON.stringify(result)}`);
    } catch (error) {
      log(`Read error: ${error}`);
    }
  }

  async function updateText() {
    if (!id) {
      log('No ID set for updating');
      return;
    }

    try {
      const response = await fetch('https://cotton-concrete-catsup.glitch.me/api/checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, text1, text2, uid })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      log(`Updated: ${JSON.stringify(result)}`);
    } catch (error) {
      log(`Update error: ${error}`);
    }
  }

  async function deleteText() {
    if (!id) {
      log('No ID set for deleting');
      return;
    }

    try {
      const response = await fetch('https://cotton-concrete-catsup.glitch.me/api/checker/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, uid })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      log(`Deleted: ${JSON.stringify(result)}`);
      id = null;  // 削除後にIDをクリア
    } catch (error) {
      log(`Delete error: ${error}`);
    }
  }

  async function initDatabase() {
    try {
      const response = await fetch('https://cotton-concrete-catsup.glitch.me/api/init-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: 'init' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      log(`Database initialized: ${JSON.stringify(result)}`);
    } catch (error) {
      log(`Init database error: ${error}`);
    }
  }

  // Firebase 初期化
  onMount(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyBcOlIDP2KWbJuKM0WeMHNp-WvjTVfLt9Y",
      authDomain: "p2auth-ea50a.firebaseapp.com",
      projectId: "p2auth-ea50a",
      storageBucket: "p2auth-ea50a.appspot.com",
      messagingSenderId: "796225429484",
      appId: "1:796225429484:web:ece56ef2fc0be28cd6eac9"
    };
    firebase.initializeApp(firebaseConfig);

    const googleProvider = new firebase.auth.GoogleAuthProvider();
  });

  async function googleLogin() {
    try {
      const result = await firebase.auth().signInWithPopup(googleProvider);
      user = result.user;
      loginResult = `Logged in as: ${user.displayName}`;
      log(`Logged in as: ${user.displayName}`);
    } catch (error) {
      log(`Login error: ${error.message}`);
    }
  }

  async function signOut() {
    try {
      await firebase.auth().signOut();
      user = null;
      loginResult = "";
      log('Signed out');
    } catch (error) {
      log(`Sign out error: ${error.message}`);
    }
  }
</script>

<main>
  <div class="debug">
    <h3>Debug Logs</h3>
    <ul>
      {#each debugLogs as log}
        <li>{log}</li>
      {/each}
    </ul>
  </div>

  <div class="container">
    <textarea bind:value={text1} placeholder="text 1"></textarea>
    <textarea bind:value={text2} placeholder="text 2"></textarea>
  </div>

  <button on:click={compareTexts}>Compare</button>
  <button on:click={createText}>Create</button>
  <button on:click={readTexts}>Read</button>
  <button on:click={updateText}>Update</button>
  <button on:click={deleteText}>Delete</button>
  <button on:click={initDatabase}>Init Database</button>

  <div id="loginContainer">
    {#if user === null}
      <button on:click={googleLogin}>Login with Google</button>
    {/if}
    {#if user !== null}
      <div>{loginResult} <button on:click={signOut}>Sign Out</button></div>
    {/if}
  </div>

  <div class="diff-output">
    {#each diff as line, index}
      <div>
        {index + 1}:
        {#each line.parts as part}
          <span class={part.class}>
            {part.text}
          </span>
        {/each}
      </div>
    {/each}
  </div>
</main>

<style>
  .container {
    display: flex;
  }

  textarea {
    width: 50%; /* Each textarea takes up half the width */
    height: 150px; 
    padding: 10px;
    box-sizing: border-box; 
  }
  .diff-output {
    white-space: pre-wrap;
  }
  .deleted {
    color: red;
    text-decoration: line-through;
  }
  .added {
    color: blue;
  }
  .debug {
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  #loginContainer {
    margin-top: 20px;
  }
</style>

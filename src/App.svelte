<script>
  let text1 = `I stepped on the cat,
It didn't like that,
And now it's gone away.
猫ネコ猫ねこ🐈`;
  let text2 = `I stepped on the dog,
It didn't hate that,
And now it's gone away.
猫ネコ犬🐕ねこ🐕`;

  let diff = [];

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
</script>

<main>
  <div class="container">
    <textarea bind:value={text1} placeholder="text 1"></textarea>
    <textarea bind:value={text2} placeholder="text 2"></textarea>
  </div>

  <button on:click={compareTexts}>Compare</button>

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
  /* Add your CSS styles here */
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
</style>
